/* AURA Live — the publication ledger.
 *
 * The site had no database when this was built, so this is the smallest
 * production-appropriate thing that satisfies what the feed actually
 * needs: one small JSON document, read on render, rewritten by the
 * scheduled job.
 *
 * Two drivers, one interface.
 *
 *   blob  Vercel Blob. First-party on the platform the site already
 *         deploys to, no server to run, and the read path is a CDN URL.
 *         Used whenever BLOB_READ_WRITE_TOKEN is present.
 *   file  A JSON file under .aura-life/. Used for local development and
 *         in tests, where a network round trip to a blob store would buy
 *         nothing. Not durable on serverless, and never selected there.
 *
 * If the feed ever outgrows one document — tens of thousands of entries,
 * or more than one estate writing concurrently — this interface is the
 * seam to put Postgres behind. Nothing above it knows which driver it is
 * talking to.
 *
 * Writes are last-writer-wins. The scheduled job is the only writer and
 * runs on a cron, so two concurrent writes would need two overlapping
 * runs; the run is idempotent, so even that loses nothing but a little
 * work.
 */

import { FeedDocumentSchema, EMPTY_DOCUMENT, type FeedDocument } from './schema'
import { loadConfig } from './config'

export interface FeedStore {
  readonly driver: 'blob' | 'file'
  read(): Promise<FeedDocument>
  write(doc: FeedDocument): Promise<void>
}

function validate(raw: unknown): FeedDocument {
  const parsed = FeedDocumentSchema.safeParse(raw)
  if (!parsed.success) {
    /* A corrupt ledger must not take the page down, and must not be
       silently replaced either — that would republish the whole archive
       as new. Raise, and let the caller decide. */
    throw new Error('AURA Live ledger failed validation: ' + JSON.stringify(parsed.error.issues.slice(0, 3)))
  }
  return parsed.data
}

/* ── file ────────────────────────────────────────────────────────────── */

class FileStore implements FeedStore {
  readonly driver = 'file' as const
  constructor(private readonly path: string) {}

  async read(): Promise<FeedDocument> {
    const { readFile } = await import('node:fs/promises')
    try {
      return validate(JSON.parse(await readFile(this.path, 'utf8')))
    } catch (err) {
      if ((err as NodeJS.ErrnoException).code === 'ENOENT') return { ...EMPTY_DOCUMENT }
      throw err
    }
  }

  async write(doc: FeedDocument): Promise<void> {
    const { writeFile, mkdir, rename } = await import('node:fs/promises')
    const nodePath = await import('node:path')
    await mkdir(nodePath.dirname(this.path), { recursive: true })
    /* Write-then-rename, so a reader never sees a half-written ledger. */
    const tmp = `${this.path}.${process.pid}.tmp`
    await writeFile(tmp, JSON.stringify(validate(doc), null, 2), 'utf8')
    await rename(tmp, this.path)
  }
}

/* ── blob ────────────────────────────────────────────────────────────── */

class BlobStore implements FeedStore {
  readonly driver = 'blob' as const
  constructor(private readonly key: string) {}

  async read(): Promise<FeedDocument> {
    const { head, BlobNotFoundError } = await import('@vercel/blob')
    try {
      const meta = await head(this.key)
      /* Read through the CDN url rather than the API, and skip the edge
         cache: the job needs the ledger it just wrote, not a copy of it. */
      const res = await fetch(meta.url, { cache: 'no-store' })
      if (!res.ok) {
        if (res.status === 404) return { ...EMPTY_DOCUMENT }
        throw new Error(`Blob read failed: ${res.status}`)
      }
      return validate(await res.json())
    } catch (err) {
      /* An empty store is the normal first state of a new environment,
         and it is not a failure.
         `head()` signals it with BlobNotFoundError, whose message reads
         "Vercel Blob: The requested blob does not exist". This used to be
         matched on the message against /not found|404|BlobNotFound/ — the
         phrase is "does not exist", so it never matched, the error was
         rethrown, and every environment that had a blob token but had not
         yet had a ledger written reported the feed as unreadable. /now
         then told readers the record could not be reached when the truth
         was that nothing had been written to it yet.
         Matched on the class now. Deliberately narrow: BlobStoreNotFound
         and BlobServiceNotAvailable are real faults and still raise. */
      if (err instanceof BlobNotFoundError) return { ...EMPTY_DOCUMENT }
      throw err
    }
  }

  async write(doc: FeedDocument): Promise<void> {
    const { put } = await import('@vercel/blob')
    await put(this.key, JSON.stringify(validate(doc)), {
      access: 'public',
      contentType: 'application/json',
      /* The key is the identity of the ledger. A random suffix would
         create a new blob on every run and orphan the last one. */
      addRandomSuffix: false,
      allowOverwrite: true,
      cacheControlMaxAge: 60,
    })
  }
}

export function getStore(cfg = loadConfig()): FeedStore {
  if (cfg.store === 'blob') {
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      throw new Error('AURA_LIVE_STORE=blob but BLOB_READ_WRITE_TOKEN is not set')
    }
    return new BlobStore(cfg.storeKey)
  }
  /* The file driver is for local development and tests. On a serverless
     deploy the filesystem is read-only and per-invocation, so selecting
     it there does not fail — it reads ENOENT as an empty ledger and
     throws away every write. The page then reports that nothing has met
     the bar, which is indistinguishable from the feed working and having
     nothing to say. Refuse instead, so the run fails in the log. */
  if (process.env.VERCEL && process.env.NODE_ENV === 'production') {
    throw new Error(
      'AURA Live has no durable store: the file driver cannot persist on Vercel. ' +
      'Set BLOB_READ_WRITE_TOKEN (Vercel Blob) for this environment.',
    )
  }
  return new FileStore(cfg.storeFilePath)
}

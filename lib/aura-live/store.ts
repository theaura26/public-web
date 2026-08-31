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
    const { head } = await import('@vercel/blob')
    try {
      const meta = await head(this.key)
      /* Read through the CDN url rather than the API, and skip the edge
         cache: the job needs the ledger it just wrote, not a copy of it. */
      const res = await fetch(meta.url, { cache: 'no-store' })
      if (!res.ok) throw new Error(`Blob read failed: ${res.status}`)
      return validate(await res.json())
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err)
      if (/not found|404|BlobNotFound/i.test(message)) return { ...EMPTY_DOCUMENT }
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
  return new FileStore(cfg.storeFilePath)
}

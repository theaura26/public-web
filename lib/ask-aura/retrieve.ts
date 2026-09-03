/* Ask Aura — retrieval.
 *
 * Hybrid: BM25 for the exact term, cosine for the question asked in
 * other words, fused by reciprocal rank. Lexical alone misses "how do
 * you look after the soil" against copy that says "we do not buy
 * fertility, we make it"; semantic alone drifts on proper nouns like
 * Sln.795 and Malnad Gidda. Together they hold.
 *
 * Read-only. Nothing here follows an instruction found in the corpus —
 * chunk text is data on the way to an answer, never a directive.
 */

import { readFile } from 'node:fs/promises'
import path from 'node:path'

export type SourceType = 'aura' | 'primary' | 'peer_reviewed' | 'institutional'

export type Chunk = {
  id: string
  namespace: 'aura' | 'external'
  docId: string
  url: string
  title: string
  sectionPath: string
  heading: string
  /** A representative picture of the page, for citation cards. */
  image?: string
  text: string
  hash: string
  sourceType: SourceType
  retrievedAt?: string
  /** base64 int8, see the ingestion script. */
  vec?: string
  publishedAt?: string
  authors?: string
}

type Index = {
  df: Record<string, number>
  docs: Array<{ id: string; len: number; tf: Record<string, number> }>
  avgLen: number
  n: number
}

type Corpus = {
  builtAt: string
  counts: Record<string, number>
  chunks: Chunk[]
  index: Index
}

/* Crude term overlap, used only when no query embedding is available
   and a passage still has to be ranked against its siblings. */
function overlap(query: string, text: string): number {
  const q = new Set(query.toLowerCase().match(/[a-z0-9]+/g) ?? [])
  const t = text.toLowerCase().match(/[a-z0-9]+/g) ?? []
  if (!q.size || !t.length) return 0
  let hits = 0
  for (const w of t) if (q.has(w)) hits++
  return hits / Math.sqrt(t.length)
}

/* Hard ceiling on any single result set. */
const MAX_RESULTS = 12

export type Hit = {
  chunk: Chunk
  score: number
  /** Short supporting passage, for citation and audit. */
  passage: string
  confidence: 'high' | 'medium' | 'low'
}

/* The corpus is a build artefact: load once per process, never per
   request. 600 KB parsed at cold start, then cached. */
let cached: Corpus | null = null
let loading: Promise<Corpus> | null = null

export async function corpus(): Promise<Corpus> {
  if (cached) return cached
  if (!loading) {
    loading = readFile(path.join(process.cwd(), 'data', 'ask-aura', 'corpus.json'), 'utf8')
      .then((raw) => {
        cached = JSON.parse(raw) as Corpus
        return cached
      })
  }
  return loading
}

const STOP = new Set(
  ('a an and are as at be but by for from has have how in is it its of on or that the this to was ' +
   'what when where which who why with you your we our').split(' '),
)

export function tokenise(s: string): string[] {
  return s
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s'-]/gu, ' ')
    .split(/\s+/)
    .filter((t) => t.length > 1 && !STOP.has(t))
}

/* ── BM25 ─────────────────────────────────────────────────────────── */
const K1 = 1.4
const B = 0.75

function lexicalRank(index: Index, query: string): Map<string, number> {
  const terms = tokenise(query)
  const scores = new Map<string, number>()
  if (!terms.length) return scores

  for (const doc of index.docs) {
    let s = 0
    for (const t of terms) {
      const f = doc.tf[t]
      if (!f) continue
      const df = index.df[t] ?? 0
      const idf = Math.log(1 + (index.n - df + 0.5) / (df + 0.5))
      s += idf * ((f * (K1 + 1)) / (f + K1 * (1 - B + B * (doc.len / index.avgLen))))
    }
    if (s > 0) scores.set(doc.id, s)
  }
  return scores
}

/* ── cosine over quantised vectors ────────────────────────────────── */
function unpack(b64: string): Int8Array {
  const buf = Buffer.from(b64, 'base64')
  return new Int8Array(buf.buffer, buf.byteOffset, buf.length)
}

function cosine(a: Int8Array, b: Float32Array): number {
  let dot = 0
  let na = 0
  const len = Math.min(a.length, b.length)
  for (let i = 0; i < len; i++) {
    dot += a[i] * b[i]
    na += a[i] * a[i]
  }
  /* The query vector is already unit length, so only the stored side
     needs normalising. */
  return na ? dot / Math.sqrt(na) : 0
}

/** Embed one query. Returns null when no key is set, so retrieval
 *  degrades to lexical rather than failing. */
export async function embedQuery(text: string, signal?: AbortSignal): Promise<Float32Array | null> {
  const key = process.env.OPENAI_API_KEY
  if (!key) return null
  try {
    const res = await fetch('https://api.openai.com/v1/embeddings', {
      method: 'POST',
      headers: { 'content-type': 'application/json', authorization: `Bearer ${key}` },
      body: JSON.stringify({ model: 'text-embedding-3-small', dimensions: 512, input: text.slice(0, 4000) }),
      signal,
    })
    if (!res.ok) return null
    const json = await res.json()
    const v = json?.data?.[0]?.embedding as number[] | undefined
    if (!v) return null
    let norm = 0
    for (const x of v) norm += x * x
    norm = Math.sqrt(norm) || 1
    return Float32Array.from(v, (x) => x / norm)
  } catch {
    return null
  }
}

/* ── fusion ───────────────────────────────────────────────────────── */
/** Reciprocal rank fusion: robust to the two scales being incomparable. */
function rrf(ranked: string[][], k = 60): Map<string, number> {
  const out = new Map<string, number>()
  for (const list of ranked) {
    list.forEach((id, i) => out.set(id, (out.get(id) ?? 0) + 1 / (k + i + 1)))
  }
  return out
}

export type SearchOptions = {
  limit?: number
  /** Restrict to Aura-authored content, external research, or both. */
  namespaces?: Array<'aura' | 'external'>
  /** Nudge chunks from a page the reader is already on. */
  pageUrl?: string
  signal?: AbortSignal
}

export async function search(query: string, opts: SearchOptions = {}): Promise<Hit[]> {
  const { limit: askedFor = 6, namespaces = ['aura', 'external'], pageUrl, signal } = opts
  /* Clamped here rather than only at the callers: a limit is a promise
     about how much this function will ever return, and a promise every
     caller has to remember to keep is not one. */
  const limit = Math.max(1, Math.min(Math.floor(askedFor) || 6, MAX_RESULTS))
  const c = await corpus()

  const allowed = new Set(
    c.chunks.filter((ch) => namespaces.includes(ch.namespace)).map((ch) => ch.id),
  )
  const byId = new Map(c.chunks.map((ch) => [ch.id, ch]))

  const lex = lexicalRank(c.index, query)
  const lexRanked = [...lex.entries()]
    .filter(([id]) => allowed.has(id))
    .sort((a, b) => b[1] - a[1])
    .slice(0, 40)
    .map(([id]) => id)

  let semRanked: string[] = []
  const qv = await embedQuery(query, signal)
  if (qv) {
    const scored: Array<[string, number]> = []
    for (const ch of c.chunks) {
      if (!ch.vec || !allowed.has(ch.id)) continue
      scored.push([ch.id, cosine(unpack(ch.vec), qv)])
    }
    semRanked = scored.sort((a, b) => b[1] - a[1]).slice(0, 40).map(([id]) => id)
  }

  const fused = rrf([lexRanked, semRanked].filter((l) => l.length))

  /* A passage from the page in view is more likely to be the one meant,
     but not so much that it outranks a better answer elsewhere. */
  if (pageUrl) {
    for (const [id, s] of fused) {
      if (byId.get(id)?.url === pageUrl) fused.set(id, s * 1.15)
    }
  }

  /* Image alt text and glossary entries are real sources, but they are
     captions and definitions rather than prose. Against an ordinary
     question they match strongly on vocabulary and then have nothing to
     say, crowding out the paragraphs that would actually answer it. So
     they carry a penalty unless the question is reaching for exactly
     that register. */
  /* Narrow on purpose. "How do you look after the soil?" is not a
     question about pictures, and "What does Aura grow?" is not a request
     for a definition — an over-eager match here quietly switches off the
     penalty it exists to apply. */
  const wantsVisual = /\b(look(s|ing)? like|what colour|colour of|appearance|photo|photograph|image|picture|shown|depicted|pictured)\b/i.test(query)
  const wantsDefinition = /\b(what (is|are) (a|an|the)?\s*\w+\??$|define|definition|what does .+ mean|meaning of|term)\b/i.test(query)
  for (const [id, s] of fused) {
    const heading = byId.get(id)?.heading
    if (heading === 'Images' && !wantsVisual) fused.set(id, s * 0.6)
    else if (heading === 'Glossary' && !wantsDefinition) fused.set(id, s * 0.85)
  }

  /* No more than a few passages from any one page. A result set drawn
     wholly from one page is a single source wearing six hats — it reads
     as corroboration when it is really repetition. */
  const PER_PAGE = 3
  const ranked = [...fused.entries()].sort((a, b) => b[1] - a[1])

  /* A question asked while standing on a page is usually about that
     page, but it rarely says so: "how does this connect to the coffee?"
     asked on the herd page reads, lexically, as a question about coffee,
     and every slot fills with coffee. The reader is then told about the
     herd by a model that was shown nothing about the herd.

     A multiplier cannot fix this — the page’s passages lose on score, so
     scaling their score still loses. What is needed is a seat kept for
     them: the best passage from the page in view goes into the evidence
     whether or not it earned a place on rank alone. */
  const reserved: Array<[string, number]> = []
  if (pageUrl && ranked.length) {
    let fromPage = ranked.filter(([id]) => byId.get(id)?.url === pageUrl).slice(0, 2)

    /* If the page did not place at all, it is not in the fused list to
       be promoted — both retrievers dropped it before fusion, which is
       exactly the case that matters. Score its own passages directly and
       seat the best of them. */
    if (!fromPage.length) {
      const pageChunks = c.chunks.filter((ch) => ch.url === pageUrl && allowed.has(ch.id))
      const scored: Array<[string, number]> = []
      for (const ch of pageChunks) {
        if (qv && ch.vec) scored.push([ch.id, cosine(unpack(ch.vec), qv)])
        else scored.push([ch.id, overlap(query, ch.text)])
      }
      /* Seated just below the strongest match: relevant because the
         reader is standing on it, not because it won on score. */
      const ceiling = ranked[0][1] * 0.9
      fromPage = scored
        .sort((a, b) => b[1] - a[1])
        .slice(0, 2)
        .map(([id], i) => [id, ceiling * (1 - i * 0.05)] as [string, number])
    }
    reserved.push(...fromPage)
  }

  /* The cap is there to stop one page filling every slot. It must not
     become a rule that throws away the best evidence: when a question is
     about one page, that page holds the answer, and a fourth strong
     passage from it beats a weak one from somewhere else. So the cap
     yields to two things — the page the reader is actually on, and any
     passage still scoring close to the best one found. */
  const strongEnough = (ranked[0]?.[1] ?? 0) * 0.75
  const seenPerPage = new Map<string, number>()
  const top: Array<[string, number]> = []
  const taken = new Set<string>()

  for (const entry of reserved) {
    taken.add(entry[0])
    seenPerPage.set(pageUrl ?? '', (seenPerPage.get(pageUrl ?? '') ?? 0) + 1)
    top.push(entry)
  }

  for (const entry of ranked) {
    if (taken.has(entry[0])) continue
    const url = byId.get(entry[0])?.url ?? ''
    const n = seenPerPage.get(url) ?? 0
    if (n >= PER_PAGE && url !== pageUrl && entry[1] < strongEnough) continue
    seenPerPage.set(url, n + 1)
    top.push(entry)
    if (top.length >= limit) break
  }
  if (!top.length) return []

  /* Reserved passages entered out of rank order; put the set back in
     score order so the model reads the strongest evidence first and the
     confidence below is measured against the true best. */
  top.sort((a, b) => b[1] - a[1])
  top.length = Math.min(top.length, limit)

  const best = top[0][1]
  return top.map(([id, score]) => {
    const chunk = byId.get(id)!
    /* Confidence is relative agreement, not certainty. Both retrievers
       ranking a chunk near the top is the strongest signal available
       without a reranker. */
    const ratio = best ? score / best : 0
    const bothFound = lexRanked.includes(id) && semRanked.includes(id)
    const confidence: Hit['confidence'] =
      bothFound && ratio > 0.6 ? 'high' : ratio > 0.45 ? 'medium' : 'low'
    return {
      chunk,
      score,
      passage: chunk.text.length > 320 ? `${chunk.text.slice(0, 317)}…` : chunk.text,
      confidence,
    }
  })
}

/** One page's chunks, in document order. */
export async function getPage(urlOrId: string): Promise<Chunk[]> {
  const c = await corpus()
  const norm = urlOrId.replace(/\/$/, '')
  return c.chunks.filter(
    (ch) => ch.docId === urlOrId || ch.url === urlOrId || ch.url.replace(/\/$/, '') === norm,
  )
}

/** Every page in the corpus — the topic index. */
export async function listPages(): Promise<Array<{ id: string; title: string; url: string; chunks: number }>> {
  const c = await corpus()
  const seen = new Map<string, { id: string; title: string; url: string; chunks: number }>()
  for (const ch of c.chunks) {
    const e = seen.get(ch.docId)
    if (e) e.chunks++
    else seen.set(ch.docId, { id: ch.docId, title: ch.title, url: ch.url, chunks: 1 })
  }
  return [...seen.values()].sort((a, b) => a.id.localeCompare(b.id))
}

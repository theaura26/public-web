#!/usr/bin/env node
/**
 * Ask Aura — ingestion.
 *
 * Turns the crawler's page dumps into a retrievable corpus: semantic
 * chunks with stable identifiers, chunk-level provenance, and a lexical
 * index. Re-running updates in place rather than duplicating, because
 * chunk ids are derived from the document and the section rather than
 * from position in a list.
 *
 * Aura-authored content and external research live in separate
 * namespaces and never merge. Nothing here follows an instruction found
 * in a crawled page — the pipeline only reads text.
 *
 *   node scripts/ask-aura/ingest.mjs            # incremental
 *   node scripts/ask-aura/ingest.mjs --rebuild  # from scratch
 */
import { createHash } from 'node:crypto'
import { readFile, writeFile, readdir, mkdir } from 'node:fs/promises'
import path from 'node:path'

const DATA = 'data/ask-aura'
const REBUILD = process.argv.includes('--rebuild')

/* A chunk should be one idea. Below the floor it gets folded into its
   neighbour; above the ceiling it splits on sentence boundaries. */
const MIN_CHARS = 180
const MAX_CHARS = 1400

const sha = (s) => createHash('sha256').update(s).digest('hex').slice(0, 16)

/** Truncated embedding width. See the note at the fetch below. */
const EMBED_DIMS = 512

/**
 * Vectors as base64 int8 rather than JSON floats. A float in JSON costs
 * ~20 bytes; a quantised byte costs one. Cosine similarity is unchanged
 * by a uniform scale factor, so normalising to the largest magnitude
 * loses nothing that ranking depends on.
 */
function packVec(embedding) {
  let max = 0
  for (const v of embedding) max = Math.max(max, Math.abs(v))
  const scale = max || 1
  const bytes = Buffer.alloc(embedding.length)
  for (let i = 0; i < embedding.length; i++) {
    bytes[i] = Math.round((embedding[i] / scale) * 127) & 0xff
  }
  return bytes.toString('base64')
}

/** Slug that survives re-crawls: derived from meaning, never position. */
function chunkId(docId, heading, ordinal) {
  const h = heading
    ? heading.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40)
    : 'lede'
  return `${docId}#${h || 'lede'}${ordinal ? `-${ordinal}` : ''}`
}

/** Split overlong prose on sentence boundaries, never mid-sentence. */
function splitLong(text) {
  if (text.length <= MAX_CHARS) return [text]
  const sentences = text.split(/(?<=[.!?])\s+/)
  const out = []
  let buf = ''
  for (const s of sentences) {
    if (buf && (buf + ' ' + s).length > MAX_CHARS) {
      out.push(buf.trim())
      buf = s
    } else {
      buf = buf ? `${buf} ${s}` : s
    }
  }
  if (buf.trim()) out.push(buf.trim())
  return out
}

/**
 * Sections → chunks. Headings travel with their prose, because a
 * retrieved passage without its heading loses the thing that says what
 * it is about.
 */
function chunkPage(page) {
  const chunks = []
  const merged = []

  for (const sec of page.sections) {
    const last = merged[merged.length - 1]
    const body = sec.text || ''
    /* A heading with almost nothing under it belongs to the next
       section, not to itself. */
    if (last && body.length < MIN_CHARS && !sec.heading) {
      last.text = `${last.text}\n${body}`.trim()
      continue
    }
    if (last && body.length < MIN_CHARS && sec.heading && last.text.length < MAX_CHARS) {
      last.text = `${last.text}\n${sec.heading}. ${body}`.trim()
      last.headings.push(sec.heading)
      continue
    }
    merged.push({ heading: sec.heading || '', headings: sec.heading ? [sec.heading] : [], text: body })
  }

  for (const sec of merged) {
    if (!sec.text || sec.text.length < 40) continue
    const parts = splitLong(sec.text)
    parts.forEach((part, i) => {
      const id = chunkId(page.id, sec.heading, i)
      chunks.push({
        id,
        namespace: 'aura',
        docId: page.id,
        url: page.canonical || page.url,
        title: page.title,
        image: page.image || '',
        /* The path a reader would describe: page → section. */
        sectionPath: [page.title, sec.heading].filter(Boolean).join(' › '),
        heading: sec.heading,
        text: part,
        hash: sha(part),
        sourceType: 'aura',
        retrievedAt: page.seenAt,
      })
    })
  }

  /* Meaningful alt text is content on this site — captions carry real
     information ("Screen grading — defect analysis per SCA protocol"). */
  if (page.alts?.length) {
    const text = page.alts.join(' · ')
    if (text.length > 60) {
      chunks.push({
        id: chunkId(page.id, 'images'),
        namespace: 'aura',
        docId: page.id,
        url: page.canonical || page.url,
        title: page.title,
        image: page.image || '',
        sectionPath: `${page.title} › Images`,
        heading: 'Images',
        text,
        hash: sha(text),
        sourceType: 'aura',
        retrievedAt: page.seenAt,
      })
    }
  }

  /* One glossary chunk per page. A reader asking "what is Brix" should
     get the estate's own definition, not an approximation of it. */
  if (page.terms?.length) {
    const seen = new Set()
    const lines = page.terms
      .filter((t) => !seen.has(t.term.toLowerCase()) && seen.add(t.term.toLowerCase()))
      .map((t) => `${t.term}: ${t.definition}`)
    if (lines.length) {
      const text = lines.join('\n')
      chunks.push({
        id: chunkId(page.id, 'glossary'),
        namespace: 'aura',
        docId: page.id,
        url: page.canonical || page.url,
        title: page.title,
        image: page.image || '',
        sectionPath: `${page.title} › Glossary`,
        heading: 'Glossary',
        text,
        hash: sha(text),
        sourceType: 'aura',
        retrievedAt: page.seenAt,
      })
    }
  }

  return chunks
}

/* ── lexical index ──────────────────────────────────────────────────
   BM25 over the chunk text. Deliberately not a vector store: the corpus
   is small enough that lexical retrieval is strong on its own, it costs
   nothing to host, it is deterministic in tests, and the semantic layer
   can be added beside it without changing the interface. */
const STOP = new Set(('a an and are as at be but by for from has have how in is it its of on or that the this to was what when where which who why with you your we our').split(' '))

export function tokenise(s) {
  return s.toLowerCase()
    .replace(/[^\p{L}\p{N}\s'-]/gu, ' ')
    .split(/\s+/)
    .filter((t) => t.length > 1 && !STOP.has(t))
}

function buildIndex(chunks) {
  const df = Object.create(null)
  const docs = chunks.map((c) => {
    const terms = tokenise(`${c.sectionPath} ${c.text}`)
    const tf = Object.create(null)
    for (const t of terms) tf[t] = (tf[t] ?? 0) + 1
    for (const t of new Set(terms)) df[t] = (df[t] ?? 0) + 1
    return { id: c.id, len: terms.length, tf }
  })
  const avgLen = docs.reduce((a, d) => a + d.len, 0) / (docs.length || 1)
  return { df, docs, avgLen, n: docs.length }
}

/* ── run ────────────────────────────────────────────────────────── */
const files = (await readdir(path.join(DATA, 'pages'))).filter((f) => f.endsWith('.json'))
const pages = await Promise.all(
  files.map(async (f) => JSON.parse(await readFile(path.join(DATA, 'pages', f), 'utf8'))),
)

let previous = null
if (!REBUILD) {
  try { previous = JSON.parse(await readFile(path.join(DATA, 'corpus.json'), 'utf8')) } catch { /* first run */ }
}
const prevById = new Map((previous?.chunks ?? []).map((c) => [c.id, c]))

const auraChunks = pages.flatMap(chunkPage)

/* External research is authored, reviewed and version-controlled — it
   is never crawled, and it lives in its own namespace so a retrieval
   filter can keep the two apart. */
let externalChunks = []
try {
  const ext = JSON.parse(await readFile('data/ask-aura/external.json', 'utf8'))
  externalChunks = ext.map((e) => ({
    ...e,
    namespace: 'external',
    hash: sha(e.text),
  }))
} catch { /* optional */ }

const chunks = [...auraChunks, ...externalChunks]

/* Change detection, so an editor can see what a re-crawl actually did. */
const added = chunks.filter((c) => !prevById.has(c.id))
const changed = chunks.filter((c) => prevById.has(c.id) && prevById.get(c.id).hash !== c.hash)
const removed = [...prevById.keys()].filter((id) => !chunks.some((c) => c.id === id))

/* ── semantic vectors ────────────────────────────────────────────────
   Hybrid retrieval: BM25 catches the exact term, embeddings catch the
   question asked in different words. Only chunks whose text actually
   changed are re-embedded, so a re-crawl costs almost nothing. */
const key = process.env.OPENAI_API_KEY
if (key) {
  const prevVec = new Map((previous?.chunks ?? []).filter((c) => c.vec).map((c) => [c.hash, c.vec]))
  const need = chunks.filter((c) => !prevVec.has(c.hash))
  console.log(`Embedding ${need.length} new/changed chunks (${chunks.length - need.length} reused)…`)

  for (let i = 0; i < need.length; i += 96) {
    const batch = need.slice(i, i + 96)
    const res = await fetch('https://api.openai.com/v1/embeddings', {
      method: 'POST',
      headers: { 'content-type': 'application/json', authorization: `Bearer ${key}` },
      body: JSON.stringify({
        model: 'text-embedding-3-small',
        /* 512 of the available 1536 dimensions. Matryoshka embeddings
           degrade gracefully when truncated, and a third of the size
           is the difference between a corpus that loads on a cold
           start and one that does not. */
        dimensions: EMBED_DIMS,
        input: batch.map((c) => `${c.sectionPath}\n${c.text}`.slice(0, 6000)),
      }),
    })
    if (!res.ok) {
      console.error(`  embedding failed (${res.status}) — continuing lexical-only`)
      break
    }
    const json = await res.json()
    json.data.forEach((d, k) => { batch[k].vec = packVec(d.embedding) })
  }
  for (const c of chunks) if (!c.vec && prevVec.has(c.hash)) c.vec = prevVec.get(c.hash)
} else {
  console.log('No OPENAI_API_KEY — building lexical index only.')
}

const index = buildIndex(chunks)
const corpus = {
  builtAt: new Date().toISOString(),
  counts: {
    pages: pages.length,
    chunks: chunks.length,
    aura: auraChunks.length,
    external: externalChunks.length,
    embedded: chunks.filter((c) => c.vec).length,
  },
  chunks,
  index,
}

await mkdir(DATA, { recursive: true })
await writeFile(path.join(DATA, 'corpus.json'), JSON.stringify(corpus))

/* ── openers ────────────────────────────────────────────────────────
   Three questions worth asking on each page, written from what that
   page actually contains. Built here rather than in the browser so the
   dock costs nothing at open time, and cached against the page hash so
   this only spends a model call when the page itself has changed.

   The alternative — showing every visitor "What is Aura?" regardless of
   where they are standing — wastes the one moment the dock has to prove
   it knows the page. */
const OPENERS = path.join(DATA, 'openers.json')
let openers = {}
try { openers = JSON.parse(await readFile(OPENERS, 'utf8')) } catch { /* first run */ }

const openerKey = process.env.OPENAI_API_KEY
let written = 0
let reused = 0

for (const page of pages) {
  const route = new URL(page.url).pathname || '/'
  const cached = openers[route]
  if (cached?.hash === page.hash) { reused++; continue }
  if (!openerKey) continue

  const headings = (page.sections ?? [])
    .map((sec) => sec.heading)
    .filter(Boolean)
    .slice(0, 12)
  const lede = (page.sections?.[0]?.text ?? '').slice(0, 600)

  try {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'content-type': 'application/json', authorization: `Bearer ${openerKey}` },
      body: JSON.stringify({
        model: 'gpt-4.1-mini',
        temperature: 0.3,
        response_format: { type: 'json_object' },
        messages: [
          {
            role: 'system',
            content:
              'You write the two or three questions a curious visitor would most want to ask ' +
              'while reading one page of a regenerative coffee estate\u2019s website, plus one short ' +
              'line introducing the page.\n' +
              'Return JSON: {"line":"...","prompts":["...","...","..."]}.\n' +
              'The line is the host speaking to the reader, out loud, in one sentence under ' +
              '14 words. Warm and plain, the way a person who works here would say it while ' +
              'standing on the page with you. Address the reader directly and invite the ' +
              'question.\n' +
              '"This is the palm the whole estate is built on \u2014 ask me anything." is right.\n' +
              '"Discover the Sentinel Palm and its role on the estate." is wrong: that is a ' +
              'caption, not a person.\n' +
              'Never open with Discover, Explore, Learn about, Dive into or Uncover, and never ' +
              'begin "Aura is".\n' +
              'Each prompt is a real question, six words or fewer where possible, answerable ' +
              'from THIS page. Specific to it \u2014 never "What is Aura?" or "Tell me more". ' +
              'Natural British English, sentence case, ending in a question mark.\n' +
              'A prompt names Aura and never addresses it as you or your. ' +
              '"What makes Aura\u2019s coffee regenerative?" is right; "What makes your coffee ' +
              'regenerative?" is wrong \u2014 the prompts sit in Aura\u2019s own panel, where ' +
              '"your coffee" reads as the reader\u2019s. The line is different: it is the host ' +
              'speaking, so it addresses the reader as you.',
          },
          {
            role: 'user',
            content: `PAGE: ${page.title}\nURL: ${page.url}\nSECTIONS:\n${headings.join('\n')}\n\nOPENING TEXT:\n${lede}`,
          },
        ],
      }),
    })
    if (!res.ok) continue
    const json = await res.json()
    const parsed = JSON.parse(json.choices?.[0]?.message?.content ?? '{}')
    const prompts = (parsed.prompts ?? [])
      .filter((q) => typeof q === 'string' && q.length > 4 && q.length < 60)
      .slice(0, 3)
    if (!parsed.line || prompts.length < 2) continue
    openers[route] = { hash: page.hash, line: String(parsed.line).slice(0, 120), prompts }
    written++
  } catch { /* a page without openers falls back to the generic set */ }
}

/* Drop routes that no longer exist. */
const liveRoutes = new Set(pages.map((pg) => new URL(pg.url).pathname || '/'))
for (const route of Object.keys(openers)) {
  if (!liveRoutes.has(route)) delete openers[route]
}

await writeFile(OPENERS, JSON.stringify(openers, null, 2))
console.log(`  openers: ${written} written · ${reused} reused · ${Object.keys(openers).length} routes`)


console.log(`Ingested ${pages.length} pages → ${chunks.length} chunks`)
console.log(`  aura: ${auraChunks.length} · external: ${externalChunks.length} · embedded: ${corpus.counts.embedded}`)
console.log(`  added: ${added.length} · changed: ${changed.length} · removed: ${removed.length}`)
if (changed.length) console.log('  changed:', changed.slice(0, 5).map((c) => c.id).join(', '))
if (removed.length) console.log('  removed:', removed.slice(0, 5).join(', '))

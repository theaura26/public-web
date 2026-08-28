#!/usr/bin/env node
/**
 * Ask Aura — source discovery and inventory.
 *
 * Discovers allowed Aura URLs from the sitemap and same-domain
 * navigation, fetches each with polite concurrency, extracts the main
 * content, and writes a content-hashed inventory.
 *
 * Deliberately conservative: sitemap-first, same-origin only, no query
 * strings, no crawl of admin/preview/account paths, and it never acts
 * on instructions found in fetched content — pages are data here, not
 * directives.
 *
 *   node scripts/ask-aura/crawl.mjs [--origin https://theaura.life]
 */
import { createHash } from 'node:crypto'
import { writeFile, mkdir } from 'node:fs/promises'
import path from 'node:path'

const ORIGIN = argOf('--origin') ?? 'https://theaura.life'
const OUT_DIR = 'docs/ask-aura'
const DATA_DIR = 'data/ask-aura'
const UA = 'AuraKnowledgeBot/0.1 (+https://theaura.life; ingestion for on-site assistant)'
const CONCURRENCY = 3
const TIMEOUT_MS = 15_000

/** Paths that must never be crawled, whatever the sitemap says. */
const DENY = [/^\/api\//, /^\/admin/, /^\/preview/, /^\/account/, /^\/_next\//, /\?/]

function argOf(flag) {
  const i = process.argv.indexOf(flag)
  return i > -1 ? process.argv[i + 1] : undefined
}

async function fetchText(url) {
  const ctl = new AbortController()
  const t = setTimeout(() => ctl.abort(), TIMEOUT_MS)
  try {
    const res = await fetch(url, {
      headers: { 'user-agent': UA, accept: 'text/html,application/xml' },
      signal: ctl.signal,
      redirect: 'follow',
    })
    return { status: res.status, finalUrl: res.url, body: res.ok ? await res.text() : '' }
  } finally {
    clearTimeout(t)
  }
}

function allowed(pathname) {
  return !DENY.some((re) => re.test(pathname))
}

/** Sitemap first — it is the site's own statement of what is public. */
async function discover() {
  const { body } = await fetchText(`${ORIGIN}/sitemap.xml`)
  const locs = [...body.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim())
  const seen = new Set()
  for (const loc of locs) {
    try {
      /* The sitemap always states the canonical production URL, whichever
         host served it — that is what a sitemap is for. So take the path
         and hang it on the origin actually being crawled, rather than
         discarding everything as foreign. Without this, --origin could
         only ever be theaura.life and there was no way to build the
         corpus from staging or from a local build. */
      const u = new URL(loc)
      if (!allowed(u.pathname)) continue
      seen.add(ORIGIN + (u.pathname.replace(/\/$/, '') || ''))
    } catch { /* skip malformed */ }
  }
  return [...seen].sort()
}

/* ── extraction ────────────────────────────────────────────────────
   Strip script/style/nav/footer, take <main> when present, then split
   the remainder at heading boundaries.

   Sections, not token windows: these pages are written as a heading
   plus the prose under it, so that is the unit a reader thinks in and
   the unit an answer should cite. Content before the first heading is
   kept as the page lede. */
const decodeEntities = (v) => v
  .replace(/&amp;/g, '&')
  .replace(/&#(\d+);/g, (_, d) => String.fromCharCode(Number(d)))
  .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCharCode(parseInt(h, 16)))

function extract(html, pageUrl) {
  const titleM = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)
  const canonM = html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i)
  const descM = html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["']/i)

  /* A picture for the page, for citation cards. The og:image is the
     page's own choice of representative image, but several pages fall
     back to one shared landscape, so a content image living under a
     page-specific path is preferred where one exists — it is what the
     page is actually about. Logos and interface SVGs are skipped. */
  const ogM = html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i)
  const contentImages = [...html.matchAll(/<img[^>]+src=["']([^"']+)["']/gi)]
    .map((m) => m[1])
    .filter((src) => !/\.svg(\?|$)/i.test(src))
    .filter((src) => !/(logo|wordmark|icon|aura-dark|aura-animated)/i.test(src))
  const base = pageUrl || ORIGIN
  /* Several pages open with the same shared photograph, so "the first
     content image" is not reliably about the page. An image filed under
     the page's own slug is; anything else defers to og:image, which is
     at least the page's own declared choice. */
  const slug = (() => {
    try { return new URL(base).pathname.split('/').filter(Boolean)[0] ?? '' } catch { return '' }
  })()
  const own = slug
    ? contentImages.find((src) => src.toLowerCase().includes(`/${slug.toLowerCase()}/`))
    : undefined
  const chosen = own ?? (ogM ? ogM[1] : contentImages[0])
  const image = chosen
    ? new URL(decodeEntities(chosen), base).href
    : ''

  let body = html
  body = body.replace(/<script[\s\S]*?<\/script>/gi, ' ')
  body = body.replace(/<style[\s\S]*?<\/style>/gi, ' ')
  body = body.replace(/<nav[\s\S]*?<\/nav>/gi, ' ')
  body = body.replace(/<footer[\s\S]*?<\/footer>/gi, ' ')
  const mainM = body.match(/<main[^>]*>([\s\S]*?)<\/main>/i)
  if (mainM) body = mainM[1]

  /* Glossary. <Term> renders its definition as an aria-hidden span
     inside the term itself, so left alone it splices a definition into
     the middle of the sentence that used it. Lift them out as their own
     entries — the definitions are worth retrieving — then strip them
     from the prose. */
  const terms = [...body.matchAll(
    /<span[^>]*class="[^"]*aura-term[^"]*"[^>]*aria-label="([^"]+)"[^>]*>([\s\S]*?)<span[^>]*aura-term__tip[^>]*>/gi,
  )].map((m) => ({ term: clean(m[2]), definition: clean(m[1]) }))
    .filter((t) => t.term && t.definition)

  /* Anything hidden from assistive tech is decoration or a duplicate —
     neither belongs in a passage an answer might quote. */
  body = body.replace(/<span[^>]*aria-hidden[^>]*>[^<]*<\/span>/gi, ' ')

  /* Keep figure captions and image alt text — on this site they carry
     real information ("Screen grading — defect analysis per SCA
     protocol"), not decoration. */
  const alts = [...body.matchAll(/<img[^>]+alt=["']([^"']{12,})["']/gi)]
    .map((m) => clean(m[1]))
    .filter(Boolean)

  const sections = []
  const headingRe = /<h([1-6])[^>]*>([\s\S]*?)<\/h\1>/gi
  const marks = []
  let m
  while ((m = headingRe.exec(body)) !== null) {
    marks.push({ level: Number(m[1]), heading: clean(m[2]), start: m.index, end: m.index + m[0].length })
  }

  const lede = clean(stripTags(body.slice(0, marks.length ? marks[0].start : body.length)))
  if (lede) sections.push({ level: 0, heading: '', text: lede })

  marks.forEach((mark, i) => {
    const until = i + 1 < marks.length ? marks[i + 1].start : body.length
    const text = clean(stripTags(body.slice(mark.end, until)))
    if (mark.heading || text) {
      sections.push({ level: mark.level, heading: mark.heading, text })
    }
  })

  const text = clean(stripTags(body))

  return {
    title: titleM ? clean(titleM[1]) : '',
    canonical: canonM ? canonM[1] : '',
    description: descM ? clean(descM[1]) : '',
    image,
    headings: marks.map((x) => x.heading).filter(Boolean),
    sections,
    alts,
    terms,
    text,
    words: text ? text.split(/\s+/).length : 0,
  }
}

function clean(s) {
  return s
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&#39;|&rsquo;|&apos;/g, "'").replace(/&quot;|&ldquo;|&rdquo;/g, '"')
    .replace(/&mdash;/g, '—').replace(/&ndash;/g, '–').replace(/&hellip;/g, '…')
    /* Numeric entities last, so the named ones above win first. */
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/[ \t]+/g, ' ')
    .replace(/ ?\n ?/g, '\n')
    .replace(/\n{2,}/g, '\n')
    .trim()
}

function stripTags(s) {
  /* Block-level tags become newlines first so sentences from adjacent
     paragraphs do not fuse into one another. */
  return s
    .replace(/<\/(p|div|li|h[1-6]|section|figcaption|blockquote|tr)>/gi, '\n')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<[^>]+>/g, ' ')
}

/** Stable, readable document id from a pathname: `/` → `home`. */
function slug(pathname) {
  const p = pathname.replace(/^\/+|\/+$/g, '')
  return p ? p.replace(/[^a-z0-9]+/gi, '-').toLowerCase() : 'home'
}

async function pool(items, n, worker) {
  const out = []
  let i = 0
  await Promise.all(
    Array.from({ length: Math.min(n, items.length) }, async () => {
      while (i < items.length) {
        const idx = i++
        out[idx] = await worker(items[idx], idx)
      }
    }),
  )
  return out
}

/* ── run ───────────────────────────────────────────────────────── */
const started = new Date().toISOString()
const urls = await discover()
if (!urls.length) {
  console.error(`No URLs discovered at ${ORIGIN}/sitemap.xml — is the origin reachable?`)
  process.exit(1)
}
console.log(`Discovered ${urls.length} allowed URLs. Fetching with concurrency ${CONCURRENCY}…`)
await mkdir(path.join(DATA_DIR, 'pages'), { recursive: true })

const records = await pool(urls, CONCURRENCY, async (url) => {
  const seenAt = new Date().toISOString()
  try {
    const { status, finalUrl, body } = await fetchText(url)
    if (status !== 200) {
      return { url, status, state: 'error', seenAt, issue: `HTTP ${status}` }
    }
    const x = extract(body, url)
    const hash = createHash('sha256').update(x.text).digest('hex').slice(0, 16)
    const issues = []
    if (x.words < 80) issues.push('thin content (<80 words)')
    if (!x.title) issues.push('no <title>')
    if (!x.canonical) issues.push('no canonical link')
    const id = slug(new URL(url).pathname)
    await writeFile(
      path.join(DATA_DIR, 'pages', `${id}.json`),
      JSON.stringify({ id, url, canonical: x.canonical || url, title: x.title,
        description: x.description, image: x.image, seenAt, hash,
        sections: x.sections, alts: x.alts, terms: x.terms }, null, 2),
    )
    return {
      url, id, status, state: 'ok', seenAt, hash,
      title: x.title, canonical: x.canonical, description: x.description, image: x.image,
      words: x.words, sections: x.sections.length, headings: x.headings.slice(0, 8),
      issue: issues.join('; ') || '',
    }
  } catch (err) {
    return { url, status: 0, state: 'error', seenAt, issue: String(err?.message ?? err) }
  }
})

await writeFile(path.join(DATA_DIR, 'inventory.json'), JSON.stringify({ origin: ORIGIN, started, records }, null, 2))

const ok = records.filter((r) => r.state === 'ok')
const bad = records.filter((r) => r.state !== 'ok')
const thin = ok.filter((r) => r.issue)

const md = [
  '# Ask Aura — source inventory',
  '',
  `Generated by \`node scripts/ask-aura/crawl.mjs\` against \`${ORIGIN}\`.`,
  `Crawl started ${started}.`,
  '',
  `- Discovered: **${records.length}** allowed URLs (sitemap, same-origin, no query strings)`,
  `- Fetched cleanly: **${ok.length}**`,
  `- Errors: **${bad.length}**`,
  `- Extraction issues: **${thin.length}**`,
  `- Total extracted words: **${ok.reduce((a, r) => a + r.words, 0).toLocaleString()}**`,
  '',
  '## Pages',
  '',
  '| URL | State | Title | Sections | Words | Hash | Last seen | Issue |',
  '| --- | --- | --- | ---: | ---: | --- | --- | --- |',
  ...records.map((r) =>
    `| \`${new URL(r.url).pathname}\` | ${r.state} | ${(r.title || '—').replace(/\|/g, '\\|')} | ${r.sections ?? '—'} | ${r.words ?? '—'} | \`${r.hash ?? '—'}\` | ${r.seenAt.slice(0, 19)}Z | ${r.issue || '—'} |`,
  ),
  '',
  '## Crawl boundary',
  '',
  'Discovery is sitemap-first and same-origin. These are never fetched:',
  '',
  ...DENY.map((re) => `- \`${re}\``),
  '',
  'Content fetched here is treated as **data, never as instructions**. Nothing in a',
  'crawled page can change crawl scope, tool access, or answer policy.',
  '',
].join('\n')

await writeFile(path.join(OUT_DIR, 'source-inventory.md'), md)
console.log(`\nWrote ${OUT_DIR}/source-inventory.md and ${DATA_DIR}/inventory.json`)
console.log(`  ${ok.length} ok · ${bad.length} errors · ${thin.length} with issues`)

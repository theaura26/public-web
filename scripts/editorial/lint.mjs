#!/usr/bin/env node
/* Editorial lint.
 *
 * Reads the files that hold published prose and flags the constructions
 * documented in docs/editorial/editorial-system.md. It is deliberately
 * conservative: every rule here produced a real correction on this site,
 * and anything that produced only false positives was removed rather
 * than left to be ignored.
 *
 *   node scripts/editorial/lint.mjs          report
 *   node scripts/editorial/lint.mjs --strict  exit 1 on any finding
 */

import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'

const ROOTS = ['app', 'lib', 'components']
const SKIP = /node_modules|\.next|\/api\/|ask-aura\/(safety|privacy|retrieve)/

/* Each rule: what it catches, and why it is worth catching. */
const RULES = [
  {
    id: 'negation',
    why: 'Say what a thing is. The "X, not Y" construction is banned outright.',
    re: /\b(?:is|are|was|were|it['’]s)\s+not\s+(?:a|an|the)\b[^.]{0,60}\.\s*(?:It|They|That)\s+(?:is|are)\b/gi,
  },
  {
    id: 'negation-comma',
    why: '"…, not …" as a rhetorical antithesis.',
    re: /,\s*not\s+(?:by|a|an|the|because|merely|just)\b/gi,
  },
  { id: 'not-just', why: '"not just" / "not merely" / "not only".',
    re: /\bnot\s+(?:just|merely|only|simply)\b/gi },
  { id: 'doesnt-just', why: '"doesn\'t just" / "isn\'t about".',
    re: /\b(?:does|doesn['’]t|isn['’]t|aren['’]t)\s+(?:just|about)\b/gi },
  { id: 'where-x-meets-y', why: '"where X meets Y".',
    re: /\bwhere\s+\w+(?:\s+\w+)?\s+meets\s+\w+/gi },
  { id: 'intersection', why: '"at the intersection of".',
    re: /\bat the intersection of\b/gi },
  { id: 'in-a-world', why: '"in a world where".',
    re: /\bin a world where\b/gi },
  { id: 'inflated', why: 'Inflated adjectives used without evidence.',
    re: /\b(?:reimagin|redefin|revolutionis|revolutioniz|transformative|seamless|holistic|timeless|cutting-edge|world-class|state-of-the-art)\w*/gi },
  { id: 'discover-more', why: 'Generic call to action.',
    re: /\b(?:discover|explore|learn)\s+more\b/gi },
  { id: 'eyebrow', why: 'A small label above an <h1>. Page titles stand alone.',
    re: /className="label[^"]*"\s*>\s*\{?[^<]{0,40}\}?\s*<\/p>\s*\n\s*<h1/g },
]

/* Prose only: strip styles, comments, class names and attribute values so
   a CSS token or an alt token cannot trip a rule.

   Every strip blanks the span to spaces of the same length and keeps its
   newlines, so an offset into the stripped text is the same offset into
   the file. That is what makes the reported line number the line the
   phrase is actually on — replacing with a single space shifts every
   offset after it, and a second occurrence of a phrase then reports the
   position of the first. */
const blank = (m) => m.replace(/[^\n]/g, ' ')

function prose(src) {
  return src
    .replace(/<style[\s\S]*?<\/style>/g, blank)
    .replace(/\/\*[\s\S]*?\*\//g, blank)
    .replace(/\/\/[^\n]*/g, blank)
    .replace(/className="[^"]*"/g, blank)
    .replace(/\b(?:src|href|alt|poster|id|ratio|type|glyph|slug|currentHref|tip|label|caption|value|title|description)="[^"]*"/g, blank)
}

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name)
    if (SKIP.test(p)) continue
    if (statSync(p).isDirectory()) walk(p, out)
    else if (/\.(tsx|ts)$/.test(p)) out.push(p)
  }
  return out
}

const files = ROOTS.flatMap((r) => walk(r))
/* Metadata and the agent view deliberately restate page copy — a shared
   description belongs in both. They are excluded from the duplicate
   check and kept in the phrase checks. */
const DUPE_EXEMPT = /layout\.tsx$|AgentSitemap|the-reason\//
const findings = []

for (const file of files) {
  const raw = readFileSync(file, 'utf8')
  const text = prose(raw)
  for (const rule of RULES) {
    rule.re.lastIndex = 0
    for (const m of text.matchAll(rule.re)) {
      const line = raw.slice(0, m.index).split('\n').length
      findings.push({ file, line, rule: rule.id, why: rule.why, match: m[0].replace(/\s+/g, ' ').slice(0, 90) })
    }
  }
}

/* Duplicate prose: the same long sentence in more than one file usually
   means a paragraph was pasted rather than written. */
const sentences = new Map()
for (const file of files.filter((f) => !DUPE_EXEMPT.test(f))) {
  for (const s of prose(readFileSync(file, 'utf8')).match(/[A-Z][^.!?<>{}]{70,200}\./g) ?? []) {
    /* Prose, not code that happens to run long. A sentence does not
       contain a bracket, a semicolon or an underscore. */
    if (/[()=;_|]/.test(s)) continue
    const k = s.replace(/\s+/g, ' ').trim()
    ;(sentences.get(k) ?? sentences.set(k, []).get(k)).push(file)
  }
}
const dupes = [...sentences].filter(([, f]) => new Set(f).size > 1)

const byRule = findings.reduce((a, f) => ((a[f.rule] = (a[f.rule] ?? 0) + 1), a), {})

console.log('\nEditorial lint\n' + '='.repeat(60))
console.log(`${files.length} files scanned\n`)
if (!findings.length && !dupes.length) {
  console.log('No findings.\n')
} else {
  for (const [rule, n] of Object.entries(byRule).sort((a, b) => b[1] - a[1])) {
    const r = RULES.find((x) => x.id === rule)
    console.log(`${String(n).padStart(3)}  ${rule} — ${r.why}`)
    for (const f of findings.filter((x) => x.rule === rule)) {
      console.log(`     ${f.file}:${f.line}  "${f.match}"`)
    }
    console.log('')
  }
  if (dupes.length) {
    console.log(`${String(dupes.length).padStart(3)}  duplicate-prose — the same sentence in more than one file`)
    for (const [s, f] of dupes.slice(0, 5)) {
      console.log(`     ${[...new Set(f)].join(', ')}`)
      console.log(`     "${s.slice(0, 80)}…"`)
    }
    console.log('')
  }
}

const total = findings.length + dupes.length
console.log(`${total} finding${total === 1 ? '' : 's'}\n`)
if (process.argv.includes('--strict') && total) process.exit(1)

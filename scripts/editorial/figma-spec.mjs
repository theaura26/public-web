#!/usr/bin/env node
/* The image brief, generated from the pages themselves.
 *
 * Every new page is waiting on photographs. This reads the shipping copy
 * and the drafting briefs out of the source and prints one JSON document
 * describing what each page says and what each picture is meant to be —
 * which is what the Figma board is built from, so the board can be
 * rebuilt from the site rather than drifting from it.
 *
 * The ratios are the ones the site actually renders, measured against a
 * production build: 16/9 for banners and plates, 4/5 for portraits,
 * inside a 1200px content rail.
 *
 *   node scripts/editorial/figma-spec.mjs > spec.json
 */

import { readFileSync } from 'node:fs'

const RAIL = 1200
const RATIO = { banner: '16 / 9', plate: '16 / 9', portrait: '4 / 5' }

const unesc = (s) => s.replace(/\\'/g, "'").replace(/\\\\/g, '\\')
const strings = (block) =>
  [...block.matchAll(/^\s*'((?:[^'\\]|\\.)*)',\s*$/gm)].map((m) => unesc(m[1]))

/** Split a data file into its top-level subject objects. */
function subjects(src) {
  const out = []
  for (const m of src.matchAll(/\n {2}\{\n/g)) {
    const start = m.index + m[0].length
    const next = src.indexOf('\n  {\n', start)
    const seg = src.slice(start, next === -1 ? src.length : next)
    const id = seg.match(/id: '([a-z-]+)'/)
    if (id) out.push([id[1], seg])
  }
  return out
}

const field = (seg, name) => {
  const m = seg.match(new RegExp(`\\n {4}${name}: '((?:[^'\\\\]|\\\\.)*)',`))
  return m ? unesc(m[1]) : null
}

function parse(path, base, kind) {
  const src = readFileSync(path, 'utf8')
  return subjects(src).map(([id, seg]) => {
    const movements = []
    const mv = seg.match(/\n {4}movements: \[\n([\s\S]*?)\n {4}\],\n/)
    if (mv) {
      for (const blk of mv[1].split(/\n {6}\},\n/)) {
        const h = blk.match(/heading: '((?:[^'\\]|\\.)*)'/)
        if (!h) continue
        const lines = blk.match(/lines: \[\n([\s\S]*?)\n {8}\],/)
        const am = blk.match(/after: \{([\s\S]*?)\n?\s*\},?\s*$/)
        let after = null
        if (am) {
          after = Object.fromEntries(
            [...am[1].matchAll(/(\w+): '((?:[^'\\]|\\.)*)'/g)].map((k) => [k[1], unesc(k[2])]),
          )
          after.ratio = after.ratio ?? RATIO[after.kind] ?? '16 / 9'
          after.px = after.ratio === '4 / 5' ? `${RAIL} x ${RAIL * 5 / 4}` : `${RAIL} x ${Math.round(RAIL * 9 / 16)}`
        }
        movements.push({ heading: unesc(h[1]), lines: lines ? strings(lines[1]) : [], after })
      }
    }
    const record = []
    const rm = seg.match(/\n {4}record: \[\n([\s\S]*?)\n {4}\],/)
    if (rm) {
      for (const r of rm[1].matchAll(/value: '((?:[^'\\]|\\.)*)', label: '((?:[^'\\]|\\.)*)'/g)) {
        record.push({ value: unesc(r[1]), label: unesc(r[2]) })
      }
    }
    const hero = seg.match(/hero: \{ type: '((?:[^'\\]|\\.)*)', caption: '((?:[^'\\]|\\.)*)'/)
    return {
      route: `${base}/${field(seg, 'slug') ?? id}`,
      title: field(seg, 'label'),
      lede: field(seg, 'lede'),
      kind,
      hero: hero ? { type: unesc(hero[1]), caption: unesc(hero[2]), ratio: '16 / 9' } : null,
      quote: field(seg, 'quote'),
      movements,
      record,
    }
  })
}

const spec = [
  ...parse('lib/disciplines.ts', '/regenerative-life', 'Regenerative Life'),
  ...parse('lib/pillars.ts', '/reason', 'The Reason'),
]

const slots = spec.reduce(
  (n, p) => n + (p.hero ? 1 : 0) + p.movements.filter((m) => m.after).length,
  0,
)
process.stderr.write(`${spec.length} pages, ${slots} image slots\n`)
process.stdout.write(`${JSON.stringify(spec, null, 1)}\n`)

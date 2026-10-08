#!/usr/bin/env node
/* Every title on 10 Days of RIPE, as an SVG in Archie Brackett.
 *
 * The chapter titles, and any title a second background brings in, read
 * from components/ripe-10-days/copy.ts, set in Archie Brackett and traced
 * to outlines by title-svgs.swift — artwork, not type, so the page can
 * show the lettering without serving the font. In the page's pink,
 * named for each title ("Finding a way in" → finding-a-way-in.svg), with
 * each one's shape and fingerprint recorded in
 * components/ripe-10-days/titles.json, which the page reads to set them:
 *
 *   node scripts/ripe/title-svgs.mjs
 *
 * Run it again when a title or the pink changes. The font stays out of
 * the project, beside the source media.
 */

import { readFileSync, writeFileSync } from 'node:fs'
import { createHash } from 'node:crypto'
import { execFileSync } from 'node:child_process'
import { join } from 'node:path'

const FONT = '../RIPE source/Unused fonts/ArchieBrackett-Bold.otf'
const OUT = 'public/RIPE/10-days/titles'
const MANIFEST = 'components/ripe-10-days/titles.json'
/* The size the swift script sets them at, in its units. */
const SIZE = 200

const copy = readFileSync('components/ripe-10-days/copy.ts', 'utf8')
const fill = copy.match(/export const CORAL = '(#[0-9A-Fa-f]{6})'/)[1]
const titles = [...new Set([...copy.matchAll(/\btitle: '([^']+)'/g)].map((m) => m[1]))]
const slug = (t) => t.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')

execFileSync('swift', [join('scripts', 'ripe', 'title-svgs.swift'), FONT, OUT, fill, ...titles.map((t) => `${slug(t)}=${t}`)], { stdio: 'inherit' })

/* Each title's box, as a share of the size it was set at (so the page
   can size it from its own title size), and a fingerprint for the cache. */
const manifest = {}
for (const t of titles) {
  const file = join(OUT, `${slug(t)}.svg`)
  const svg = readFileSync(file, 'utf8')
  const [, w, h] = svg.match(/viewBox="0 0 ([\d.]+) ([\d.]+)"/)
  manifest[slug(t)] = { w: +(w / SIZE).toFixed(4), h: +(h / SIZE).toFixed(4), v: createHash('sha1').update(svg).digest('hex').slice(0, 8) }
}
writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2) + '\n')
console.log(`wrote ${MANIFEST}`)

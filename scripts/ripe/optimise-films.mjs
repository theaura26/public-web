#!/usr/bin/env node
/* The page's films, made light enough for the web.
 *
 * Films come in as supplied — straight off a phone, often at several
 * times the bitrate a picture shown at most ~600px wide needs. Each is
 * encoded again (encode-film.swift: H.264, long edge at most 1080px, the
 * bitrate sized to its picture) and kept only if that comes out at least
 * a sixth smaller, so running this again leaves done films as they are.
 * A film the page plays with sound (sound: true in copy.ts) keeps it;
 * the rest play muted, so theirs is dropped.
 *
 *   node scripts/ripe/optimise-films.mjs
 *
 * figma-export.mjs runs this after bringing films in.
 */

import { readFileSync, writeFileSync, statSync, renameSync, rmSync, existsSync, mkdtempSync } from 'node:fs'
import { createHash } from 'node:crypto'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import { execFileSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const OUT = 'public/RIPE/10-days'
const MANIFEST = 'components/ripe-10-days/media.json'
const LONG = 1080
const KEEP_IF_SAVES = 1 / 6

const print = (file) => createHash('sha1').update(readFileSync(file)).digest('hex').slice(0, 8)

/** Re-encodes the films in media (the media.json object) in place. */
export function optimiseFilms(media) {
  const copy = readFileSync('components/ripe-10-days/copy.ts', 'utf8')
  /* A pick's options sit on its line, or on the lines just after it. */
  const withSound = new Set([...copy.matchAll(/\['([a-z0-9-]+)',[^\n]*(?:\n(?!\s*\[')[^\n]*)*?sound: true/g)].map((m) => m[1]))
  const tmp = mkdtempSync(join(tmpdir(), 'ripe-films-'))
  let before = 0, after = 0
  console.log('— Films')
  for (const key of Object.keys(media).filter((k) => /^\d+$/.test(k)).sort()) {
    for (const [name, m] of Object.entries(media[key])) {
      if (!m.video) continue
      const film = join(OUT, key, `${name}.mp4`)
      if (!existsSync(film)) continue
      const was = statSync(film).size
      const out = join(tmp, `${name}.mp4`)
      const sound = withSound.has(name)
      execFileSync('swift', [join('scripts', 'ripe', 'encode-film.swift'), film, out, String(LONG), 'auto', ...(sound ? ['sound'] : [])], { stdio: 'ignore' })
      const now = existsSync(out) ? statSync(out).size : Infinity
      before += was
      if (now <= was * (1 - KEEP_IF_SAVES)) {
        renameSync(out, film)
        m.vf = print(film)
        after += now
        console.log(`  ${`${key}/${name}`.padEnd(32)} ${(was / 1048576).toFixed(1)}MB → ${(now / 1048576).toFixed(1)}MB${sound ? '  (with sound)' : ''}`)
      } else {
        rmSync(out, { force: true })
        after += was
        console.log(`  ${`${key}/${name}`.padEnd(32)} ${(was / 1048576).toFixed(1)}MB, kept`)
      }
    }
  }
  rmSync(tmp, { recursive: true, force: true })
  console.log(`  ${(before / 1048576).toFixed(1)}MB → ${(after / 1048576).toFixed(1)}MB`)
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const media = JSON.parse(readFileSync(MANIFEST, 'utf8'))
  optimiseFilms(media)
  writeFileSync(MANIFEST, JSON.stringify(media, null, 2) + '\n')
  console.log(`wrote ${MANIFEST}`)
}

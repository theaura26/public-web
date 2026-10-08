#!/usr/bin/env node
/* The photographs as finished in Figma, onto the page.
 *
 * The page's stills are retouched in Figma now, not by grade-10-days.mjs:
 * the Figma file "AURA — Coffee Festival", Page 1, holds one frame per
 * picture, each named for the file it becomes on the site and set to
 * export as a JPG at its own size. Exporting them all from Figma (⇧⌘E)
 * gives a folder laid out like the page's own:
 *
 *   01/ripe-entrance.jpg … 08/aura-goodbyes.jpg   one folder per chapter
 *   backgrounds/ripe-NN-bg.jpg                    one per chapter
 *   backgrounds/ripe-NN-bg-2.jpg                  a second, taking over
 *                                                 part way (copy.ts says
 *                                                 from which picture)
 *
 * Drop that folder in as "Figma export" in the source folder
 * ("Aura Web/RIPE source/10 Days of RIPE", beside the project) and run
 *
 *   node scripts/ripe/figma-export.mjs
 *
 * Each picture is sized for the web and written over the page's copy —
 * no grade: what Figma shows is what the page shows. Stills in a chapter
 * folder that are no longer in the export are removed.
 *
 * An animated GIF in a chapter folder is published as it is — a JPEG
 * would keep only its first frame — and stands in for a still of the
 * same name (so "aura-cpp-feet.gif" replaces Figma's aura-cpp-feet.jpg).
 *
 * Figma doesn't hold films, but a film dropped into a chapter folder here
 * (.mp4 / .mov) is brought in with it: copied as supplied, under a
 * web-safe name ("IMG_7819 3.mp4" → img-7819-3.mp4), with a poster frame
 * from Quick Look. Films the grading script copies in from the chapter
 * folders are left as they are, and so is the banner — except that a
 * still here with a film's name becomes that film's poster.
 *
 * Which pictures a chapter shows, in what order and with what caption is
 * still set in components/ripe-10-days/copy.ts. A picture there with no
 * file is left out.
 *
 * grade-10-days.mjs calls this too, so re-running it keeps the Figma
 * versions rather than going back to its own grade.
 */

import sharp from 'sharp'
import { readdirSync, existsSync, mkdirSync, rmSync, readFileSync, writeFileSync, statSync, copyFileSync, mkdtempSync } from 'node:fs'
import { createHash } from 'node:crypto'
import { join, parse } from 'node:path'
import { tmpdir } from 'node:os'
import { execFileSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { optimiseFilms } from './optimise-films.mjs'

/* The source folder lives beside the project, not in it: nothing in
   public/ but what the page serves. */
export const SOURCE = '../RIPE source/10 Days of RIPE'
export const FIGMA = `${SOURCE}/Figma export`
const OUT = 'public/RIPE/10-days'
const MANIFEST = 'components/ripe-10-days/media.json'

/* Long edge and JPEG quality, as the grading script writes them. */
const LONG = 1400
const BG_LONG = 1920

const IMAGE = /\.(jpe?g|png|webp)$/i
const GIF = /\.gif$/i
const VIDEO = /\.(mp4|mov|m4v)$/i
/* A web-safe name, as the grading script makes them. */
const slug = (name) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
const print = (file) => createHash('sha1').update(readFileSync(file)).digest('hex').slice(0, 8)
const web = (src, out, long, quality) => sharp(src)
  .resize(long, long, { fit: 'inside', withoutEnlargement: true })
  .jpeg({ quality, mozjpeg: true, progressive: true })
  .toFile(out)

/** Writes the Figma export over the page's stills and records them in
    media (the media.json object), keeping its films and banner. */
export async function applyFigmaExport(media) {
  if (!existsSync(FIGMA)) return false
  const chapters = readdirSync(FIGMA).filter((d) => /^\d+$/.test(d) && statSync(join(FIGMA, d)).isDirectory()).sort()

  for (const key of chapters) {
    const outDir = join(OUT, key)
    mkdirSync(outDir, { recursive: true })
    const was = media[key] ?? {}
    /* Films brought in from here before go, to be brought in afresh (or
       not, if they've been taken out). */
    for (const [name, m] of Object.entries(was)) {
      if (!m.figma) continue
      rmSync(join(outDir, `${name}.mp4`), { force: true })
      rmSync(join(outDir, `${name}.jpg`), { force: true })
      delete was[name]
    }
    /* The grading script's films stay, with their posters; every other
       still goes. */
    const films = Object.fromEntries(Object.entries(was).filter(([, m]) => m.video))
    for (const f of readdirSync(outDir)) {
      const name = parse(f).name
      if ((/\.jpe?g$/i.test(f) && !films[name]) || GIF.test(f)) rmSync(join(outDir, f))
    }
    media[key] = { ...films }
    console.log(`— ${key}`)
    const gifs = new Set(readdirSync(join(FIGMA, key)).filter((x) => GIF.test(x)).map((x) => parse(x).name))
    for (const f of readdirSync(join(FIGMA, key)).filter((x) => IMAGE.test(x)).sort()) {
      const name = parse(f).name
      /* Its animated GIF stands in for it (below). */
      if (gifs.has(name)) continue
      const out = join(outDir, `${name}.jpg`)
      /* A still named for one of the grading script's films is that
         film's poster — what shows before it plays, or if it can't.
         Sized as a picture; the film keeps its own shape on the page, and
         the poster is cropped to it. */
      if (films[name]) {
        await web(join(FIGMA, key, f), out, LONG, 78)
        media[key][name] = { ...films[name], v: print(out) }
        console.log(`  ${name.padEnd(26)} poster for its film`)
        continue
      }
      const info = await web(join(FIGMA, key, f), out, LONG, 78)
      media[key][name] = { w: info.width, h: info.height, v: print(out) }
      console.log(`  ${name.padEnd(26)} ${info.width}x${info.height}  ${(info.size / 1024).toFixed(0)}KB`)
    }
    for (const f of readdirSync(join(FIGMA, key)).filter((x) => GIF.test(x)).sort()) {
      const name = parse(f).name
      const out = join(outDir, `${name}.gif`)
      copyFileSync(join(FIGMA, key, f), out)
      const meta = await sharp(out, { animated: true }).metadata()
      media[key][name] = { w: meta.width, h: meta.pageHeight ?? meta.height, ext: 'gif', v: print(out) }
      console.log(`  ${name.padEnd(26)} animated, as supplied  ${meta.width}x${meta.pageHeight ?? meta.height}  ${(statSync(out).size / 1024).toFixed(0)}KB`)
    }
    for (const f of readdirSync(join(FIGMA, key)).filter((x) => VIDEO.test(x)).sort()) {
      const name = slug(parse(f).name)
      if (films[name] || media[key][name]) { console.log(`  ${name}: skipped, that name is taken`); continue }
      const film = join(outDir, `${name}.mp4`)
      copyFileSync(join(FIGMA, key, f), film)
      /* The poster: Quick Look's frame of the film, which also gives its shape. */
      const tmp = mkdtempSync(join(tmpdir(), 'ripe-poster-'))
      execFileSync('qlmanage', ['-t', '-s', '1280', '-o', tmp, join(FIGMA, key, f)], { stdio: 'ignore' })
      const thumb = join(tmp, `${f}.png`)
      if (existsSync(thumb)) {
        const poster = join(outDir, `${name}.jpg`)
        const info = await sharp(thumb).resize(1280, 1280, { fit: 'inside', withoutEnlargement: true })
          .jpeg({ quality: 80, mozjpeg: true, progressive: true }).toFile(poster)
        media[key][name] = { w: info.width, h: info.height, video: true, figma: true, v: print(poster), vf: print(film) }
        console.log(`  ${name.padEnd(26)} film, as supplied  ${(statSync(film).size / 1024).toFixed(0)}KB  + poster`)
      } else {
        rmSync(film)
        console.log(`  ${name}: skipped, no poster could be made`)
      }
      rmSync(tmp, { recursive: true, force: true })
    }
  }

  const bgIn = join(FIGMA, 'backgrounds')
  if (existsSync(bgIn)) {
    const bgOut = join(OUT, 'backgrounds')
    rmSync(bgOut, { recursive: true, force: true })
    mkdirSync(bgOut, { recursive: true })
    media.backgrounds = {}
    console.log('— Backgrounds')
    for (const f of readdirSync(bgIn).filter((x) => IMAGE.test(x)).sort()) {
      /* The chapter's number, and a second number for a background that
         takes over part way through it: ripe-06-bg, ripe-06-bg-2. */
      const n = parse(f).name.match(/\d+/g)
      if (!n) { console.log(`  skipped ${f}: no number in the name`); continue }
      const key = n[0].padStart(2, '0') + (n[1] ? `-${n[1]}` : '')
      const out = join(bgOut, `ripe-${key}-bg.jpg`)
      const info = await web(join(bgIn, f), out, BG_LONG, 70)
      media.backgrounds[key] = { w: info.width, h: info.height, v: print(out) }
      console.log(`  ${key.padEnd(26)} ${info.width}x${info.height}  ${(info.size / 1024).toFixed(0)}KB`)
    }
  }
  pruneUnused(media)
  /* Films come in as supplied; this makes them light enough to serve. */
  optimiseFilms(media)
  return true
}

/** Only what the page shows is published: a picture or film in a chapter
    folder that copy.ts doesn't pick, or a background no chapter uses, is
    taken out of public/ (its source stays where it is), so trying a
    picture out and dropping it leaves nothing behind to deploy. */
function pruneUnused(media) {
  const copy = readFileSync('components/ripe-10-days/copy.ts', 'utf8')
  const picks = new Set([...copy.matchAll(/^\s*\['([a-z0-9-]+)',\s*'/gm)].map((m) => m[1]))
  const bgs = new Set([...copy.matchAll(/\bbg\('(\d+)'\)|\bbgThen\('([\d-]+)'/g)].map((m) => m[1] ?? m[2]))
  const gone = []
  for (const key of Object.keys(media).filter((k) => /^\d+$/.test(k))) {
    for (const name of Object.keys(media[key])) {
      if (picks.has(name)) continue
      for (const ext of ['jpg', 'gif', 'mp4']) rmSync(join(OUT, key, `${name}.${ext}`), { force: true })
      delete media[key][name]
      gone.push(`${key}/${name}`)
    }
  }
  for (const key of Object.keys(media.backgrounds ?? {})) {
    if (bgs.has(key)) continue
    rmSync(join(OUT, 'backgrounds', `ripe-${key}-bg.jpg`), { force: true })
    delete media.backgrounds[key]
    gone.push(`backgrounds/${key}`)
  }
  if (gone.length) console.log(`— Not on the page, so not published: ${gone.join(', ')}`)
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  if (!existsSync(FIGMA)) { console.error(`No Figma export at ${FIGMA}`); process.exit(1) }
  const media = JSON.parse(readFileSync(MANIFEST, 'utf8'))
  await applyFigmaExport(media)
  writeFileSync(MANIFEST, JSON.stringify(media, null, 2) + '\n')
  console.log(`wrote ${MANIFEST}`)
}

#!/usr/bin/env node
/* One grade for every photograph in "10 Days of RIPE".
 *
 * The folders are phone photographs straight off the camera: each one
 * exposed and coloured on its own, so side by side they read as many
 * different places rather than one. This puts them on one look and
 * writes web-sized copies; the originals are never touched.
 *
 *   node scripts/ripe/grade-10-days.mjs
 *
 * In:  ../RIPE source/10 Days of RIPE/NN/*          (one folder per chapter
 *                                                  of the story, numbered
 *                                                  as in RIPE Story.pages)
 *      ../RIPE source/10 Days of RIPE/Backgrounds/*  (one per chapter, the
 *                                                  number in the name)
 * Out: public/RIPE/10-days/NN/*.jpg               (graded; what the page uses)
 *      public/RIPE/10-days/backgrounds/ripe-NN-bg.jpg
 *      components/ripe-10-days/media.json         (every copy's pixel size,
 *                                                  read by the page)
 *
 * Folders that aren't numbered — Extra, for one — are left alone: they
 * hold pictures that aren't on the page.
 *
 * The grade, in two passes so the order is ours (sharp runs the
 * operations of one pipeline in its own fixed order):
 *
 *   Level — every picture onto the same footing.
 *   1. Black and white points stretched to the picture's own darkest and
 *      lightest tones, so a hazy sky and a deep shade sit on one range.
 *   2. Exposure brought to one level: mean luminance nudged towards a
 *      shared target, within limits.
 *
 *   Look — the same on every picture.
 *   3. Saturation up by an eighth: vivid, but short of the phone's own
 *      push, so the red floor and the fern stay believable.
 *   4. A little warmth: blue trimmed, red lifted, so the skies sit with
 *      the laterite and the RIPE green rather than against them.
 *   5. A touch more contrast for depth.
 *
 * Night pictures skip the levelling. Stretching a dark sky to a full
 * range, or lifting it to the daytime exposure, turns it into grey noise;
 * they take the look only, so they stay night. A picture counts as night
 * when its mean luminance is under NIGHT_LUMA.
 *
 * Videos (.mp4 / .mov) are copied as supplied — they come in already
 * cut down for the web — with a poster frame saved beside them by Quick
 * Look. Nothing here can colour a film, so the page grades them as they
 * play, with a CSS filter tuned to this look (FILM_GRADE in
 * components/ripe-10-days/RipeStoryDays.tsx). The poster is left
 * ungraded for the same reason: it takes the same filter on the page, so
 * it matches the film's first frame.
 *
 * Re-run it whenever the folders change. Each output folder is cleared
 * first, so a picture moved or removed doesn't leave its old copy behind.
 *
 * Once the stills are finished in Figma (a "Figma export" folder beside
 * the chapter folders — see figma-export.mjs), those are the page's
 * stills and backgrounds: this script then grades none of its own, and
 * writes the Figma ones in their place after copying the films.
 */

import sharp from 'sharp'
import { readdirSync, mkdirSync, statSync, mkdtempSync, rmSync, existsSync, copyFileSync, writeFileSync, readFileSync } from 'node:fs'
import { createHash } from 'node:crypto'
import { join, parse } from 'node:path'
import { tmpdir } from 'node:os'
import { execFileSync } from 'node:child_process'
import { applyFigmaExport, FIGMA, SOURCE } from './figma-export.mjs'

/* Beside the project (see figma-export.mjs), not in public/. */
const SRC = SOURCE
const OUT = 'public/RIPE/10-days'
const MANIFEST = 'components/ripe-10-days/media.json'

const GRADE = {
  /* percentiles taken as black and white in the levelling pass */
  levels: { lower: 0.5, upper: 99.6 },
  targetLuma: 122,          // mean luminance every picture is brought to
  exposureRange: [0.86, 1.14],
  saturation: 1.12,
  /* rows are output R, G, B; columns are input R, G, B */
  warm: [
    [1.03, 0.0, 0.0],
    [0.0, 1.0, 0.0],
    [0.0, 0.01, 0.95],
  ],
  /* out = in * slope + lift: a little contrast about the middle grey */
  slope: 1.05,
  lift: -6,
}

/* Long edge, in pixels. Pictures fly past at up to about a third of the
   screen; backgrounds fill it, but are shown faint. */
const LONG = 1400
const BG_LONG = 1920

const NIGHT_LUMA = 60

/* Pictures to turn after the camera's own orientation is applied, in
   degrees clockwise. Keyed by folder, then by the file's own name. The
   originals are left as supplied. */
const ROTATE = {
  /* RIPE26 painted on the wood slice: shot sideways, turned upright. */
  '04': { 'aura-painting-ripe': 90 },
}

/* Films to cut shorter, by folder and the film's own name: seconds off
   the start and off the end. Cut by trim-film.swift without re-encoding;
   the originals are left as supplied. */
const TRIM = {
  /* "Waving hi from the field": the last three seconds go. */
  '01': { 'ripe-familiar-new': { start: 0, end: 3 } },
}

/* A web-safe name for the copy: "ripe-rainbow 9.31.21 PM" → "ripe-rainbow-9-31-21-pm". */
const slug = (name) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')

/* "1", "01", "Day 1" → "01". */
const num = (s) => s.replace(/\D/g, '').padStart(2, '0')

/* A short fingerprint of a file's contents, recorded in media.json and
   added to its address on the page (?v=…). A picture replaced under the
   same name gets a new address, so browsers fetch it instead of showing
   the copy they kept. */
const print = (file) => createHash('sha1').update(readFileSync(file)).digest('hex').slice(0, 8)

const IMAGE = /\.(jpe?g|png|heic)$/i
const VIDEO = /\.(mp4|mov|m4v)$/i
const lumaOf = async (img) => {
  const { channels } = await img.clone().stats()
  const [r, g, b] = channels.map((c) => c.mean)
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

/* Level (daylight only), then the look. turn: extra clockwise degrees. */
async function grade(file, long, quality, turn = 0) {
  const upright = await sharp(file).rotate().toBuffer()
  const sized = await sharp(upright).rotate(turn)
    .resize(long, long, { fit: 'inside', withoutEnlargement: true })
    .toBuffer()
  const night = (await lumaOf(sharp(sized))) < NIGHT_LUMA
  const base = night ? sharp(sized) : sharp(await sharp(sized).normalise(GRADE.levels).toBuffer())
  const luma = await lumaOf(base)
  const [lo, hi] = GRADE.exposureRange
  const exposure = night ? 1 : Math.min(Math.max(GRADE.targetLuma / luma, lo), hi)
  return {
    night, luma, exposure,
    write: (out) => base
      .modulate({ brightness: exposure, saturation: GRADE.saturation })
      .recomb(GRADE.warm)
      .linear(GRADE.slope, GRADE.lift)
      .jpeg({ quality, mozjpeg: true, progressive: true })
      .toFile(out),
  }
}

const media = {}

/* Stills and backgrounds come from Figma once it has them. */
const fromFigma = existsSync(FIGMA)

const chapters = readdirSync(SRC)
  .filter((d) => /^(day\s*)?\d+$/i.test(d) && statSync(join(SRC, d)).isDirectory())
  .sort((a, b) => parseInt(num(a)) - parseInt(num(b)))

for (const chapter of chapters) {
  const dir = join(SRC, chapter)
  const key = num(chapter)
  const outDir = join(OUT, key)
  rmSync(outDir, { recursive: true, force: true })
  mkdirSync(outDir, { recursive: true })
  media[key] = {}
  console.log(`— ${key}`)

  for (const f of fromFigma ? [] : readdirSync(dir).filter((x) => IMAGE.test(x)).sort()) {
    const name = slug(parse(f).name)
    const g = await grade(join(dir, f), LONG, 78, ROTATE[key]?.[parse(f).name] ?? 0)
    const out = join(outDir, `${name}.jpg`)
    const info = await g.write(out)
    media[key][name] = { w: info.width, h: info.height, v: print(out) }
    console.log(`  ${name.padEnd(26)} luma ${g.luma.toFixed(0).padStart(3)} → x${g.exposure.toFixed(2)}${g.night ? ' night' : '      '}  ${info.width}x${info.height}  ${(info.size / 1024).toFixed(0)}KB`)
  }

  for (const f of readdirSync(dir).filter((x) => VIDEO.test(x)).sort()) {
    const name = slug(parse(f).name)
    const film = join(outDir, `${name}.mp4`)
    const cut = TRIM[key]?.[parse(f).name]
    if (cut) {
      execFileSync('swift', [join('scripts', 'ripe', 'trim-film.swift'), join(dir, f), film, String(cut.start), String(cut.end)], { stdio: ['ignore', 'ignore', 'inherit'] })
    } else {
      copyFileSync(join(dir, f), film)
    }

    /* The poster: Quick Look's thumbnail of the film, which also gives
       the film's shape. */
    const tmp = mkdtempSync(join(tmpdir(), 'ripe-poster-'))
    execFileSync('qlmanage', ['-t', '-s', '1280', '-o', tmp, join(dir, f)], { stdio: 'ignore' })
    const thumb = join(tmp, `${f}.png`)
    if (existsSync(thumb)) {
      const poster = join(outDir, `${name}.jpg`)
      const info = await sharp(thumb).resize(1280, 1280, { fit: 'inside', withoutEnlargement: true })
        .jpeg({ quality: 80, mozjpeg: true, progressive: true })
        .toFile(poster)
      media[key][name] = { w: info.width, h: info.height, video: true, v: print(poster), vf: print(film) }
    }
    rmSync(tmp, { recursive: true, force: true })
    console.log(`  ${name.padEnd(26)} video, ${cut ? `trimmed ${cut.start}s / ${cut.end}s` : 'as supplied'}  ${(statSync(film).size / 1024).toFixed(0)}KB  + poster`)
  }
}

/* ── The chapter backgrounds ──
   One wide picture per chapter, behind its words on the page, faint.
   Graded with the same look as the photographs, so the wash behind a
   chapter is the same colour world as the pictures over it; exported
   lighter, since at the opacity it is shown at, detail is wasted. */
const BG_SRC = join(SRC, 'Backgrounds')
const BG_OUT = join(OUT, 'backgrounds')

if (existsSync(BG_SRC) && !fromFigma) {
  rmSync(BG_OUT, { recursive: true, force: true })
  mkdirSync(BG_OUT, { recursive: true })
  media.backgrounds = {}
  console.log('— Backgrounds')
  for (const f of readdirSync(BG_SRC).filter((x) => IMAGE.test(x)).sort()) {
    /* The first number in the name: "ripe-05-bg", and "ripw-05-bg" too. */
    const n = f.match(/(\d+)/)
    if (!n) { console.log(`  skipped ${f}: no number in the name`); continue }
    const key = num(n[1])
    const g = await grade(join(BG_SRC, f), BG_LONG, 70)
    const out = join(BG_OUT, `ripe-${key}-bg.jpg`)
    const info = await g.write(out)
    media.backgrounds[key] = { w: info.width, h: info.height, v: print(out) }
    console.log(`  ${key.padEnd(26)} luma ${g.luma.toFixed(0).padStart(3)} → x${g.exposure.toFixed(2)}  ${info.width}x${info.height}  ${(info.size / 1024).toFixed(0)}KB`)
  }
}

/* ── The banner ──
   A video in the folder itself with "banner" in its name is the page's
   header film. It comes in at camera bitrate with sound — 20MB for eleven
   seconds — so it is re-encoded by encode-film.swift: once at full HD for
   wide screens, once smaller for phones, both silent, both able to start
   before they've finished downloading. A poster frame from the encoded
   film shows while it loads. The header grades it as /ripe's does, with
   its own brightness filter, so nothing is graded here. */
const BANNER_OUT = join(OUT, 'banner')
/* With more than one, the newest: a new banner dropped in replaces the old. */
const bannerSrc = readdirSync(SRC)
  .filter((f) => VIDEO.test(f) && /banner/i.test(f))
  .sort((a, b) => statSync(join(SRC, b)).mtimeMs - statSync(join(SRC, a)).mtimeMs)[0]
if (bannerSrc) {
  rmSync(BANNER_OUT, { recursive: true, force: true })
  mkdirSync(BANNER_OUT, { recursive: true })
  console.log('— Banner')
  const encode = (out, long, bps) => execFileSync('swift',
    [join('scripts', 'ripe', 'encode-film.swift'), join(SRC, bannerSrc), out, String(long), String(bps)],
    { stdio: ['ignore', 'ignore', 'ignore'] })
  const wide = join(BANNER_OUT, 'ripe-banner.mp4')
  const phone = join(BANNER_OUT, 'ripe-banner-phone.mp4')
  encode(wide, 1920, 4_500_000)
  encode(phone, 1280, 2_200_000)
  /* The writer can leave a temporary copy beside each film; not shipped. */
  for (const f of readdirSync(BANNER_OUT)) if (/\.sb-/.test(f)) rmSync(join(BANNER_OUT, f))
  const tmp = mkdtempSync(join(tmpdir(), 'ripe-banner-'))
  execFileSync('qlmanage', ['-t', '-s', '1920', '-o', tmp, wide], { stdio: 'ignore' })
  const thumb = join(tmp, 'ripe-banner.mp4.png')
  const poster = join(BANNER_OUT, 'ripe-banner.jpg')
  if (existsSync(thumb)) {
    await sharp(thumb).jpeg({ quality: 76, mozjpeg: true, progressive: true }).toFile(poster)
  }
  rmSync(tmp, { recursive: true, force: true })
  media.banner = {
    v: print(wide), vp: print(phone),
    ...(existsSync(poster) ? { vposter: print(poster) } : {}),
  }
  console.log(`  ${bannerSrc}: ${(statSync(join(SRC, bannerSrc)).size / 1048576).toFixed(1)}MB → ${(statSync(wide).size / 1048576).toFixed(1)}MB wide, ${(statSync(phone).size / 1048576).toFixed(1)}MB phone + poster`)
}

if (fromFigma) await applyFigmaExport(media)

writeFileSync(MANIFEST, JSON.stringify(media, null, 2) + '\n')
console.log(`wrote ${MANIFEST}`)

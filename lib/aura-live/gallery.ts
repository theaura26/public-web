/* AURA Live — editorial imagery, and saying so.
 *
 * Most estate records have no photograph. A feed of text blocks is a
 * worse read than a feed with pictures, so a card without event media can
 * take one from AURA's archive — on two conditions that are not
 * negotiable and are enforced here rather than left to a reviewer.
 *
 * One: the picture is labelled as archive imagery everywhere it appears,
 * so no reader can mistake it for evidence of the event.
 *
 * Two: selection is deterministic. The same card shows the same picture
 * on every render, on every device, forever — chosen by hashing the feed
 * entry's own id. A card that changes its photograph when you reload is a
 * card that was never telling you anything about that photograph.
 *
 * The manifest is data/aura-live/gallery.json. Replacing archive imagery
 * with real event media needs no code change: when the gateway starts
 * returning approved media for a record, event media wins and the gallery
 * is not consulted.
 */

import type { AuraFeedCategory } from './taxonomy'
import type { FeedMedia } from './schema'
import galleryManifest from '@/data/aura-live/gallery.json'

export type GalleryAsset = {
  id: string
  src: string
  alt: string
  /** Categories this picture may illustrate. Empty means none. */
  categories: string[]
  /** Optional narrowing: only used when the card's subject matches. */
  subjects?: string[]
  ratio: string
  credit?: string
  /** Any restriction a reviewer put on the asset. Honoured, not shown. */
  restrictions?: string[]
}

const ASSETS: GalleryAsset[] = (galleryManifest as { assets: GalleryAsset[] }).assets

/** Stable across processes and deploys — Node's hash seeds are not. */
function hash(input: string): number {
  let h = 2166136261
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

function parseRatio(ratio: string): number | undefined {
  const m = ratio.match(/^(\d+(?:\.\d+)?)\s*[:/]\s*(\d+(?:\.\d+)?)$/)
  if (!m) return undefined
  const w = Number(m[1]); const h = Number(m[2])
  return h > 0 ? w / h : undefined
}

/**
 * Pick one archive image for a card, or nothing.
 *
 * Nothing is a perfectly good answer: a card with no picture is honest,
 * and better than a picture that quietly implies it shows the event.
 */
export function pickGalleryImage(
  entryId: string,
  category: AuraFeedCategory,
  subject: string,
  /** Assets already used by nearby cards. Avoided where possible so the
   *  feed does not run the same photograph twice down the page. Passed by
   *  the pipeline at publish time, never at render time, so a card's
   *  picture is still fixed the moment it is stored. */
  recentlyUsed: readonly string[] = [],
): FeedMedia | null {
  const subjectLower = subject.toLowerCase()

  const eligible = ASSETS.filter((a) => a.categories.includes(category))
  if (!eligible.length) return null

  /* A subject-tagged asset is preferred when it matches, so a card about
     the herd does not draw a picture of a coffee block. But a tag with
     one asset behind it is not a preference, it is a guarantee that every
     Jeevamrit card in the feed shows the same tank — so a thin tagged
     pool is widened with the category’s untagged assets. */
  const untagged = eligible.filter((a) => !a.subjects?.length)
  const tagged = eligible.filter((a) => a.subjects?.some((s) => subjectLower.includes(s.toLowerCase())))
  const pool = tagged.length >= 2 ? tagged : [...tagged, ...untagged]
  if (!pool.length) return null

  /* Prefer something the reader has not just seen. Two cards in a row
     under the same photograph reads as a rendering fault, and it costs
     the feed the variety the archive exists to provide. When everything
     eligible has been used recently the whole pool comes back, because a
     repeat is better than a card with no picture at all. */
  const fresh = pool.filter((a) => !recentlyUsed.includes(a.src))
  const choices = fresh.length ? fresh : pool

  const chosen = choices[hash(entryId) % choices.length]
  return {
    type: 'editorial_thumbnail',
    url: chosen.src,
    alt: chosen.alt,
    credit: chosen.credit,
    ratio: parseRatio(chosen.ratio),
    isEditorialImagery: true,
  }
}

export function galleryAssetCount(): number {
  return ASSETS.length
}

/**
 * The mark on the timeline: one picture per subject, the same on every
 * entry in that subject.
 *
 * Sameness is what makes it safe. A circular thumbnail that changes from
 * entry to entry would read as a picture of the event; one that is
 * identical on all nine sprays entries reads as what it is, an icon for
 * the subject. It is decorative, carries no alt text, and is hidden from
 * screen readers — the subject is written out beside it either way.
 */
export function categoryThumbnail(category: AuraFeedCategory): string | null {
  const eligible = ASSETS.filter((a) => a.categories.includes(category) && !a.subjects?.length)
  const pool = eligible.length ? eligible : ASSETS.filter((a) => a.categories.includes(category))
  if (!pool.length) return null
  /* First by id, so it is stable against anything but an edit to the
     manifest — and an edit to the manifest is somebody deciding. */
  return [...pool].sort((a, b) => a.id.localeCompare(b.id))[0].src
}

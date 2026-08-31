'use client'

import {
  Butterfly, Drop, Plant, Basket, CloudRain, Cow, Flask, UsersThree,
  MoonStars, Hexagon, Flask as FlaskFallback, Wine, HandsPraying,
} from '@phosphor-icons/react'
import type { AuraFeedCategory } from '@/lib/aura-live/taxonomy'
import { CATEGORY_LABEL } from '@/lib/aura-live/taxonomy'

/* The mark on the spine.
 *
 * One glyph per category, so a reader scanning the rail can see the shape
 * of a week — three sprays, a sighting, a harvest — without reading a
 * word of it. Phosphor, which the site already uses on the homepage and
 * at Ohara, at the same hairline weight as the rest of the page.
 *
 * Decorative, and marked as such: the category is written out in the
 * entry beside it, so a screen reader that announced the icon too would
 * be reading the same word twice.
 */

const GLYPH: Record<AuraFeedCategory, typeof Butterfly> = {
  'seasons': CloudRain,
  'lunar-rhythm': MoonStars,
  'sprays': Drop,
  'fertiliser-prep': FlaskFallback,
  'labs': Flask,
  'biodiversity': Butterfly,
  'bees': Hexagon,
  'cows': Cow,
  'field-activities': Plant,
  'harvest': Basket,
  'fermentation': Wine,
  'people': UsersThree,
  'prayers': HandsPraying,
}

export default function CategoryGlyph({ category, size = 17 }: { category: AuraFeedCategory; size?: number }) {
  const Icon = GLYPH[category] ?? Plant
  return <Icon size={size} weight="light" aria-hidden="true" focusable="false" />
}

export function glyphTitle(category: AuraFeedCategory): string {
  return CATEGORY_LABEL[category]
}

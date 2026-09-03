import type { Metadata } from 'next'
import {
  MicroNav, Panel, Chapter, NextBanners, ArrowLinkStyles,
} from '@/components/coffee/Microsite'
import { ExperienceBlock } from '@/components/coffee/ExperienceForm'
import { Programme } from '@/components/coffee/Programme'

export const metadata: Metadata = {
  title: 'Aura Festival — Regenerative Coffee',
  description:
    'Three days at Mudigere — the wet mill at five, the lab bench, the blocks and the cupping table. November or December, small groups, and one lot set by you.',
  alternates: { canonical: '/regenerative-coffee/experience' },
}

/*
 * The Aura Festival — the site's one ask, built to the same system as
 * the three pillars: banner, line, form, then the three days, then the
 * hand-off to everything else. No clay close: this page is what the
 * clay close on every other page points at.
 */

export default function ExperiencePage() {
  return (
    <>
      <MicroNav />
      <ArrowLinkStyles />

      {/* Standing in until the festival has its own photograph. The
          sorting floor is the closest thing in the library to what the
          three days actually are — cherry on a table and hands over it,
          which is what the chapter under this banner says. Panel draws
          a 55% scrim over whatever it is given, so the white display
          type holds. */}
      <Panel
        hero
        align="centre"
        title="Aura Festival."
        src="/regenerative-coffee/flavours/aura-grader-table.webp"
        alt="Two baskets of freshly picked coffee cherry on the sorting floor at Mudigere"
        lede="Three days inside a living system. You set one lot's protocol yourself, and it reaches you under your own name about four months later. Twenty places, three times a year."
      />

      <Chapter tight>The knowledge enters through the hands before it reaches the head.</Chapter>

      <ExperienceBlock />

      <Chapter tight>On the third day you build a coffee that exists nowhere else.</Chapter>

      <Programme />

      <NextBanners from="experience" />
    </>
  )
}

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

      <Panel
        hero
        align="centre"
        title="Aura Festival."
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

import type { Metadata } from 'next'
import {
  MicroNav, Panel, Chapter, NextBanners, ArrowLinkStyles,
} from '@/components/coffee/Microsite'
import { ExperienceBlock } from '@/components/coffee/ExperienceForm'
import { Programme } from '@/components/coffee/Programme'

export const metadata: Metadata = {
  title: 'Aura Festival — Regenerative Coffee',
  description:
    'Three days on the estate at Mudigere — the wet mill at five, the lab bench, the blocks and the cupping table. November or December, in small groups, and you go home with a lot of your own.',
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
        lede="Three days on the estate, and you go home having designed a lot of your own. Twenty places a window, three times a year."
      />

      <Chapter tight>Come and get your hands dirty.</Chapter>

      <ExperienceBlock />

      <Chapter tight>On the third day you build a coffee that exists nowhere else.</Chapter>

      <Programme />

      <NextBanners from="experience" />
    </>
  )
}

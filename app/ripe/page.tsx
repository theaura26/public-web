import { RipeShell } from '@/components/ripe/RipeShell'
import { RipeHero } from '@/components/ripe/RipeHero'
import { RipeNav } from '@/components/ripe/RipeNav'
import { RipeDays } from '@/components/ripe/RipeDays'
import { RipeRemember } from '@/components/ripe/RipeRemember'
import {
  RipeOpening, RipeDisplay, RipeArcs, RipePrepared, RipeClosing,
  RipeGratitude, RipeRegistry, RipeReadMore,
} from '@/components/ripe/RipeBlocks'
import { RipePageBanner } from '@/components/ripe/RipePageBanner'
import { RIPE_HERO_LINK, SEASON_BANNER_ON_RIPE } from '@/components/ripe/after-copy'

/* ═══════════════════════════════════════════════════════════════════
   RIPE — Mudigere, Harvest 2026.

   Built to AURA // Coffee Festival, page Web, node 857:42. The order,
   the words and the colour are the design's; see design/coffee-festival
   for the extraction and for the two places this departs from it.

   The page runs black from the opener to the last line, which is the
   frame's own fill. The three display strings are the supplied artwork
   rather than type, so the two faces in the design that the site does
   not carry are needed only for the handwritten lines — those use the
   site's own hand, Mynerve.
═══════════════════════════════════════════════════════════════════ */

export default function RipePage() {
  return (
    <RipeShell>
      {/* The mark and the line lead through to the season that followed:
          hovering either washes its coral and its words across them. */}
      <RipeHero link={RIPE_HERO_LINK} pair={{ current: 'before', href: '/ripe/after', hover: '#FF2D87' }} />
      <RipeOpening />
      <RipeNav />
      {/* The two journeys, before the days, so a reader knows which
          applies to them before the dates start. */}
      <RipeArcs />

      <RipeDisplay id="rhythm" src="/RIPE/aura-the-rhythm.svg" alt="The rhythm"
                   width={1300} height={256} max={1344} />
      <RipeDays />

      {/* The dawn used to reach this heading from the journeys section,
          which sat just above it; with the journeys moved up it claims
          the dawn itself. */}
      <RipeDisplay id="prepared" src="/RIPE/aura-come-prepared.svg" alt="Come prepared"
                   width={1519} height={124} max={1593} ground="dawn" />
      <RipePrepared />

      <RipeClosing />
      <RipeGratitude />

      <RipeRemember />
      <RipeRegistry />
      {/* RipeHarvest is kept in RipeBlocks to switch on later. */}
      <RipeReadMore />
      <RipePageBanner banner={SEASON_BANNER_ON_RIPE} />
    </RipeShell>
  )
}

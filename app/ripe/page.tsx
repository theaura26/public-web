import { RipeShell } from '@/components/ripe/RipeShell'
import { RipeHero } from '@/components/ripe/RipeHero'
import { CORAL, TAGLINE as SISTER_TAGLINE } from '@/components/ripe-10-days/copy'
import { RipeBanner, ArrowLinkStyles } from '@/components/coffee/Microsite'
import { RipeNav } from '@/components/ripe/RipeNav'
import { RipeDays } from '@/components/ripe/RipeDays'
import { RipeRemember } from '@/components/ripe/RipeRemember'
import {
  RipeOpening, RipeDisplay, RipeArcs, RipePrepared, RipeClosing,
  RipeGratitude, RipeRegistry, RipeReadMore,
} from '@/components/ripe/RipeBlocks'

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
      {/* The mark and tagline lead through to the sister page: on hover
          coral sweeps across them from the left, rewriting the tagline as
          the sister page's own, and a click opens 10 Days of RIPE. */}
      <RipeHero link={{
        href: '/ripe/after',
        hover: CORAL,
        markHover: '/RIPE/10-days/aura-ripe-coral.svg',
        taglineHover: SISTER_TAGLINE,
        label: 'Right time made visible — open 10 Days of RIPE',
      }} />
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
      {/* The banner that closes 10 Days of RIPE, pointing back the other
          way — to the sister page, in its pink and words — before the
          stories that go further into Aura. */}
      <RipeBanner
        href="/ripe/after"
        name="10 Days of RIPE"
        mark="/RIPE/10-days/aura-ripe-coral.svg"
        line={SISTER_TAGLINE.join(' ')}
        action="Discover 10 Days of RIPE"
        accent={CORAL}
        image="/RIPE/10-days/banner/ripe-banner.jpg"
      />
      <ArrowLinkStyles />
      <RipeReadMore />
    </RipeShell>
  )
}

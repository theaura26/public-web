import { RipeShell } from '@/components/ripe/RipeShell'
import { RipeHero } from '@/components/ripe/RipeHero'
import { RipeNav } from '@/components/ripe/RipeNav'
import { RipeDays } from '@/components/ripe/RipeDays'
import { RipeRemember } from '@/components/ripe/RipeRemember'
import {
  RipeOpening, RipeDisplay, RipeArcs, RipePrepared, RipeClosing,
  RipeGratitude, RipeRegistry, RipeHarvest,
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
      <RipeHero />
      <RipeOpening />
      <RipeNav />

      <RipeDisplay id="rhythm" src="/RIPE/aura-the-rhythm.svg" alt="The rhythm"
                   width={1300} height={256} max={1344} />
      <RipeDays />
      <RipeArcs />

      <RipeDisplay id="prepared" src="/RIPE/aura-come-prepared.svg" alt="Come prepared"
                   width={1519} height={124} max={1593} />
      <RipePrepared />

      <RipeClosing />
      <RipeGratitude />

      <RipeRemember />
      <RipeRegistry />
      <RipeHarvest />
    </RipeShell>
  )
}

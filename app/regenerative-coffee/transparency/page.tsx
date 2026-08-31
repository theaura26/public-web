import { ChapterBackdrop } from '@/components/coffee/ChapterBackdrop'
import { TRANSPARENCY, STEPS } from '@/lib/regenerative-coffee-gallery'
import type { Metadata } from 'next'
import {
  MicroNav, Panel, Scene, Chapter, Closing, NextBanners, ReserveBanner,
  LoopDiagram, ArrowLinkStyles,
} from '@/components/coffee/Microsite'

export const metadata: Metadata = {
  title: 'Transparency — Regenerative Coffee',
  description:
    'Nine streams of data, every batch read before and after, the block re-read at ninety days — and an honest account of the one thing we cannot yet prove.',
  alternates: { canonical: '/regenerative-coffee/transparency' },
}

export default function TransparencyPage() {
  return (
    <>
      <MicroNav />
      <ArrowLinkStyles />

      {/* One ground for the whole chapter, dissolving between the

          photographs as the scenes scroll over it. */}

      <ChapterBackdrop frames={TRANSPARENCY} steps={STEPS.transparency} />


      <Panel
        hero
        align="centre"
        title="Sensors and hands, one record."
        lede="Machines take their own readings. People sign theirs. The record is both halves together."
      />

      <Scene title="One row, out of millions.">
        Everything on the last page is easy to claim and hard to check. This
        page is the checking. Somewhere in a file on this estate there is a
        row that reads: BD 501, Block 07, 06:14, waning moon, humidity 78%, by
        Rao, dung batch G-03. The minute. The moon. The hand. The source. That
        one row is the unit this whole system exists to protect.
      </Scene>

      <LoopDiagram
        centre={['Closed loop', 'regenerative', 'biodiversity', 'plantation']}
        caption="Observe, remember, learn, act — then observe what the acting changed. Sensors hold the parts no person can watch continuously; people hold the judgment no sensor has. The loop only closes because both are in it."
      />

      <Scene title="Nine streams, nine clocks.">
        Fermentation is read every fifteen minutes. Temperature three times a
        day. Brix at the start, the middle and the end. Soil chemistry
        quarterly, at 5 cm and at 20 cm. Earthworms counted by hand, inside a
        square of string. A machine writes its own numbers and a person signs
        theirs; nobody enters a reading for work they did not do. A ledger
        cannot forget, and it cannot flatter.
      </Scene>

      <Scene title="No untested material touches the soil.">
        Every batch of preparation is read in our own lab before it goes out
        and again after it lands — pH, conductivity, colony counts,
        Trichoderma and Pseudomonas counted by name. A batch that comes back
        wrong is corrected, or it is held.
      </Scene>

      <Scene title="Then the block is read again at ninety days.">
        Which is the part most people skip. Recording what was done is easy.
        Recording whether it worked is the harder half, and it is the only
        half that can tell you to stop.
      </Scene>

      <Chapter>Here is what we cannot prove.</Chapter>

      <Scene title="The solera, which we cannot prove.">
        We carry a fraction of a fermenting batch forward into the next
        harvest’s cherry, the way a sherry bodega carries a barrel forward
        across decades. We think it builds continuity. We would like it to be
        true. But nobody has shown a coffee strain that survives that gap — a
        coffee ferment runs in days, a solera runs in decades, and the
        metaphor is doing work the science has not done yet. So we are testing
        it, year on year, and we will publish it either way.
      </Scene>

      <Scene title="There is no certificate.">
        Nothing to point at. The tea block goes into transition in 2027, the
        cupping room on the estate is not built yet, and there is no public
        chain to verify any of this against. What exists instead is a record.
        In August 2026 we cupped four of the Arabica lots to SCA protocol and
        they came back between 82.25 and 85.25 on our own table, every one
        scoring a perfect 10 on uniformity, clean cup and sweetness. The note
        against them says the ceiling right now is the roast, and the coffee
        underneath it has further to go.
      </Scene>

      <Closing>{`The record instead.
We are not certified organic or biodynamic. We practise both, and publish what the ground actually did.
Signed.
Timestamped.
Re-read at ninety days.
Ours to prove.`}</Closing>

      <NextBanners from="transparency" />

      <ReserveBanner />
    </>
  )
}

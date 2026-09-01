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
        lede="Machines log what they measure. People sign what they did. The estate record is both halves, and neither one is allowed to fill in for the other."
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

      <Scene title="Nine streams, each on its own clock.">
        Fermentation every fifteen minutes. Temperature three times a day.
        Brix at the start, the middle and the end. Soil chemistry quarterly,
        at 5 cm and at 20 cm. Earthworms counted by hand, inside a square of
        string laid on the ground. Sensors write their own numbers; the person
        who did the work signs for theirs, by name, and nobody signs for work
        somebody else did.
      </Scene>

      <Scene title="No untested material touches the soil.">
        Every batch of preparation is read in our own lab before it goes out
        and again after it lands — pH, conductivity, colony counts,
        Trichoderma and Pseudomonas counted by name. A batch that comes back
        wrong is corrected, or it is held.
      </Scene>

      <Scene title="The block is read again ninety days later.">
        This is the part most farms skip. Writing down what you applied takes
        a minute; going back a season later to measure whether it changed
        anything is the harder half, and it is the only half that can tell you
        to stop doing something.
      </Scene>

      <Chapter>Here is what we cannot prove.</Chapter>

      <Scene title="The solera we cannot prove yet.">
        <p>
          We carry a fraction of one fermenting batch forward into the
          next harvest’s cherry, the way a sherry bodega carries a barrel
          forward across decades. We think it builds continuity between
          harvests. We would like that to be true.
        </p>
        <p>
          What we can say is that nobody has yet shown a coffee microbe
          surviving a twelve-month gap between ferments — a coffee ferment
          runs in days, a sherry solera runs in decades, and right now the
          comparison is doing work the evidence has not done. We are
          testing it harvest by harvest and will publish the result either
          way.
        </p>
      </Scene>

      <Scene title="There is no certificate.">
        <p>
          Nothing to point at. The tea block goes into transition in 2027,
          the cupping room on the estate is not built yet, and there is no
          public chain to verify any of this against. What exists instead
          is a record.
        </p>
        <p>
          In August 2026 we cupped four of the Arabica lots to SCA
          protocol and they came back between 82.25 and 85.25 on our own
          table, every one scoring a perfect 10 on uniformity, clean cup
          and sweetness. The note against them says the ceiling right now
          is the roast, and the coffee underneath it has further to go.
        </p>
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

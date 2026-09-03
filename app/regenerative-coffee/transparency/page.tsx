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
    'Nine streams of data, every batch read before and after, the block re-read at ninety days, and one open experiment measured in public.',
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

      <Chapter>And here is what we are still proving.</Chapter>

      <Scene title="The solera, carried harvest to harvest.">
        <p>
          We carry a fraction of one fermenting batch forward into the
          next harvest’s cherry, the way a sherry bodega carries a barrel
          forward across decades. It is the longest-running experiment on
          the estate and the one we are most interested in.
        </p>
        <p>
          A coffee ferment runs in days where a solera runs in decades, so
          this is new ground and we are measuring it as such: every carry
          logged, every tank assayed, harvest against harvest. When the
          data is in we will publish what it shows.
        </p>
      </Scene>

      <Scene title="The record is the proof.">
        <p>
          In August 2026 we cupped four of the Arabica lots to SCA
          protocol. They came back between 82.25 and 85.25 — specialty
          grade starts at 80 — and every one of the four scored a perfect
          10 on uniformity, clean cup and sweetness.
        </p>
        <p>
          That score sits on top of a file: every preparation logged under
          the name of the person who made it, every batch assayed before
          it touched the ground, every block read again ninety days later.
          A certificate says a farm passed an audit on one day. This says
          what the ground did all year, and it is open to anyone who asks.
          The tea block enters transition in 2027 and will be held to the
          same file.
        </p>
      </Scene>

      <Closing>{`The record.
We practise organic and biodynamic, and we publish what the ground actually did.
Signed.
Timestamped.
Re-read at ninety days.
Ours to prove.`}</Closing>

      <NextBanners from="transparency" />

      <ReserveBanner />
    </>
  )
}

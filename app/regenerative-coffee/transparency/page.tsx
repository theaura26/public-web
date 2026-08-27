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

      <Panel
        hero
        align="centre"
        title="Sensors and hands, one record."
        lede="Machines take their own readings. People sign theirs. The record is both halves together."
      />

      <Scene>
        Everything on the last page is easy to claim and hard to check. This
        page is the checking.
      </Scene>

      <Scene title="One row, out of millions.">
        Somewhere in a file on this estate there is a row that reads: BD 501,
        Block 07, 06:14, waning moon, humidity 78%, by Raju, dung batch
        G-03.
      </Scene>

      <Scene>
        The minute. The moon. The hand. The source. That one row is the unit
        this whole system exists to protect.
      </Scene>

      <LoopDiagram
        centre={['Closed loop', 'regenerative', 'biodiversity', 'plantation']}
        caption="Observe, remember, learn, act — then observe what the acting changed. Sensors hold the parts no person can watch continuously; people hold the judgment no sensor has. The loop only closes because both are in it."
      />

      <Scene title="Nine streams, nine clocks.">
        Fermentation is read every fifteen minutes. Temperature three times
        a day. Brix at the start, the middle and the end. Soil chemistry
        quarterly, at 5 cm and at 20 cm. Earthworms counted by hand, inside
        a square of string.
      </Scene>

      <Scene>
        A machine writes its own numbers. A person signs theirs. Nobody enters
        a reading for work they did not do.
      </Scene>

      <Scene>
        A ledger cannot forget, and it cannot flatter.
      </Scene>

      <Scene title="No untested material touches the soil.">
        Every batch of preparation is read in our own lab before it goes out
        and again after it lands — pH, conductivity, colony counts,
        Trichoderma and Pseudomonas counted by name. A batch that comes back
        wrong is corrected, or it is held.
      </Scene>

      <Scene>
        Then the block is read again ninety days later, which is the part most
        people skip. Recording what was done is easy. Recording whether it
        worked is the harder half.
      </Scene>

      <Chapter>Here is what we cannot prove.</Chapter>

      <Scene>
        We carry a fraction of a fermenting batch forward into the next
        harvest’s cherry, the way a sherry bodega carries a barrel forward
        across decades. We think it builds continuity. We would like it to be
        true.
      </Scene>

      <Scene>
        Nobody has shown a coffee strain that survives that gap. A coffee
        ferment runs in days; a solera runs in decades. The metaphor is doing
        work the science has not done yet.
      </Scene>

      <Scene>
        So we are testing it, year on year, and we will publish it either way.
      </Scene>

      <Scene title="There is no certificate.">
        Nothing to point at. The tea block goes into
        transition in 2027, the cupping room on the estate is not built yet,
        and there is no public chain to verify any of this against.
      </Scene>

      <Scene title="What exists instead is a record.">
        In August 2026 we cupped four of the
        Arabica lots to SCA protocol. They came back between 82.25 and
        85.25 on our own table. Every one scored a perfect 10 on
        uniformity, clean cup and sweetness. The note against them says
        the ceiling right now is the roast, and the coffee underneath it
        has further to go.
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

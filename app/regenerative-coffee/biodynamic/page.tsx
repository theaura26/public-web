import type { Metadata } from 'next'
import {
  MicroNav, Panel, Scene, Chapter, Closing, NextBanners, ReserveBanner, ArrowLinkStyles,
} from '@/components/coffee/Microsite'

export const metadata: Metadata = {
  title: 'Better Ground — Regenerative Coffee',
  description:
    'About fifty cattle, 154,000 litres of Jeevamrit a year, and a canopy cut to a light reading instead of a feeling. Sampigekhan Estate, Mudigere.',
  alternates: { canonical: '/regenerative-coffee/biodynamic' },
}

/*
 * One story, told straight through. Each scene picks up the sentence the
 * last one put down — read end to end, it should hold without a single
 * picture. Imagery goes in later, underneath the words.
 */

export default function BiodynamicPage() {
  return (
    <>
      <MicroNav />
      <ArrowLinkStyles />

      <Panel
        hero
        align="centre"
        title="Grown in a closed loop."
        lede="Nothing comes in. Nothing leaves."
      />

      <Scene>
        Coffee does not begin with coffee. It begins with an animal, a metre
        of soil, and somebody awake before the light.
      </Scene>

      <Scene>
        A hundred and fifty acres at 3,600 feet, in the
        Western Ghats above Mudigere. Four storeys of shade — pepper and
        silver oak, then jackfruit, then coffee, then the ground. From the air
        it reads as forest. It happens to make coffee.
      </Scene>

      <Scene title="Our best farmers have four legs.">
        About fifty Malnad Gidda. Small, hardy, native to these hills, and
        grazing them for centuries before anybody thought to write it down.
      </Scene>

      <Scene>
        The herd is the whole fertiliser supply. Everything this soil is ever
        given comes out of them — which is why nothing has been sprayed on the
        grass they eat.
        What goes into the animal comes back out into the ground the coffee is
        standing in.
      </Scene>

      <Scene>
        So the day starts at twenty to six, in the dark, with a bucket. What
        they left overnight is gathered while it is still warm, weighed,
        written down, and split three ways — into the pits, into the brews,
        into the horns.
      </Scene>

      <Scene title="We do not buy fertility. We make it.">
        154,000 litres of Jeevamrit a year. Every barrel stirred by hand for
        forty-five minutes: build the vortex, break it, turn it back the other
        way. Forty-five minutes is a long time to stir anything. That is
        rather the point.
      </Scene>

      <Scene>
        Fourteen numbered pits, ninety days apiece. Horn manure buried through
        the cool months and put out at dusk. Quartz buried through the summer,
        misted over the canopy at first light. Yarrow, chamomile, nettle, oak
        bark, dandelion, valerian — in doses small enough to look like
        superstition, into a heap the size of a room.
      </Scene>

      <Scene>
        None of it arrives on a lorry.
      </Scene>

      <Chapter>Then we stopped guessing.</Chapter>

      <Scene>
        Shade on estates like this one has been read by eye for three hundred
        years. A contractor stands under a tree, decides it is too dark, and
        directs the cut. It works until it doesn’t, and a cut made on a
        feeling is still the wrong shape fifty years later.
      </Scene>

      <Scene>
        So in 2026 we took a lux meter into Block 3 and took fifty readings an
        acre. The block turned out to be three blocks. One read 33,000 lux
        with two-thirds of the light gone. One read 62,000. One read 82,000,
        wide open and far too bright.
      </Scene>

      <Scene>
        Arabica wants 50,000 to 70,000. One zone in three was where we had
        assumed all of it was.
      </Scene>

      <Scene>
        So we cut to the number instead of the feeling. Every wound dressed
        with dung and turmeric, every cut logged, and the whole block read
        again ninety days later to find out whether we had been right.
      </Scene>

      <Scene title="Nothing comes in. Nothing leaves.">
        Grass feeds the herd. The herd feeds the preparations. The
        preparations feed the soil. The soil grows the grass.
      </Scene>

      <Closing>{`Better ground.
It is slower than a sack of fertiliser, and a great deal more work. We think it makes better coffee. We are certain it makes better ground.
Closed.
Fed.
Measured.
Alive.`}</Closing>

      <NextBanners from="biodynamic" />

      <ReserveBanner />
    </>
  )
}

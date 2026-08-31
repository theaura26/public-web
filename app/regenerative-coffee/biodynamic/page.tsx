import { ChapterBackdrop } from '@/components/coffee/ChapterBackdrop'
import { BETTER_GROUND, STEPS } from '@/lib/regenerative-coffee-gallery'
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

      {/* One ground for the whole chapter, dissolving between the

          photographs as the scenes scroll over it. */}

      <ChapterBackdrop frames={BETTER_GROUND} steps={STEPS.biodynamic} />


      <Panel
        hero
        align="centre"
        title="Grown in a closed loop."
        lede="No fertiliser is bought in, and no waste is trucked out. The herd, the soil and the trees feed each other, and the estate’s job is to keep the loop turning."
      />

      <Scene>
        Coffee does not begin with coffee. It begins with an animal, a metre
        of soil, and somebody awake before the light. A hundred and fifty
        acres at 3,600 feet, in the Western Ghats above Mudigere, under four
        storeys of shade — pepper and silver oak, then jackfruit, then coffee,
        then the ground. From the air it reads as forest. It happens to make
        coffee.
      </Scene>

      <Scene title="Our best farmers have four legs.">
        About fifty Malnad Gidda. Small, hardy, native to these hills, and
        grazing them for centuries before anybody thought to write it down.
        The herd is also the whole fertiliser supply — everything this soil is
        ever given comes out of them, which is why nothing has been sprayed on
        the grass they eat. What goes into the animal comes back out into the
        ground the coffee is standing in.
      </Scene>

      <Scene title="The day starts at twenty to six, with a bucket.">
        What the herd left overnight is gathered while it is still warm,
        weighed, written down, and split three ways — into the compost pits,
        into the Jeevamrit brews, and into the horns for BD 500. It is the
        most valuable raw material on the estate, and it is collected by hand,
        every morning, before anything else happens.
      </Scene>

      <Scene title="We do not buy fertility. We make it.">
        154,000 litres of Jeevamrit a year. Every barrel stirred by hand for
        forty-five minutes: build the vortex, break it, turn it back the other
        way. Forty-five minutes is a long time to stir anything. That is
        rather the point.
      </Scene>

      <Scene title="Fourteen compost pits, ninety days apiece.">
        Horn manure is buried through the cool months and sprayed at dusk;
        ground quartz is buried through the summer and misted over the canopy
        at first light. Yarrow, chamomile, nettle, oak bark, dandelion and
        valerian go into a heap the size of a room, in doses small enough that
        a soil scientist would raise an eyebrow. All of it is made here. None
        of it arrives on a lorry.
      </Scene>

      <Chapter>Then we stopped guessing.</Chapter>

      <Scene title="Shade has been judged by eye here for three hundred years.">
        A contractor stands under a tree, decides it is too dark, and directs
        the cut. That works until it doesn’t, and a tree cut on a hunch is
        still the wrong shape fifty years later. So in 2026 we walked Block 3
        with a lux meter, fifty readings to the acre. The block turned out to
        be three blocks: one at 33,000 lux with two-thirds of the light gone,
        one at 62,000, one at 82,000 and wide open. Arabica wants 50,000 to
        70,000. One zone in three was where we had assumed the whole block
        was.
      </Scene>

      <Scene title="So we cut to the number instead.">
        Every wound was dressed with cow dung and turmeric, every cut was
        logged against the tree it came off, and the whole block was read
        again with the meter ninety days later to find out whether we had been
        right. Recording what you did is the easy half.
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

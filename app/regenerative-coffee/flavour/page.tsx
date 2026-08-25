import type { Metadata } from 'next'
import {
  MicroNav, Panel, Scene, Chapter, Closing, NextBanners, ReserveBanner, ArrowLinkStyles,
} from '@/components/coffee/Microsite'
import {
  LotCards, BlockExplorer, ARABICA_LOTS, ROBUSTA_LOTS,
} from '@/components/coffee/HarvestInteractive'

export const metadata: Metadata = {
  title: 'Flavours — Regenerative Coffee',
  description:
    'Nine lots from one harvest — three Robusta, six Arabica. The ferment, the lab that ends it, two national wins, and the full file behind every lot.',
  alternates: { canonical: '/regenerative-coffee/flavour' },
}

/*
 * The third pillar, and the working end of the site.
 *
 * Structure: coffee — the ferment, the lab, the award — then the two
 * varietals, Robusta first because it is the one that is open, Arabica
 * second because it is the one already committed. Prose carries the
 * craft; the cards carry the data. Nothing is said twice.
 */

export default function FlavourPage() {
  return (
    <>
      <MicroNav />
      <ArrowLinkStyles />

      <Panel
        hero
        align="centre"
        title="Nine lots. One harvest."
        lede="They come off the same trees on the same morning. What happens after that is decided in a shed, over about a week."
      />

      <Scene>
        Two pages of system — the loop, the ledger. This page is what all
        of it is for.
      </Scene>

      {/* ── the ferment ─────────────────────────────────────────── */}

      <Chapter>It is decided in the wet mill.</Chapter>

      <Scene title="Four decisions, over about a week.">
        Oxygen: sealed, or open. Time: twenty-four hours, or forty-eight.
        Mucilage: left on, partial, or washed away. Culture: the cherry’s
        own, or wild off a banana leaf, or carried forward from the last
        tank. Everything a lot becomes is settled by those four.
      </Scene>

      <Scene>
        Only fully ripe cherries are taken, and every floater is pulled out.
        Flavour is cultured after that — grown, in the dark, by things too
        small to see. Wild yeasts and lactic acid bacteria eat the mucilage
        while the pH falls, and the alcohols and acids they leave behind are
        what a taster later calls fruit.
      </Scene>

      {/* ── the lab ─────────────────────────────────────────────── */}

      <Chapter>The ferment ends on a number.</Chapter>

      <Scene title="Someone is awake for it.">
        The meter gets read every fifteen minutes, through the night.
        Temperature is written down three times a day, Brix at the start,
        the middle and the end. At pH 4.2 the tank comes off, whatever the
        shed smells like. That same reading is what a roaster gets handed
        months later.
      </Scene>

      <Scene>
        The data does not average across the harvest. It follows each lot
        as an individual, which is the only reason nine lots off one farm
        can be told apart at all.
      </Scene>

      {/* ── what specialty means here ───────────────────────────── */}

      <Chapter>Then somebody else scores it.</Chapter>

      <Scene title="August 2026, in front of a Q grader.">
        Four of the Arabica lots went in front of an
        independent Q grader under SCA protocol. They came back between
        82.25 and 85.25. Every one scored a perfect ten on uniformity,
        clean cup and sweetness. The grader’s note said the ceiling was
        the roast, and the coffee underneath it had further to go.
      </Scene>

      <Scene>
        Then the Robusta went to the Coffee Board of India’s Flavour of
        India Fine Cup Award, judged nationally against estates from five
        other states. Volcanic Wash and Appassimento Maceration both won
        their categories, and a second washed entry placed in the top four.
      </Scene>

      <Scene>
        Two independent panels, one finding: the ground is doing the work,
        and the ferment decides how much of it reaches the cup.
      </Scene>

      {/* ── Robusta — three lots, open ──────────────────────────── */}

      <Chapter>Robusta.</Chapter>

      <Scene title="Three lots. Two national wins.">
        Old Peridenia, a heritage varietal, grown at 3,600 feet
        under the same four-storey canopy as everything else here, picked
        at 97% ripeness. Brix comes in between 26% and 28%. No Arabica on
        this estate has ever read that high.
      </Scene>

      <Scene>
        Robusta does not usually get mornings like that. Grown on this
        ground, with this biology underneath it, it did.
      </Scene>

      <LotCards
        title="The three Robusta lots."
        intro="Available for allocation. Cold ferments, a three-day wash, and a bacterial culture we grew from our own wet cascara."
        lots={ROBUSTA_LOTS}
      />

      {/* ── Arabica — six lots, committed ───────────────────────── */}

      <Chapter>Arabica.</Chapter>

      <Scene title="Six lots from the same cherry.">
        Sln.9 and Sln.795 at 3,600 feet, under a canopy held between 65% and
        75%. Picked
        the same morning, from the same block, by the same hands — and
        then sent six different ways in the mill.
      </Scene>

      <Scene>
        The 2026 Arabica went, in full, to one specialty cafe in Mumbai.
        The complete file for every lot sits below, and the next harvest is
        the one to talk about.
      </Scene>

      <LotCards
        title="The six Arabica lots."
        intro="Separated lots, controlled oxygen, temperature logs, Brix and pH measured by hand — the complete file for each."
        lots={ARABICA_LOTS}
      />

      {/* ── the estate behind the lots ──────────────────────────── */}

      <Chapter>Every lot has a block behind it.</Chapter>

      <BlockExplorer />

      <Scene title="A block of their own.">
        The estate is open to roasters who want more than a purchase order.
        A roaster picks a block, sets the varietal focus, the processing
        method and the drying protocol, and the estate builds a lot that
        exists nowhere else. Every tree in it is tagged. Brix, pH, ripeness,
        soil moisture and shade cover are tracked at zone level, and the
        roaster reads the same numbers the estate does. Harvest decisions
        get made together, in the week they matter.
      </Scene>

      <Closing>{`The harder half.
Anyone who says the process alone makes the coffee is skipping the half that takes a decade. Come and taste both.
Soil.
Canopy.
Ferment.
Cup.`}</Closing>

      <NextBanners from="flavour" />

      <ReserveBanner />
    </>
  )
}

import { ChapterBackdrop } from '@/components/coffee/ChapterBackdrop'
import { FLAVOURS, STEPS } from '@/lib/regenerative-coffee-gallery'
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

      {/* One ground for the whole chapter, dissolving between the

          photographs as the scenes scroll over it. */}

      <ChapterBackdrop frames={FLAVOURS} steps={STEPS.flavour} />


      <Panel
        hero
        align="centre"
        title="Nine lots. One harvest."
        lede="Nine lots come off the same trees on the same morning. What separates them happens afterwards, in the wet mill, over about a week."
      />

      {/* ── the ferment ─────────────────────────────────────────── */}

      <Chapter>The wet mill decides it.</Chapter>

      <Scene title="Four decisions, over about a week.">
        Oxygen: sealed, or open. Time: twenty-four hours, or forty-eight.
        Mucilage: left on, partial, or washed away. Culture: the cherry’s own,
        or wild off a banana leaf, or carried forward from the last tank.
        Everything a lot becomes is settled by those four — and before any of
        them, by the picking, because only fully ripe cherries are taken and
        every floater is pulled out.
      </Scene>

      <Scene title="Wild yeasts do most of the work.">
        Yeasts and lactic acid bacteria eat the mucilage off the bean while
        the pH falls. The alcohols and acids they leave behind are what a
        taster later calls fruit. Nobody adds flavour to coffee here — they
        set the conditions and let the microbes get on with it.
      </Scene>

      {/* ── the lab ─────────────────────────────────────────────── */}

      <Chapter>The ferment ends on a number.</Chapter>

      <Scene title="The tank is read every fifteen minutes, all night.">
        A member of the mill team takes the pH by hand, on the quarter hour,
        for as long as the ferment runs — which is where the twenty-four and
        forty-eight hour lots stop being an abstraction and start being
        somebody’s night. Temperature goes down three times a day, Brix at the
        start, the middle and the end. At pH 4.2 the tank comes off, whatever
        the shed smells like. Those readings follow each lot as an individual
        rather than averaging across the harvest, which is the only reason
        nine lots off one farm can be told apart at all — and they are what a
        roaster is handed, months later, with the coffee.
      </Scene>

      {/* ── what specialty means here ───────────────────────────── */}

      <Chapter>Then somebody tastes it.</Chapter>

      <Scene title="Four lots scored between 82.25 and 85.25.">
        In August 2026 four of the Arabica lots were cupped to SCA protocol on
        the estate’s own table. Anything at 80 or above is specialty grade;
        every one of the four scored a perfect ten on uniformity, clean cup
        and sweetness. The grader’s note said the ceiling was the roast, which
        is a polite way of saying the coffee has further to go than the
        roasting has taken it.
      </Scene>

      <Scene title="Then a national panel scored it, blind.">
        The Robusta went to the Coffee Board of India’s Flavour of India Fine
        Cup Awards, judged nationally by people with no stake in the result.
        At the 2026 awards Aura Estate took first place in Robusta
        Experimental and second in Robusta Washed. Two tables, one of them
        ours and one of them not, agreeing about the same coffee.
      </Scene>

      {/* ── Robusta — three lots, open ──────────────────────────── */}

      <Chapter>Robusta.</Chapter>

      <Scene title="Three lots. Two national wins.">
        Old Peridenia, a heritage varietal, grown at 3,600 feet under the same
        four-storey canopy as everything else here, picked at 97% ripeness.
        Brix comes in between 26% and 28% — no Arabica on this estate has ever
        read that high. Robusta does not usually get mornings like that. Grown
        on this ground, with this biology underneath it, it did.
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
        75%. Picked the same morning, from the same block, by the same hands —
        and then sent six different ways in the mill. The 2026 Arabica went,
        in full, to one specialty cafe in Mumbai. The complete file for every
        lot sits below, and the next harvest is the one to talk about.
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

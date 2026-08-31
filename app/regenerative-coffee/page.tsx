import { ChapterBackdrop } from '@/components/coffee/ChapterBackdrop'
import { OVERVIEW, STEPS } from '@/lib/regenerative-coffee-gallery'
import {
  MicroNav, Panel, Scene, Chapter, Closing, NextBanners, ReserveBanner, ArrowLinkStyles,
} from '@/components/coffee/Microsite'
import { RemarkableCircle } from '@/components/coffee/RemarkableCircle'

/* ═══════════════════════════════════════════════════════════════════
   REGENERATIVE COFFEE — the hub. This is the Remarkable Loop.

   The question, the definition, then the loop itself: nine
   disciplines reading the same hundred and fifty acres, told as
   full-screen beats. Three statement cards break the run where the
   source deck breaks it, and the three most relevant paragraphs link
   straight into their pillar. Three banners hand off to the pillars,
   and the clay Festival banner closes, as it does on every page.

   Copy source: Homepage content.pdf (the Remarkable Loop deck).
═══════════════════════════════════════════════════════════════════ */

export default function RegenerativeCoffeePage() {
  return (
    <>
      <MicroNav />
      <ArrowLinkStyles />

      {/* 01 — The Remarkable Circle. Nine disciplines, always turning;
          click one and the page goes to it. */}
      <RemarkableCircle />

      {/* 02 — Manifesto */}
      {/* One ground for the whole chapter, dissolving between the
          photographs as the scenes scroll over it. */}
      <ChapterBackdrop frames={OVERVIEW} steps={STEPS.hub} />

      <Panel
        id="manifesto"
        title="Every season, this ground is worth more than it was."
        lede="The herd feeds the soil, the soil feeds the trees. Nothing is bought in and nothing is trucked away. Nine disciplines read the same hundred and fifty acres; the estate is where they overlap."
      />

      {/* ── The Remarkable Loop ─────────────────────────────────── */}

      <Chapter>What enters the mind shapes what the hands build.</Chapter>

      <Scene
        id="biodynamic"
        glyph="aura-biodynamic-glyph.svg"
        title="Biodynamic."
        href="/regenerative-coffee/biodynamic"
        cta="Better Ground"
      >
        It begins with dung — packed into a cow horn, buried through winter,
        exhumed in spring as horn manure, BD 500. Ground quartz buried
        through summer becomes BD 501. Yarrow, chamomile, nettle, oak bark,
        dandelion and valerian regulate the compost heap; horsetail guards
        the leaf through monsoon. None of it is applied at random — horn
        manure enters the ground at dusk, when the earth is said to be
        inhaling, and every prep buried, every batch tested, goes into the
        estate’s own log, under the name of the person who did it.
      </Scene>

      <Scene
        id="intelligence"
        glyph="aura-intelligence-glyph.svg"
        title="Aura intelligence."
        href="/regenerative-coffee/transparency"
        cta="Explore transparency"
      >
        Sensors, satellites, molecular analysis — the same technology used
        everywhere else in agriculture is used here too, but never in place
        of judgment. A soil test does not decide what the estate does next;
        it confirms what generations of practice already suspected. Every
        batch’s pH, conductivity and colony counts are logged, timestamped,
        traceable to the exact preparation and the day it was applied. The
        land remembers on its own terms. The data lets us prove it.
      </Scene>

      <Scene
        id="observation"
        glyph="aura-observation-glyph.svg"
        title="Tree-level observation."
      >
        A harvest starts months before anyone picks anything, by standing
        under the trees and looking up. How much light gets through four
        storeys of shade to the coffee. How the leaves are holding. When the
        flowers arrive, and what the soil is doing under the roots. Every tree
        reads slightly differently, and its light, flowering, ripening and
        condition go into the record that follows its cherries into the wet
        mill and eventually into the cup.
      </Scene>

      <Chapter>Attention is a moral choice.</Chapter>

      <Scene
        id="microbiome"
        glyph="aura-microbiome-glyph.svg"
        title="Microbiome."
        href="/regenerative-coffee/flavour"
        cta="Explore the flavours"
      >
        The herd’s gut has adapted to these grasses and this soil,
        generation after generation, and the estate’s reasoning is that
        the dung carries that adaptation into horn manure, CPP and
        Jeevamrit. That much is belief, held openly and acted on. What
        follows is measured: every batch is tested before it touches the ground,
        and cross-referenced against soil health for months after. The same
        intelligence carries into the wet mill, one ferment’s culture
        shaping the next, until the microbial signature of these hills
        settles into the cup.
      </Scene>

      <Scene id="hydrology" glyph="aura-hydrology-glyph.svg" title="Hydrology.">
        These hills take the Western Ghats monsoon in full, most days from
        June onward. The canopy breaks the force of the rain before it
        reaches soil, so it soaks in rather than running off and taking the
        topsoil with it; what the ground does not keep eventually reaches the
        Hemavathi, one of the rivers this range feeds. Not one tree here is
        irrigated. The coffee grows on rainfall alone, and drying follows
        whatever the air gives it, so each lot ends up on its own clock.
      </Scene>

      <Chapter>Every layer talks to every other layer.</Chapter>

      <Scene id="biodiversity" glyph="aura-biodiversity-glyph.svg" title="Biodiversity.">
        Bees move through all four layers of the canopy, and nothing they
        touch stays isolated — a flower here, a fruit set three trees over,
        a seed carried into next season’s undergrowth. Below ground,
        mycorrhizal networks do the same work in the dark, threading roots
        to roots. No organism here acts alone. Remove one species and the
        chain reacts — fewer pollinators, thinner shade, drier soil, a
        weaker cherry. Keep it intact and the opposite happens: bees feed
        the blossom, the herd feeds the soil, the soil feeds the canopy
        that shelters them all.
      </Scene>

      <Scene id="pathology" glyph="aura-pathology-glyph.svg" title="Plant pathology.">
        Coffee leaf rust and berry disease move fast across a monoculture:
        same clone, same canopy gap, same humidity trap, and one infected
        block takes the whole estate with it. A four-storey mixed canopy
        breaks that up. Airflow and shade vary from one block to the next, so
        a pathogen never finds the same conditions twice in a row, and an
        outbreak stays where it started. There are no synthetic fungicides
        here — the work is done by soil biology, moving air, and a great deal
        of compost.
      </Scene>

      <Chapter>Generational impact.</Chapter>

      <Scene id="vedic" glyph="aura-vedic-glyph.svg" title="Vedic farming.">
        This is knowledge older than the written word — passed hand to
        hand, farmer to farmer, for centuries before anyone thought to name
        it. Dung, urine, jaggery and gram flour, fermented into a soil
        drench known here as Jeevamrit. Seeds are still coated the old way,
        in dung, urine and lime, before they touch ground. None of it was
        invented here. It was remembered, kept, and handed down — carried
        by memory rather than manual, kept alive simply by staying in use.
      </Scene>

      <Scene id="soil" glyph="aura-soil-glyph.svg" title="Soil.">
        Nothing touches this ground untested. Every batch is read first —
        pH, electrical conductivity, microbial colony counts, Trichoderma
        and Pseudomonas viability, even a chromatogram pulled from filter
        paper to see the soil’s own vitality. Ninety days after every
        application, the results return — soil biology cross-referenced
        against what went in. A four-storey polyculture and decades of
        compost are building carbon the topsoil will hold for a hundred
        years: the land keeps what it is given. Right time, right action.
      </Scene>

      {/* The ring closes — the loop the hero draws, named. */}
      <Closing>{`One remarkable circle.
Nine disciplines reading the same hundred and fifty acres, and a loop that closes on itself every season.
Grass.
Herd.
Soil.
Canopy.`}</Closing>

      {/* ── The three pillars ───────────────────────────────────── */}

      <NextBanners from="hub" />

      {/* Persistent close — every page ends on the clay ask. */}
      <ReserveBanner />
    </>
  )
}

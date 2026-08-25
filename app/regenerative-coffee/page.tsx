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
      <Panel
        id="manifesto"
        title="Every season, this ground is worth more than it was."
        lede="The herd feeds the soil, the soil feeds the trees. Nothing is bought in, and nothing is trucked away."
      />

      {/* ── The Remarkable Loop ─────────────────────────────────── */}

      <Chapter>What enters the mind shapes what the hands build.</Chapter>

      <Scene title="The Remarkable Loop.">
        Nine ways of paying attention to the same hundred and fifty acres.
        Each one is a lens. The estate is where they overlap.
      </Scene>

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
        Before the cherry becomes coffee, we read the tree. A harvest does
        not begin with picking — it begins with observation, tree by tree,
        canopy by canopy: how much light reaches the coffee, how the leaves
        hold, when flowers arrive, what the soil is saying beneath the
        roots. Every tree tells a slightly different story, and its light,
        flowering, ripening and condition become part of the record that
        follows its cherries into the wet mill — and eventually into the
        cup.
      </Scene>

      <Chapter>Attention is a moral choice.</Chapter>

      <Scene
        id="microbiome"
        glyph="aura-microbiome-glyph.svg"
        title="Microbiome."
        href="/regenerative-coffee/flavour"
        cta="Explore the flavours"
      >
        The herd’s gut microbiome has adapted to these grasses and this
        soil, generation after generation. Their dung carries a microbial
        signature shaped by this breed, this land, this climate —
        inoculating horn manure, CPP and Jeevamrit with biology from
        nowhere else. Every batch is tested before it touches the ground,
        and cross-referenced against soil health for months after. The same
        intelligence carries into the wet mill, one ferment’s culture
        shaping the next, until the microbial signature of these hills
        settles into the cup.
      </Scene>

      <Scene id="hydrology" glyph="aura-hydrology-glyph.svg" title="Hydrology.">
        These hills take the Western Ghats monsoon in full, and none of it
        runs off unused. The four-storey canopy breaks the force of the
        rain before it reaches soil; what doesn’t sink into this ground
        eventually reaches the Hemavathi, one of the rivers this range
        feeds. Nothing here is irrigated. The coffee grows on rainfall
        alone, and the processing follows what the air gives it — each lot
        finding its own clock rather than a fixed one. Water decides more
        of this harvest than we do.
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
        Coffee leaf rust and berry disease move fast through a monoculture
        — same clone, same canopy gap, same humidity trap, and one infected
        block becomes the whole harvest. The four-storey canopy breaks that
        pattern here: airflow, shade variation and a mixed planting mean no
        single pathogen finds identical conditions twice. A plant grown in
        living soil resists disease the way a well-rested body resists
        illness. No synthetic fungicides — just soil biology, airflow, and
        a herd’s worth of compost doing the slower, harder work of
        prevention.
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

import {
  JournalHero,
  OneCol,
  TwoCol,
  Placeholder,
  DataGrid,
  DataCard,
  PullQuote,
  Continue,
  ScrollHighlight,
  Term,
} from '@/components/article/Article'

export default function LandPage() {
  return (
    <>
      <JournalHero
        currentHref="/land"
        title="The Land"
        caption="Sampigelkhan Estate, 3,600 ft — Western Ghats"
      />

      <TwoCol heading="Land is not an asset. It is ancestry.">
        <p className="p1">
          150 acres within a UNESCO biodiversity zone. 3,600 feet. Volcanic
          soil. Monsoon rhythm.
        </p>
        <p className="p2">
          The Sampigelkhan Estate sits at 13.1365°N, 75.6403°E — in the <Term tip="Mountain range along India's west coast. UNESCO biodiversity hotspot; over 7,000 plant species.">Western Ghats</Term> of Karnataka, at 3,600 feet above sea level.
        </p>
        <p className="p2">
          The soil is <Term tip="Red, iron-rich, free-draining volcanic soil typical of the Western Ghats.">laterite</Term>, red and volcanic, pH 6.0–6.5. Rainfall runs
          between 40 and 100 inches annually, arriving in monsoon sheets that
          reshape the ground and fill the streams. Temperature swings from
          14 °C before dawn to 30 °C at noon. Humidity holds at 58%.
        </p>
        <p className="p2">
          This is the land. Everything else follows from it.
        </p>
      </TwoCol>

      <TwoCol id="facts" heading="Sampigelkhan.">
        <DataGrid cols={3}>
          <DataCard value="13.1365°N, 75.6403°E">Coordinates.</DataCard>
          <DataCard value="3,600 ft">Altitude.</DataCard>
          <DataCard value="Laterite">Soil — red, volcanic, pH 6.0–6.5.</DataCard>
          <DataCard value="40–100 in / yr">
            Rainfall, monsoon-driven.
          </DataCard>
          <DataCard value="14 – 30 °C">Temperature range.</DataCard>
          <DataCard value="58%">Humidity.</DataCard>
          <DataCard value="UNESCO">Biodiversity zone.</DataCard>
          <DataCard value="150">Acres.</DataCard>
          <DataCard value="35,000">Trees.</DataCard>
        </DataGrid>
      </TwoCol>

      <Placeholder
        type="Looking up · canopy at noon"
        caption="Four-story canopy — Sampigelkhan Estate"
      />

      <TwoCol id="grows" heading="What grows here.">
        <p className="p1">
          One hundred acres of shade-grown coffee — Arabica <Term tip="Selection 9. Ethiopian-hybrid Arabica bred at the Central Coffee Research Institute, Karnataka. Floral, citric.">Sln.9</Term> and <Term tip="Selection 795. Kents × S.288 Arabica cross, released 1946. Vigorous; cocoa-malt body under shade.">Sln.795</Term>,
          planted beneath a four-story canopy of silver oak, Albizzia,
          jackfruit, and native fig. Thirty-five acres of tea, in organic
          transition targeting 2027.
        </p>
        <p className="p2">
          Black pepper climbing areca palms. Cardamom in the lower shade. Cacao,
          avocado, and cover crops on the forest floor. Beehives marking the
          flowering seasons. 35,000 individual trees across the estate.
        </p>
        <p className="p2">
          And 52 <Term tip="Indigenous Karnataka cattle breed adapted to the Western Ghats over centuries.">Malnad Gidda</Term> cattle — an indigenous breed native to this
          altitude, rotating through blocks timed to cherry development stages.
          Their dung drives the biodynamic programme. Their presence shapes the
          soil biology season by season.
        </p>
      </TwoCol>

      <PullQuote>
        The FOREST is not adjacent to the FARM. The FOREST is the FARM.
      </PullQuote>

      <TwoCol id="work" heading="How we work this land.">
        <p className="p1">
          The progression is deliberate, and it does not skip steps. There is
          no phase where we arrive and declare the work done. The land is
          always in transition. The question is whether the trajectory points
          toward regeneration or extraction. Ours points toward regeneration.
        </p>
        <DataGrid cols={3}>
          <DataCard value="01 — Stabilise and maintain.">
            Understand what the land is doing before changing anything.
          </DataCard>
          <DataCard value="02 — Discipline and observation.">
            Report what was done, where, why, what was observed.
          </DataCard>
          <DataCard value="03 — Organic transition.">
            Each block at its own pace, logged against the certification clock.
          </DataCard>
          <DataCard value="04 — Biodynamic maturation.">
            BD 500–508, CPP, Jeevamrit, Panchgavya, Beejamrit.
          </DataCard>
          <DataCard value="05 — Ecological products.">
            Output diversifies as the system deepens.
          </DataCard>
        </DataGrid>
      </TwoCol>

      <TwoCol id="east-east" heading="Mudigere and Ohara.">
        <p className="p1">
          Aura is not one estate. It is two. The second sits in Ohara, Kyoto —
          two properties totalling roughly 1,200 <Term tip="Japanese land measure. About 3.3 m² per tsubo.">tsubo</Term>, with seven existing
          buildings, a teahouse with a hearth, a thirty-year-old Japanese
          garden, and a cafe overlooking a river.
        </p>
        <p className="p2">
          Mudigere and Ohara form an East-East axis. Two agrarian cultures —
          Vedic and Zen — in dialogue. Neither apologises to a Western
          sustainability narrative. Both operate from <em>Ṛta</em>: right time,
          right action, natural order.
        </p>
      </TwoCol>

      <DataGrid cols={2} standalone>
        <DataCard type="Landscape · Mudigere monsoon canopy" value="Mudigere · Karnataka.">
          150 acres, 3,600 ft, laterite soil, UNESCO biodiversity zone. Four-
          story polyculture. 52 Malnad Gidda cattle. The agricultural engine.
        </DataCard>
        <DataCard type="Landscape · Ohara autumn maple" value="Ohara · Kyoto.">
          ~1,200 tsubo, 1,099 ft, 7 °C – 28 °C. Seven buildings. A
          thirty-year-old garden. A teahouse with a hearth. The sanctuary
          counterpart.
        </DataCard>
      </DataGrid>

      <TwoCol id="output" heading="What the land produces.">
        <p className="p1">
          Beyond coffee and pepper and tea: carbon. The four-story shade-grown
          polyculture sequesters an estimated three to five times more carbon
          per acre than monoculture coffee. With the biodynamic programme
          building soil carbon, the estimate rises to four to five times
          baseline.
        </p>
        <DataGrid cols={3}>
          <DataCard value="4–5×">Carbon vs monoculture coffee.</DataCard>
          <DataCard value="500–1,000 t">CO₂ credit potential per year.</DataCard>
          <DataCard value="100 acres">Shade-grown coffee.</DataCard>
          <DataCard value="35 acres">Tea, organic transition 2027.</DataCard>
          <DataCard value="35,000">Trees on chain over time.</DataCard>
        </DataGrid>
        <p className="p2">
          The land is not just a place that grows things. It is a carbon asset,
          a biodiversity corridor, a water system, a cultural record, and the
          primary dataset of everything Aura builds.
        </p>
      </TwoCol>

      <PullQuote>
        PROVENANCE is not a claim. It is the entire VALUE PROPOSITION.
      </PullQuote>

      <ScrollHighlight>
        {`Land is not an asset.
         Land is ancestry.
         I am the first gardener.
         I will not be the last.
         Provenance is evidence of relationship.`}
      </ScrollHighlight>

      <OneCol id="closing" heading="The unit of record is the land.">
        <p className="p1">
          We do not farm for yield. We farm for the next hundred years.
          Hornbills nest in the fig hollows. Macaques move through the canopy.
          Fig wasps pollinate the keystone trees. Civets feed on the pepper
          and the cherry.
        </p>
        <p className="p2">
          The forest is the farm.
        </p>
      </OneCol>

      <Continue currentHref="/land" />
    </>
  )
}

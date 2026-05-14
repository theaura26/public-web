import {
  ArticleHero,
  Section,
  TwoCol,
  P,
  Placeholder,
  DataGrid,
  DataCard,
  PullQuote,
  PullStat,
  Continue,
  Couplet,
  SideBySide,
  Rta,
} from '@/components/article/Article'

export default function FermentationPage() {
  return (
    <>
      <ArticleHero
        title="Three disciplines, one precision."
        subline="Coffee in barrels. Pepper in vats. Cow dung in horns. Three ferments, one posture — controlled microbial work with time, temperature, and pH as instruments. What wine learned in five centuries, coffee and cow dung are now being taught in five seasons."
        toc={[
          { q: 'What is the principle?', href: '#principle' },
          { q: 'How is coffee fermented?', href: '#coffee' },
          { q: 'How is pepper fermented?', href: '#pepper' },
          { q: 'Why is cow dung the oldest ferment?', href: '#cow-dung' },
          { q: 'How does Ohara connect?', href: '#ohara' },
        ]}
      />

      <Placeholder
        label="Hero — bubbling ferment surface"
        note="Macro shot of coffee cherry ferment, fine foam lifting and collapsing, amber light. Slow loop. 16:9."
      />

      {/* PRINCIPLE */}
      {/* eyebrow was: "The Principle" */}
      <TwoCol id="principle" heading="Microbes, given a room.">
        <P>
          Fermentation is not decay. Decay is uncontrolled. Fermentation is a microbial workshop
          with a door that closes — anaerobic, temperature-watched, pH-read. We treat the yeasts,
          lactobacilli and acetic strains as colleagues with precise requirements. A single degree
          at hour 36 is the difference between a lot that scores 83.5 and one that goes into the
          commodity heap.
        </P>
        <P>
          The same logic runs through all three disciplines on this estate. Coffee cherries in
          stainless steel. Pepper corns in retting vats. Cow dung in a horn under a field. Each is
          a controlled environment; each is read in hours, not days.
        </P>
      </TwoCol>

      <PullStat value="36" label="Hours to peak" sub="Anaerobic coffee ferment — the decision window" />

      {/* COFFEE FERMENTATION */}
      {/* eyebrow was: "Coffee" */}
      <Section id="coffee" heading="Six lots, six ferments.">
        <P>
          Mudigere's specialty programme separates the harvest into six lots, each fermented by a
          different technique borrowed from wine-making and then pulled back toward coffee's own
          grammar. The cherry arrives at the station inside six hours of picking, sorted by
          density float, and placed into its designated vessel. From that moment the ferment is on
          the clock.
        </P>

        <DataGrid cols={3}>
          <DataCard label="Lot 001 — Anaerobic Natural" value="72 hrs · 18 – 22°C">
            Whole cherry, sealed tank, CO₂ blanket. Long, slow, fruit-forward. The baseline lot
            against which all others are cupped.
          </DataCard>
          <DataCard label="Lot 002 — Appassimento" value="21 days dry · 36 hrs ferment">
            Wine-technique drying of the whole cherry on raised beds before ferment. Concentrates
            sugars and floral notes. Flagship: cupped at 83.5.
          </DataCard>
          <DataCard label="Lot 003 — Red Honey" value="60 hrs · 20 – 24°C">
            Pulped cherry retaining full mucilage, slow-dried on beds. Honeyed, stone-fruit. The
            middle path between natural and washed.
          </DataCard>
          <DataCard label="Lot 004 — Banana Wash" value="48 hrs · 22°C">
            Banana leaves layered into the ferment tank; plant-native yeasts seed the culture.
            Soft, round, unmistakably Mudigere.
          </DataCard>
          <DataCard label="Lot 005 — Solera Maceration" value="Carry-forward · mother + fresh">
            A Solera fractional system adapted from sherry. The mother ferment is never fully
            emptied. Each new lot carries forward 30 % of the previous cycle, compounding
            microbial complexity across seasons. Five passes per season.
          </DataCard>
          <DataCard label="Lot 006 — Solera Wash" value="Carry-forward · washed finish">
            The same Solera logic with a washed-process finish. Cleaner acidity, deeper backbone.
            The sibling lot to 005.
          </DataCard>
        </DataGrid>

        <P>
          Lot 005 is the deepest experiment on the estate. The Solera principle is simple in wine
          and revolutionary in coffee — you do not start from zero each harvest. You carry a
          fraction of the previous ferment forward as a living mother culture. Over seasons, the
          microbial community on this estate becomes a character of its own: a signature that
          belongs to this land and no other. This is appellation in microbial form.
        </P>
      </Section>

      <Placeholder
        label="Solera barrel cycle"
        note="A row of three steel tanks connected by transfer lines; chalk marks on each tank showing the carry-forward percentage."
        aspect="3 / 2"
      />

      {/* PEPPER FERMENTATION */}
      {/* eyebrow was: "Pepper" */}
      <Section id="pepper" heading="Water-retting and anaerobic trials.">
        <P>
          Pepper has its own ferment. For black pepper, the traditional practice is water-retting —
          fresh-picked corns submerged in clean water for 7 – 10 days, pectin softening, skin
          loosening, then sun-dried to the familiar wrinkled black. We keep that method because it
          works. But beside it we run an experimental anaerobic lot inspired by the coffee
          programme: CO₂-blanketed vats, temperature-watched, shorter cycle, different aromatic
          profile entirely.
        </P>

        <SideBySide
          leftTitle="Traditional — Water Retting"
          rightTitle="Experimental — Anaerobic"
          leftChildren={
            <>
              7 – 10 days submerged in clean running water. Natural microbial softening. Sun-dried on
              mats for three days. Classic Malabar flavour — pungent, bright, high piperine.
            </>
          }
          rightChildren={
            <>
              48 hours in a sealed tank under CO₂ at 22 – 24 °C. Yeast-driven rather than bacterial.
              Notes of cured fruit and cedar. In trial across two seasons.
            </>
          }
        />
      </Section>

      <Placeholder
        label="Pepper water-retting vat"
        note="Wooden vat with fresh green pepper corns submerged in still water, soft overhead light."
        aspect="4 / 5"
      />

      {/* COW DUNG FERMENTATION */}
      {/* eyebrow was: "Cow dung" */}
      <Section id="cow-dung" heading="The oldest ferment.">
        <P>
          The third discipline is the one that feeds the first two. BD 500 is cow dung fermented
          inside a cow's horn, buried in the earth from autumn equinox to spring equinox — six
          months in the dark, in the cold, under the frost line of the Ghats. The Cow Pat Pit is
          the same logic scaled: fresh dung layered with basalt dust and crushed eggshell, stirred
          with the six compost preparations inside, fermented ninety days.
        </P>
        <P>
          The microbiology is unmistakably familiar to a cupping bench. Lactobacilli. Acetic
          bacteria. Yeasts. The same organisms that transform a cherry into a cup also transform
          dung into the most active agricultural preparation we know. One discipline; three
          outputs.
        </P>
      </Section>

      <Placeholder
        label="BD 500 horn being opened"
        note="A gloved hand cracking a cured horn to reveal the dark, humus-like preparation inside. Macro, lamp-lit."
        aspect="4 / 5"
      />

      <PullQuote>
        Fermentation is patience made visible.
      </PullQuote>

      {/* OHARA CONNECTION */}
      {/* eyebrow was: "The Ohara Connection" */}
      <TwoCol id="ohara" heading="An 800-year lineage.">
        <P>
          Mudigere is one half of the fermentation practice. Ohara, our sister sanctuary outside
          Kyoto, is the other. The valley around Ohara carries an 800-year fermentation lineage —
          miso, shio-koji, umeboshi, pickled shiso. The purple shiso growing wild around our house
          there is endemic; it grows nowhere else in Japan with the same intensity.
        </P>
        <P>
          A food lab is planned inside the house. Two-week residencies will bring chefs and
          fermenters between the two sanctuaries — Mudigere's Jeevamrit meeting Ohara's shio-koji
          on the same bench. This is not fusion; it is two old traditions recognising each other
          at the microbial level.
        </P>
      </TwoCol>

      <Placeholder
        label="Purple shiso in Ohara"
        note="A wide bed of purple shiso at Ohara, morning dew. Tie-in frame for the food-lab story."
        aspect="16 / 9"
      />

      <PullStat value="800" label="Years of fermentation" sub="The lineage in the Ohara valley — carried forward by three generations of a gardener's family" />

      {/* RTA IN FERMENTATION */}
      {/* eyebrow was: "RTA in Fermentation" */}
      <Section heading="Timing is everything.">
        <P>
          Every ferment has a window. Open too early and the microbial work is not done. Open too
          late and acetic turn begins. The whole discipline across coffee, pepper and dung comes
          down to reading the hour when the organisms have finished their work and not one hour
          past. That hour is not a formula. It is a read — temperature, pH, smell, sound, the way
          the foam breaks. <Rta /> made physical, at the rim of a tank at 3 a.m.
        </P>
      </Section>

      <Couplet en="Observe first. Act second. Speak last." local="ನೋಡು. ಮಾಡು. ಆಮೇಲೆ ಮಾತಾಡು." localLang="kn" />

      <Placeholder
        label="Temperature probe in ferment"
        note="A digital probe lowered into an amber slurry, the display just legible. Tight frame, low light, 3 a.m."
        aspect="3 / 2"
      />

      <PullStat value="6" label="Coffee lots" sub="Each a separate ferment, each read on its own clock" />

      <Section heading="One posture, three outputs.">
      <P>
        Coffee, pepper, dung. Three vessels, three timers, one attention. Fermentation at Aura is
        not a production step. It is how the estate thinks — slowly, microbially, in the dark — and
        it is how the estate will eventually train a model that remembers what a good ferment
        smells like, hour by hour, season by season. Patience, made visible.
      </P>
      </Section>

      <Continue
        items={[
          {
            href: '/coffee',
            label: 'Coffee',
            description: 'Six lots, one appellation. Lot 005 Solera explained in full.',
          },
          {
            href: '/biodynamic',
            label: 'Biodynamic Practice',
            description: 'BD 500 and the Cow Pat Pit — the oldest ferments on the estate.',
          },
          {
            href: '/sanctuary',
            label: 'Ohara',
            description: 'Asa · Niwa. The 800-year fermentation valley outside Kyoto.',
          },
        ]}
      />
    </>
  )
}

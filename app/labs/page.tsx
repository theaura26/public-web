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
} from '@/components/article/Article'

export default function LabsPage() {
  return (
    <>
      <ArticleHero
        title="Earth up. Not top down."
        subline="A world model grown from our own soil. A workbench to run it. A canvas to break it. The Aura product OS is built the way the farm is built — ancestral knowledge first, tools on top."
        toc={[
          { q: 'What are the three value pillars?', href: '#pillars' },
          { q: 'What is the Product OS?', href: '#product-os' },
          { q: 'What runs underneath?', href: '#stack' },
          { q: 'What are the five verticals?', href: '#verticals' },
          { q: 'What is the constraint?', href: '#constraint' },
        ]}
      />

      <Placeholder
        label="Hero — sensor in the soil, close crop"
        note="A small probe half-buried in laterite. Roots visible. The tech almost invisible."
      />

      {/* PHILOSOPHY */}
      {/* eyebrow was: "Philosophy" */}
      <TwoCol heading="Not fine-tuning. Growing.">
        <P>
          Most AI arrives knowing everything about the digital world and nothing about your world.
          It has read the internet. It has not walked your land. A language model with an internet
          education is not the same thing as a world model trained on non-tuned cycles and forty
          years of agricultural intuition.
        </P>
        <P>
          We build the second kind. Grown from our own sensor data, our own shepherds&apos; logs,
          our own biodynamic calendar, our own fermentation curves. Native to one place before it
          is useful to any other. A system that knows, rather than a system that has read.
        </P>
      </TwoCol>

      <PullQuote attribution="Arvind">One has read, the other knows.</PullQuote>

      {/* THREE PILLARS */}
      {/* eyebrow was: "001" */}
      <Section id="pillars" heading="Three value pillars">
        <DataGrid cols={3}>
          <DataCard label="Earth Up" value="Base layer">
            Ancestral knowledge is the foundation, not the garnish. Every product decision starts
            at the soil and works up. Tech sits on top, never underneath.
          </DataCard>
          <DataCard label="Native Systems" value="Grown, not translated">
            Provenance and software grown from Aura&apos;s own data. Blockchain cherry-to-cup.
            Native systems cannot be translated. They are made for you and no one else.
          </DataCard>
          <DataCard label="Invisible Tech" value="Embedded">
            When you walk into the sanctuary, you don&apos;t feel tech. Sensors in the cherry, the
            hive, the ferment. Dashboards behind the kitchen, not in front of it.
          </DataCard>
        </DataGrid>
      </Section>

      {/* PRODUCT OS */}
      {/* eyebrow was: "002" */}
      <Section id="product-os" heading="The Product OS">
        <P>
          Three products, one operating system. Each assumes the next. None are sold as shrink-
          wrapped SaaS; each is delivered as an embedded residency with the client world.
        </P>

        <DataGrid cols={3}>
          <DataCard label="Compute" value="World model">
            A custom model grown from sensor data and human workflow &mdash; not fine-tuned on
            scraped text. The brain of the OS. Forty-eight months to first maturity.
          </DataCard>
          <DataCard label="Workbench" value="SaaS · CMS">
            The surface that runs the model for a given industry. Dashboards, workflow, alerts.
            Opinionated. One workbench per vertical.
          </DataCard>
          <DataCard label="Canvas" value="Playground">
            The experimental layer. Where new workflows are drafted before they become Workbench
            features. The first twenty-four months of every engagement live here.
          </DataCard>
        </DataGrid>

      </Section>

      <Placeholder
        label="Workbench UI mock"
        note="Monospace dashboard: lot, ferment curve, sensor array, alert pane. Dark-paper register."
      />

      {/* TECH STACK */}
      {/* eyebrow was: "003" */}
      <Section id="stack" heading="Three layers underneath">
        <P>
          The OS runs on three pieces of infrastructure we treat as non-negotiable. None of them
          are visible to a guest standing in the sanctuary.
        </P>

        <DataGrid cols={3}>
          <DataCard label="Blockchain" value="Provenance">
            Immutable, public, cherry-to-cup. Every lot, every ferment step, every field event on
            chain. The ledger that replaces the paper trail.
          </DataCard>
          <DataCard label="Live Sensors" value="Field-native">
            Soil moisture, leaf wetness, brix, pH, hive weight, ambient. Low power, long battery,
            mesh to a single gateway per block.
          </DataCard>
          <DataCard label="AI Memory" value="Persistent">
            The model does not forget between sessions. Every walk, every reading, every logged
            observation is remembered and referenced. A long memory is the whole point.
          </DataCard>
        </DataGrid>

      </Section>

      <Placeholder
        label="Data dashboard — soil &amp; hive"
        note="Three panels: moisture, weight, brix. Mono typography, muted greens."
      />

      {/* FIVE VERTICALS */}
      {/* eyebrow was: "004" */}
      <Section id="verticals" heading="Five verticals">
        <P>
          One OS, five client worlds. We start with the one we live in &mdash; agriculture
          &mdash; and extend to the ones that share its structure.
        </P>

        <DataGrid cols={3}>
          <DataCard label="Agroculture" value="Active">
            The home vertical. Coffee, pepper, areca, cattle. Workbench shipping on the estate.
            The reference deployment for every other vertical.
          </DataCard>
          <DataCard label="Food Sciences" value="In build">
            Fermentation curves, chef-table menus, lot-level flavour logs. Shared infrastructure
            with the Niwa food lab.
          </DataCard>
          <DataCard label="Hospitality" value="In build">
            Sanctuary operations &mdash; rhythm, occupancy, produce draw, guest journey. Invisible
            tech at the front, native system at the back.
          </DataCard>
          <DataCard label="Insurance" value="Forward-deployed">
            Loss adjustment and predictive analysis, satellite-driven, sensor-grounded. The
            vertical where a world model beats a language model most clearly.
          </DataCard>
          <DataCard label="Financial Services" value="Scoping">
            Cash-flow, lending, and risk modelling for small-holder and craft producers whose
            reality is invisible to ordinary credit models.
          </DataCard>
          <DataCard label="Horizon" value="2026–2036">
            The decade in which the real transformation takes place. We are four to six months
            ahead of everybody else, and we intend to stay there.
          </DataCard>
        </DataGrid>
      </Section>

      {/* BLOCKCHAIN */}
      {/* eyebrow was: "005" */}
      <Section heading="Blockchain cherry-to-cup">
        <P>
          Organic, biodynamic, and fair-trade certifications cost a small farm forty to fifty
          thousand dollars and roughly four years. They also travel badly: a paper badge cannot
          tell you <em>when</em> a lot was picked, <em>how</em> it was fermented, or <em>who</em>
          was in the shed. A blockchain ledger can.
        </P>
        <P>
          Every lot on the estate is written to chain at origin &mdash; cherry, ferment, drying,
          milling, cup. A buyer in Tokyo or Oslo can read the same record we read in the shed. No
          certifier, no middleman, no retroactive reconstruction. The log replaces the badge.
        </P>

      </Section>

      <Placeholder
        label="Blockchain transaction UI mock"
        note="Lot 005 timeline: pick → ferment → dry → mill → cup. Each step with hash + timestamp."
      />

      {/* CONSTRAINT */}
      {/* eyebrow was: "006" */}
      <Section id="constraint" heading="The constraint">
        <P>
          Technology at Aura has a ceiling, and we defend it. Tech must not override taste, field,
          or ecology. If a sensor improves the cup, it stays. If a dashboard distracts the cook,
          it goes. If a model recommends a practice the shepherd would not recommend, we trust the
          shepherd. Invisible tech. That is the future for us.
        </P>

      </Section>

      <PullQuote attribution="Arvind">
        When you walk into the sanctuary, you don&apos;t feel tech.
      </PullQuote>

      <PullStat value="5" label="verticals" sub="agri · food · hospitality · insurance · finance" />
      <PullStat value="3" label="products" sub="Compute · Workbench · Canvas" />
      <PullStat value="48" label="months" sub="to model maturity on soil use case" />

      <Continue
        items={[
          {
            href: '/plantation',
            label: 'Plantation',
            description: 'The 150 acres the world model is trained on.',
          },
          {
            href: '/rta',
            label: 'RTA',
            description: 'Right time, right action &mdash; the philosophical frame.',
          },
          {
            href: '/idea',
            label: 'The 1000 Year Idea',
            description: 'Why native systems, and why a long memory.',
          },
        ]}
      />
    </>
  )
}

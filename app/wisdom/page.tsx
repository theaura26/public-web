'use client'

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
  SideBySide,
  Continue,
  Rta,
} from '@/components/article/Article'

const LOST = [
  'Slowness',
  'Ritual',
  'Apprenticeship',
  'Seasonality',
  'Silence',
  'Mending',
  'Proximity',
  'Storytelling',
  'Foraging',
  'Fasting',
  'Sky-reading',
  'Handwriting',
  'Memorising',
  'Grieving together',
  'Sharpening a blade',
  'Lighting a fire',
  'Walking long distances',
  'Naming a bird',
  'Tasting water',
  'Sitting with strangers',
]

export default function WisdomPage() {
  return (
    <>
      <ArticleHero
        title="Moral Spine"
        subline="The sentence we return to when the spreadsheet disagrees with the soil. The line below which a project is redrawn — no matter how clever the case for crossing it."
        toc={[
          { q: 'What is the moral spine?', href: '#spine' },
          { q: 'What does the spine refuse?', href: '#refuse' },
          { q: 'Who is the tree servant?', href: '#tree-servant' },
          { q: 'What are the three intelligences?', href: '#intelligences' },
          { q: 'What are the six dimensions?', href: '#dimensions' },
          { q: 'What did we lose?', href: '#lost' },
          { q: 'How is wisdom held here?', href: '#practice' },
        ]}
      />

      <Section id="spine" heading="The Moral Spine">
        <P>
          A filter is only as good as the spine it rests on. Without a spine, any filter bends —
          to revenue, to deadline, to the most articulate person in the room. The spine is the
          sentence we keep returning to when the spreadsheet disagrees with the soil. Ecology
          before economics. Time before trend. Presence before performance.
        </P>
        <P>
          The spine is not a manifesto. It is a posture. It is what tells you to refuse a project
          whose numbers are excellent and whose ground is exhausted. It is what tells you to
          accept a project whose numbers are slow and whose ground is alive. The spine does not
          argue with the case. The case is real. The spine simply refuses to trade what cannot
          be put back.
        </P>
        <P>
          We do not invent the spine. We inherit it. From soil that took ten thousand years to
          build. From a herd whose lineage outlasts the state. From a method of observation
          older than the word data. Aura begins there — earth up, not algorithm down.
        </P>
      </Section>

      <Section id="refuse" heading="What the spine refuses">
        <P>
          The spine is easiest to describe by what it will not do. Each of these has been
          proposed at Aura, by someone serious, with a credible case. Each was declined because
          the spine would not bend.
        </P>
        <DataGrid cols={2}>
          <DataCard label="01" value="Yields the soil cannot regenerate.">
            Even at premium price. The soil is not a balance sheet. What is taken without return
            is taken from someone not yet born.
          </DataCard>
          <DataCard label="02" value="Growth the community cannot absorb.">
            More guests, more crops, more programmes. Capacity is not a number we set; it is a
            rhythm the place sets for us.
          </DataCard>
          <DataCard label="03" value="Optimisation of the lived.">
            A meal that becomes a menu item. A morning that becomes a programme. Some things
            are degraded the moment they are scaled.
          </DataCard>
          <DataCard label="04" value="Provenance that cannot be named.">
            Every input — supplier, substrate, line of code — answers a question by name. If it
            cannot be traced, it is not used.
          </DataCard>
          <DataCard label="05" value="Speed for its own sake.">
            A right decision at the wrong hour is still wrong. The spine is patient because the
            ground is patient, and the ground is right more often than we are.
          </DataCard>
          <DataCard label="06" value="Technology that erases the elder.">
            A tool that replaces the farmer&apos;s eye, the cook&apos;s hand, the gardener&apos;s
            judgement is not a tool here. We use machines to amplify lineage, not to displace it.
          </DataCard>
        </DataGrid>
      </Section>

      <Placeholder
        label="Image · hands folding cow dung into BD 500 horn"
        note="Suggested: close, warm tungsten light on hands packing dung into a cow horn. Shallow depth of field, earthy palette."
      />

      <Section id="tree-servant" heading="The Tree Servant">
        <P>
          In Thailand there is a man everyone calls Uncle Shung. He keeps a garden the way other
          people keep a decades-long correspondence. When asked what he does, he does not say
          gardener.
        </P>
      </Section>

      <PullQuote attribution="Uncle Shung">
        I&apos;m a tree servant. I&apos;m not a gardener. I observe the tree and the tree tells
        me what they want.
      </PullQuote>

      <Section>
        <P>
          That sentence is the method, and it is older than any school of agriculture. The
          tree-servant listens before acting. The tree-servant assumes the tree has something to
          say. Aura is built from a room full of tree-servants — the biodynamic agronomist who
          says &ldquo;I only want to heal the land,&rdquo; the third-generation Japanese gardener
          whose grandfather planted the garden his grandson now tends, the Buddhist nun in
          Kengkacha rescuing three hundred acres of condemned trees one transplant at a time.
        </P>
      </Section>

      <Section id="intelligences" heading="Three Intelligences">
        <P>
          We work with three kinds of intelligence. None is sufficient alone. None is senior to
          the others. They are arranged in the order they arrived, and in the order we consult
          them.
        </P>
        <SideBySide
          leftTitle="Natural Intelligence"
          rightTitle="Human Intelligence"
          leftChildren={
            <>
              3.8 billion years of field trials. Forest canopies, mycorrhizal networks, monsoon
              cycles, pollinator calendars. The system that built the conditions for us to
              exist. It does not need our permission, and rarely our help. It needs our
              attention.
            </>
          }
          rightChildren={
            <>
              The accumulated craft of those who lived with natural intelligence and learned to
              listen. Vrikshayurveda. Biodynamics. Ryokan hospitality. Malnad agroforestry. The
              grammar of ritual, apprenticeship, and long stewardship — culture as a form of
              ecological memory.
            </>
          }
        />
      </Section>

      {/* eyebrow was: "The third layer" */}
      <Section heading="Machine Intelligence">
        <P>
          Machine intelligence is the most recent arrival. At Aura it sits last, not first. It
          is given the smallest, sharpest jobs — transcribing soil, translating sensor readings,
          remembering what the grandmother said so her grandchildren can hear it in their own
          tongue.
        </P>
        <P>
          Used this way, computation is a scribe for ancient wisdom, not a replacement for it.
          It does not decide when to irrigate. It surfaces the pattern so the farmer can decide.
          The technology stays invisible. The intelligence it amplifies is the one that has been
          here all along.
        </P>
      </Section>

      <PullQuote>
        The earth does not need us to manage it. It needs us to remember what it already knows.
      </PullQuote>

      <Section heading="One has read. The other knows.">
        <P>
          A language model has read everything and lived nothing. A world model — a model grown
          from sensor readings, from forty years of a farmer&apos;s eye, from the rhythm of
          monsoon and leaf — has lived.
        </P>
        <P>
          That is the reason Aura begins with ancient wisdom and ends with artificial
          intelligence, rather than the other way round. A generic model arrives knowing
          everything about the digital world and nothing about your world. Native systems —
          grown from the land — cannot be translated from somewhere else. They are made for
          this soil and no one else&apos;s. This is not fine-tuning. This is growing.
        </P>
      </Section>

      <PullQuote attribution="Arvind">
        One has read, the other knows.
      </PullQuote>

      <Section id="dimensions" heading="Six Dimensions">
        <P>
          When we say wisdom we mean something we can practice, not something we merely admire.
          Six dimensions make it operable. They are the capacities Aura cultivates — in the
          land, in the team, in the residents, and in the work.
        </P>
        <DataGrid cols={3}>
          <DataCard label="01" value="Pattern Recognition">
            Seeing what repeats across seasons, species, and systems. The farmer's eye; the
            taster's palate; the scholar's ear.
          </DataCard>
          <DataCard label="02" value="Systems Thinking">
            No variable in isolation. Soil, canopy, herd, household, market — moved as one
            organism, not as a stack of departments.
          </DataCard>
          <DataCard label="03" value="Moral Filter">
            The question before the question: should this be done at all? The oldest form of
            intelligence, and the first to erode under speed.
          </DataCard>
          <DataCard label="04" value="Taste">
            The capacity to distinguish better from more. Trained slowly. Not a luxury — a
            load-bearing skill for a thousand-year project.
          </DataCard>
          <DataCard label="05" value="Capital Intelligence">
            Knowing what money is for, and what it is not for. Patient capital, deployed where
            it compounds into soil, craft, and people.
          </DataCard>
          <DataCard label="06" value="Long-Horizon">
            The ability to hold a decision for decades. To plant a tree, tend it, and never
            harvest it. To build for a reader not yet born.
          </DataCard>
        </DataGrid>
      </Section>

      <PullStat value="3.8bn" label="Years of natural intelligence" sub="The substrate. Not a metaphor." />

      <Section heading="Seven Generations">
        <P>
          The principle is older than any one culture and appears in many of them. A decision is
          made with the seventh generation in mind — roughly two hundred years — long enough
          that the decision-maker is no longer in the room when its consequences land.
        </P>
        <P>
          At Aura the principle sits inside every plantation choice, every building choice,
          every hire. If the seventh generation would be poorer for the decision — in soil, in
          skill, in beauty — the decision is redrawn. This is not sentiment. It is how living
          systems keep living.
        </P>
      </Section>

      <Placeholder
        label="Image · old tamarind or banyan at plantation edge"
        note="Suggested: a large old tree with long shadow at golden hour; sense of scale and time. Vertical or 3:2."
      />

      <Section id="lost" heading="The 100 Things We Lost">
        <P>
          Progress has a shadow ledger. For every capability we have gained there are smaller,
          older ones that quietly left. We do not romanticise them; we list them. Some we are
          trying to bring back, at the plantation, in the kitchen, in the residency, in the
          silence of a room with nothing in it.
        </P>
        <P>
          A partial list follows — twenty of a hundred. The full ledger is kept as a working
          document and added to as the team, the residents, and the elders of Mudigere and
          Ōhara keep finding more.
        </P>
        <DataGrid cols={4}>
          {LOST.map((item, i) => (
            <DataCard key={item} label={String(i + 1).padStart(2, '0')} value={item} />
          ))}
        </DataGrid>
        <P>
          None of these are nostalgic. Each is a capacity with a job. Mending lengthens the life
          of cloth. Silence lengthens the life of attention. Apprenticeship lengthens the life
          of a craft. A thousand-year project needs all of them back, in working order.
        </P>
        <P>
          The list is not a eulogy. It is a syllabus. The residency teaches mending. The kitchen
          teaches fasting. The plantation teaches sky-reading, the hard way, in a season where
          the monsoon is late. Each recovered capacity is a piece of <Rta /> — right time, right
          action — returned to working order.
        </P>
      </Section>

      <PullQuote>
        We were a hunting race. Nobody knows how to hunt anymore.
      </PullQuote>

      {/* eyebrow was: "In practice" */}
      <TwoCol id="practice" heading="How wisdom is held here.">
        <P>
          In Mudigere, ancient wisdom is soil — Jeevamrit, Panchgavya, Beejamrit, the Six Rules
          of the field shed, the quiet authority of the Malnad Gidda cow. In Ōhara, it is
          season — the festival calendar, the rhythm of Asa and Niwa, the discipline of a
          Japanese garden in its five-hundredth year.
        </P>
        <P>
          The residency holds it as apprenticeship. The labs hold it as data. The kitchen holds
          it as menu. The festivals hold it as memory. No single page contains it. The place
          does.
        </P>
      </TwoCol>

      <Continue
        items={[
          {
            href: '/rta',
            label: 'RTA',
            description: 'Right time, right action. Wisdom made operable.',
          },
          {
            href: '/biodynamic',
            label: 'Biodynamic',
            description: 'BD 500 to 508. Wisdom in the soil.',
          },
          {
            href: '/idea',
            label: 'The 1000 Year Idea',
            description: 'The standard every choice is measured by.',
          },
        ]}
      />
    </>
  )
}

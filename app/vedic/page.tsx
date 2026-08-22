import {
  HeroBanner,
  TwoCol,
  OneCol,
  Placeholder,
  DataGrid,
  DataCard,
  PullQuote,
  ScrollHighlight,
  Continue,
  Term,
} from '@/components/article/Article'

export default function VedicPage() {
  return (
    <>
      <HeroBanner
        currentHref="/vedic"
        title="Vedic Farming"
        type="Detail · vedic farming"
        caption="Aura farms Mudigere on Vrikshayurveda, the ancestral science of trees — an old body of soil knowledge, paired with modern measurement, on ground that compounds over generations."
        alt="Aura Vedic farming — ancestral agricultural science in practice"
      />

      <TwoCol id="intelligence" heading="One intelligence, two languages.">
        <p className="p1">
          At Mudigere Aura farms on{' '}
          <Term tip="Sanskrit: vṛkṣa (tree) + āyurveda (science of life). An ancestral Indian body of plant and soil knowledge, carried for most of its life by oral tradition.">Vrikshayurveda</Term>,
          the Ayurveda of trees — a body of agricultural knowledge older than the chemistry most
          farms run on. Alongside it the estate runs European biodynamics, a set of numbered
          preparations codified about a century ago. Two languages describing one intelligence: feed
          the life in the soil, and the soil feeds the plant.
        </p>
        <p className="p1">
          Industrial agronomy asks what the plant lacks, then adds it. The older traditions ask what
          the soil is and what it is already doing. Everything Aura does with this ground follows
          from starting with the second question.
        </p>
      </TwoCol>

      <PullQuote>
        I am a tree servant.
      </PullQuote>

      <TwoCol id="read" heading="Read the plant before you treat it.">
        <p className="p1">
          The Vrikshayurveda is a way of looking, not a book of recipes. It reads a plant the way its
          sibling text reads a body — as a being with digestion, seasons, and specific weaknesses —
          and its first instruction never changes: read the plant before you treat it. A leaf that
          yellows from the tip is one diagnosis; from the edge, another. Treat the diagnosis, not the
          symptom.
        </p>
        <p className="p1">
          Industrial agriculture inherited the{' '}
          <Term tip="Nitrogen, phosphorus, potassium — the three macronutrients isolated by nineteenth-century agricultural chemistry. Not wrong. Narrow.">NPK</Term>{' '}
          rulebook from nineteenth-century chemistry. It is not wrong; it is narrow — three letters
          cannot describe a forest floor. To be a tree servant is the older posture: observe the
          tree, let it show what it wants, and act on the land&apos;s permission rather than the
          calendar&apos;s. Observation comes first, sometimes by a whole season.
        </p>
      </TwoCol>

      <ScrollHighlight>
        {`Read the plant.
         Then read the soil.
         Then, maybe, intervene.`}
      </ScrollHighlight>

      <TwoCol id="herd" heading="It begins with the herd.">
        <p className="p1">
          Every preparation on the estate begins in the same place — the cattle. Aura keeps
          fifty-two{' '}
          <Term tip="A small indigenous cattle breed of the Malnad region of Karnataka, adapted to this altitude, soil, and monsoon over centuries. Low-yield, hardy, low-input.">Malnad Gidda</Term>,
          the small indigenous cattle of these hills. The five products of the cow — dung, urine,
          milk, curd, ghee — are the base of every ferment, and their dung and urine are the raw
          material of the soil work. The herd is not livestock kept beside the farm; it is the engine
          inside it.
        </p>
        <p className="p1">
          You cannot make these preparations with an imported breed, and you cannot buy them. The
          herd is rotated through the blocks on a rhythm timed to how the coffee cherry is
          developing, and the ground it grazes is the ground the coffee roots into. The herd builds
          the soil; this journal is what its dung becomes.
        </p>
      </TwoCol>

      <Placeholder
        type="Portrait · herd"
        caption="Malnad Gidda under coffee shade — the indigenous cattle every preparation begins with"
      />

      <TwoCol id="ferment" heading="What the dung becomes.">
        <p className="p1">
          <Term tip="जीवामृत — 'life nectar.' A live microbial inoculant of cow dung, cow urine, jaggery, pulse flour, and a handful of undisturbed soil.">Jeevamrit</Term> sounds
          like folklore until you read the ingredients as a microbiologist would. Dung for the
          microbial load, urine for the nitrogen, jaggery to feed the culture, pulse flour for
          protein, and a handful of soil from an undisturbed patch — to seed the batch with whatever
          is already thriving nearby. It is a live culture, brewed to its peak and drenched onto the
          block within a day, before the population crests and falls.
        </p>
        <p className="p1">
          The Vedic ferments and the biodynamic preparations share the same shelf and the same
          handful of materials — the cow, the compost heap, a few wild herbs. The Vrikshayurveda
          prescribes the brewing window in the language of auspicious timing; a lab would call it
          holding a culture at peak viable count. Two vocabularies, one fermentation curve.
        </p>
      </TwoCol>

      <Placeholder
        type="Detail · preparation"
        caption="Jeevamrit fermenting in a clay pot — dung, urine, jaggery, pulse flour, and a handful of undisturbed soil"
      />

      <TwoCol id="measure" heading="Nothing reaches the soil unproven.">
        <p className="p1">
          Faith is not the method; measurement is. Every batch is tested before it touches a block —
          pH, electrical conductivity, and a live microbial colony count. Compost is read for
          maturity by temperature, moisture, and smell. A batch of dung is traced back to the animals
          that gave it, and the soil is re-read ninety days after an application — to see whether what
          looked right in the pot did anything in the ground.
        </p>
        <p className="p1">
          This is what Aura means by Natural Intelligence: the oldest knowledge we have, held to the
          newest measurement we trust. What the Vrikshayurveda called the land&apos;s breath, and what
          the moon-timed preparations called the right hour, the estate now also writes down as a
          signed event — the lunar day and the stir time logged beside the humidity and the hand that
          did the work. The oldest instrument and the newest, agreeing.
        </p>
      </TwoCol>

      <DataGrid cols={3} standalone>
        <DataCard value="Every batch">
          pH, electrical conductivity, and a live colony count before a drop is sprayed.
        </DataCard>
        <DataCard value="90 days">
          The soil re-read after application — proof that the thing worked in the ground, not the pot.
        </DataCard>
        <DataCard value="Signed">
          Each spray logged: the block, the lunar day, the humidity, the dung batch, the hand that
          did it.
        </DataCard>
      </DataGrid>

      <OneCol heading="Older than the study of it.">
        <p className="p1">
          The estate keeps every observation, every block it was applied to, and every microbial read
          that followed. Over seasons that becomes something rare — a record of one valley&apos;s own
          soil, grown from the ground rather than borrowed from a textbook written for another. A
          different valley would need a different record. That is not a flaw; it is the point.
        </p>
        <p className="p1">
          This is a generational instrument. The knowledge is old and the measurement is ours, and
          together they build the estate&apos;s most durable asset: living soil, on a horizon measured
          in decades. Where the practice becomes a ledger, this journal hands off to{' '}
          <em>Provenance</em>.
        </p>
      </OneCol>

      <Continue currentHref="/vedic" />
    </>
  )
}

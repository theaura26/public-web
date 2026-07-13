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
        title="Older than its study."
        type="Detail · ferment"
        caption="Two soil traditions, one intelligence — Vedic and biodynamic, run side by side at Mudigere"
        alt="Aura Vedic farming — ancestral agricultural science in practice"
      />

      <TwoCol id="ladder" heading="The ladder it never stood on.">
        <p className="p1">
          Modern farming arranges itself as a ladder. Heavy chemical at the base, low-input as the
          apology, no-spray as the aspiration, organic as the badge, biodynamic as the discipline at
          the top. The ladder is useful. It is also incomplete — because the oldest system on this
          estate does not stand on it at all. It predates the frame.
        </p>
        <p className="p2">
          At Mudigere we run two traditions at once. European biodynamics — a set of numbered
          preparations codified about a century ago — and{' '}
          <Term tip="Sanskrit: vṛkṣa (tree) + āyurveda (science of life). The surviving text is usually dated to the medieval period, though the oral tradition it draws on is older.">Vrikshayurveda</Term>,
          the Ayurveda of trees, far older than its European cousin and carried by mouth for most of
          its life. We do not treat them as rivals. They are two languages describing one
          intelligence: feed the life in the soil, and the soil will feed the plant.
        </p>
        <p className="p2">
          Neither asks the question industrial agronomy asks first — <em>what does the plant
          lack?</em> Both ask an older one — <em>what is the soil, and what is it already doing?</em>{' '}
          Everything on this page follows from which question you start with.
        </p>
      </TwoCol>

      <PullQuote attribution="Uncle Shung, Thailand">
        I am a tree servant.
      </PullQuote>

      <TwoCol id="posture" heading="Read the body before you treat it.">
        <p className="p1">
          The Vrikshayurveda is not a manual of recipes. It is a way of looking. It reads a plant the
          way its sibling text reads a human body — as a being with digestion, seasons, and specific
          susceptibilities — and its first instruction never changes: read the plant before you treat
          it. A leaf that yellows from the tip is one diagnosis; from the edge, another; from the
          centre, a third. Treat the diagnosis, not the symptom.
        </p>
        <p className="p2">
          Industrial agriculture inherited the <Term tip="Nitrogen, phosphorus, potassium — the three macronutrients isolated by 19th-century agricultural chemistry. Not wrong. Narrow.">NPK</Term> rulebook
          from nineteenth-century chemistry. It is not wrong; it is narrow. Three letters cannot
          describe a forest floor. The Vedic posture is wider — feed the microbe, feed the fungus,
          feed the soil&apos;s own memory, and let the plant feed itself.
        </p>
        <p className="p2">
          An uncle in Thailand called himself a tree servant. Not a gardener — a servant. He said he
          did not so much plant trees as observe them, and the tree told him what it wanted. That
          sentence is the whole method. Observation precedes action by weeks, sometimes a season.
          Action follows the land&apos;s permission, not the calendar&apos;s.
        </p>
      </TwoCol>

      <ScrollHighlight>
        {`Read the plant.
         Then read the soil.
         Then, maybe, intervene.`}
      </ScrollHighlight>

      <TwoCol id="cattle" heading="Everything begins with the cattle.">
        <p className="p1">
          Not the seed, not the spray — the herd. <strong>Fifty-two</strong>{' '}
          <Term tip="An indigenous dwarf cattle breed of the Malnad region of Karnataka, adapted to this altitude, soil, and monsoon over centuries. Small-bodied, low-yield, hardy.">Malnad Gidda</Term> —
          the small indigenous cattle of these hills, bred by the climate itself over centuries. Not
          Holsteins. Not Jersey crosses. The breed matters because the biology does: their dung and
          urine are the raw material every preparation on the estate is built from.
        </p>
        <p className="p2">
          The five products of the cow — dung, urine, milk, curd, ghee — are the entire base pharmacy.
          The herd is not livestock kept beside the farm; it is the engine inside it, rotated through
          the blocks on a rhythm timed to how the coffee cherry is developing. You cannot buy Aura&apos;s
          preparations, and you cannot make them with an imported breed. The engine is native, or it
          is not the engine.
        </p>
        <DataGrid cols={4}>
          <DataCard value="52">Malnad Gidda — indigenous, dwarf, hardy. The heart of the soil system.</DataCard>
          <DataCard value="5 products">Dung, urine, milk, curd, ghee — the base of every preparation.</DataCard>
          <DataCard value="Timed">Herd rotation set to coffee-cherry development, not the calendar.</DataCard>
          <DataCard value="Native">Not replicable with imported cattle. The breed is the method.</DataCard>
        </DataGrid>
      </TwoCol>

      <Placeholder
        type="Portrait · herd"
        caption="Malnad Gidda under coffee shade — the small indigenous cattle every preparation begins with"
      />

      <Placeholder
        type="Detail · the five products"
        caption="Dung, urine, milk, curd, ghee — the estate's base pharmacy, laid out"
      />

      <TwoCol id="preparations" heading="The preparations, both alphabets.">
        <p className="p1">
          Two vocabularies share the same shelf. The numbered biodynamic preparations, BD 500 through
          508, and the Vedic ferments the region has brewed for generations. They are made from the
          same handful of things — the cow, the compost heap, a few wild herbs — and applied on a
          calendar most agronomists would not recognise. The estate runs both, and logs each one.
        </p>
        <DataGrid cols={3}>
          <DataCard value="BD 500 · 501">
            Horn manure and horn silica — dung and ground quartz packed into cow horns, buried a
            season, then stirred into water for an hour and sprayed. One feeds soil biology; the
            other, the plant&apos;s reach for light.
          </DataCard>
          <DataCard value="BD 502–507">
            The compost set — yarrow, chamomile, stinging nettle, oak bark, dandelion, valerian.
            Six herbs that steer how a heap breaks down. Tiny doses; a large effect on the pile.
          </DataCard>
          <DataCard value="BD 508">
            Horsetail — a silica-rich decoction against fungal pressure. In a monsoon that delivers up
            to a hundred inches a year, this is the preparation the Ghats ask for most.
          </DataCard>
          <DataCard value="Jeevamrit">
            Dung, urine, jaggery, pulse flour, and a handful of undisturbed soil — a microbial
            inoculant brewed live and drenched into the root zone.
          </DataCard>
          <DataCard value="Beejamrit">
            Dung, urine, lime — a seed dressing. The first thing a seed meets before it meets the
            ground.
          </DataCard>
          <DataCard value="Panchagavya">
            The five cow products fermented together — a foliar tonic and soil amendment in one.
          </DataCard>
        </DataGrid>
      </TwoCol>

      <TwoCol id="jeevamrit" heading="One preparation, read twice.">
        <p className="p1">
          <Term tip="जीवामृत — 'life nectar.' A live microbial inoculant of cow dung, cow urine, jaggery, pulse flour, and a handful of undisturbed soil.">Jeevamrit</Term> sounds
          like folklore until you read the ingredient list as a microbiologist would. Dung for the
          microbial load. Urine for the nitrogen. Jaggery to feed the culture. Pulse flour for
          protein. And a handful of soil from an undisturbed patch — to seed the whole batch with
          whatever is already thriving next door.
        </p>
        <p className="p2">
          It is brewed until the culture peaks — two or three days in the warm months, up to a week
          when the air is cool — stirred to keep it breathing, and drenched onto the block within a
          day, before the population crests and falls. The Vrikshayurveda prescribes that window in
          the language of auspicious timing. A lab would call it holding a culture at peak viable
          count. Two vocabularies, one fermentation curve.
        </p>
      </TwoCol>

      <PullQuote attribution="ಗಿಡಕ್ಕಲ್ಲ, ಸೂಕ್ಷ್ಮಜೀವಿಗೆ ಉಣಿಸು.">
        Feed the microbe, not the plant.
      </PullQuote>

      <TwoCol id="testing" heading="Nothing reaches the soil unproven.">
        <p className="p1">
          Faith is not the method; measurement is. Every batch is tested before it touches a block —
          pH, electrical conductivity, and a live microbial colony count. Compost is read for
          maturity by temperature, carbon-to-nitrogen ratio, and moisture. The two organisms the
          estate most wants to see — <Term tip="A beneficial soil fungus used as a biocontrol agent and root symbiont.">Trichoderma</Term> and{' '}
          <Term tip="A beneficial soil bacterium that helps suppress pathogens and free nutrients for the plant.">Pseudomonas</Term> —
          are counted for viability, not assumed.
        </p>
        <p className="p2">
          Three spray teams work the estate, and every monthly schedule carries three buffer days for
          the weather to break a plan the moon set. A batch of dung is traced back to the individual
          animals that gave it. The soil is re-read ninety days after an application — to see whether
          the thing that looked right in the pot actually did anything in the ground.
        </p>
        <DataGrid cols={4}>
          <DataCard value="Every batch">pH, EC, and a live colony count before a drop is sprayed.</DataCard>
          <DataCard value="3 teams">Dedicated spray crews, each block on a known rotation.</DataCard>
          <DataCard value="3 buffer days">Built into every monthly plan — the weather outranks the calendar.</DataCard>
          <DataCard value="90 days">The soil re-read after application. Proof, not faith.</DataCard>
        </DataGrid>
      </TwoCol>

      <Placeholder
        type="Detail · preparation"
        caption="Jeevamrit fermenting in a clay pot — dung, urine, jaggery, pulse flour, and a handful of undisturbed soil"
      />

      <Placeholder
        type="Detail · the log"
        caption="A spray record — block, lunar day, humidity, the worker who sprayed it, the dung batch it came from"
      />

      <TwoCol id="mycorrhizal" heading="The network the tradition already named.">
        <p className="p1">
          Under every healthy coffee tree on this estate is a{' '}
          <Term tip="From the Greek mykes (fungus) + rhiza (root) — literally 'fungus-root.' A symbiosis between fungal threads and plant roots.">mycorrhizal</Term> network —
          a fungal lattice threaded through the roots, trading water and phosphorus for the sugars the
          tree makes in the leaf. Tilling severs it. The Vedic preparations feed it. The drench is, in
          plain terms, a meal for the fungus; the neem cake is a note to the network, not a weapon
          against it.
        </p>
        <p className="p2">
          The Vrikshayurveda described something like this in a different language — the land&apos;s
          &ldquo;breath,&rdquo; soil that &ldquo;converses,&rdquo; trees that &ldquo;remember&rdquo;
          their neighbours. For a long time we filed that under poetry. Under a microscope, a good
          deal of it turns out to be observation, written in the only vocabulary its observers had.
        </p>
      </TwoCol>

      <TwoCol id="compost" heading="Twenty piles, twenty diagnoses.">
        <p className="p1">
          The estate does not make compost in one industrial heap. It makes it in twenty small piles,
          each read by the person who turns it. Moisture by feel. Heat by hand. Smell as diagnosis — a
          heap that smells of ammonia is overfed; one that smells of the forest floor is ready. It is
          craftsmanship, and it is also logged, photographed, and dated every week.
        </p>
        <p className="p2">
          The vermicompost beds sit shaded and cool under the areca. The worms were not imported; they
          are the ones already in this soil, multiplied. That is the whole Vedic instinct in one
          decision — use what the land already has, and trust it to know what it needs.
        </p>
      </TwoCol>

      <TwoCol id="biobank" heading="The Biobank.">
        <p className="p1">
          Every observation, every block it applied to, every microbial read that followed — the
          estate keeps all of it in a Biobank. Over four seasons that becomes something rare: a
          training record grown from one valley&apos;s own soil, rather than borrowed from a textbook
          written for another.
        </p>
        <p className="p2">
          This is not a transcription of the Vrikshayurveda. It is the Vrikshayurveda re-derived from
          the ground — read against what this herd produces, what this canopy lets through, what this
          monsoon delivers. A different valley would need a different model. That is not a flaw. It is
          the entire point, and it is where this journal hands off to <em>Provenance</em>.
        </p>
      </TwoCol>

      <PullQuote attribution="Arvind">
        We scale wisdom. We do not replace it.
      </PullQuote>

      <OneCol heading="Older than the study of it.">
        <p className="p1">
          A PhD agronomist joined us who had never worked with coffee. On her first walk through the
          estate she offered a single sentence: <em>I only want to heal the land.</em> That is the
          whole practice — still correct, still waiting to be read by a world that got distracted and
          called the distraction progress.
        </p>
        <p className="p2">
          What the Vrikshayurveda called the land&apos;s breath, and what the moon-timed preparations
          called the right hour, the estate now also writes down as a signed event — the lunar day and
          the stir time logged beside the humidity and the hand that did the work. The oldest
          instrument and the newest, agreeing. That ledger is its own journal: <em>Provenance</em>.
        </p>
      </OneCol>

      <Continue currentHref="/vedic" />
    </>
  )
}

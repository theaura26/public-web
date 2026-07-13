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

export default function CircularPage() {
  return (
    <>
      <HeroBanner
        currentHref="/circular"
        title="Circular Intelligence"
        type="Detail · the pile"
        caption="Compost is not fertiliser. It is how a landscape remembers that nothing here is separate — that every output is somebody's input"
        alt="Aura — compost as circular intelligence"
      />

      <TwoCol id="reframe" heading="Compost is not fertiliser.">
        <p className="p1">
          We were taught to read compost as a slow-release fertiliser — a bag of nutrients you dig
          into the ground. It is the wrong reading, and it produces the wrong practice. Nutrients are
          what compost contains. They are not what it does. What it does is restore a set of
          relationships: between plant and fungus, bacteria and mineral, water and carbon, the living
          and the newly dead.
        </p>
        <p className="p2">
          The idea is older than the word. A living system recycles everything, and does it by a single
          rule: it is arranged so that life makes more life possible. Waste, in such a system, is only
          food that has not yet found its next mouth. There is no waste in a forest. When a leaf falls
          from a tree, it feeds the forest.
        </p>
        <p className="p2">
          This journal is about that sentence, and whether it is true. Mostly it is. In the places it
          is not yet, the gap is the work.
        </p>
      </TwoCol>

      <Placeholder
        type="Detail · the pile"
        caption="A turned windrow steaming in the morning cold — the pile heating itself from the inside"
      />

      <Placeholder
        type="Macro · finished compost"
        caption="Cured compost in the hand — crumb structure, no smell of rot, the colour of forest floor"
      />

      <TwoCol id="forest" heading="A forest barely leaks.">
        <p className="p1">
          You can measure the loop. Weigh everything that enters and leaves an intact forest — every
          gram of nitrogen the rain brings down, every gram the streams carry off — and the forest
          turns out to keep the great majority of it: more than ninety per cent of the nitrogen that
          falls on a healthy northern forest stays inside it. The loop is nearly closed. Almost nothing
          escapes.
        </p>
        <p className="p2">
          Break it, and you can watch it bleed. Clear a patch of that forest and hold it bare, and the
          stream below it changes within a season: nitrate climbs to many times the level that is safe
          to drink, as the severed system lets go of the fertility the living forest had been quietly
          holding. The loop was not a metaphor. It was load-bearing, and you could hear it snap. Compost
          is the attempt to build that retention back into ground we have already opened.
        </p>
      </TwoCol>

      <TwoCol id="heat" heading="The heat is alive.">
        <p className="p1">
          Start with manure, the most maligned output on a farm. Piled at the right ratio — roughly
          twenty-five to thirty parts carbon to one of nitrogen — it does something a sack of fertiliser
          never will: it comes to life and heats itself. A succession of microbes moves in, the early
          ones warming the pile until{' '}
          <Term tip="Heat-loving. In a compost pile, thermophilic microbes take over above about 45°C and can drive the core to 55–70°C — hot enough to kill pathogens and weed seeds.">thermophilic</Term>{' '}
          species take over and drive the core past fifty-five degrees. Held there — three days in a
          turned vessel, a fortnight of turnings in a windrow, by the letter of the regulations — the
          heat sterilises the pile of pathogens and weed seeds without a single chemical.
        </p>
        <p className="p2">
          The microbes are not eating the pile the way we eat. They cannot swallow a straw or a seed.
          They secrete enzymes into the world around them and digest it externally, absorbing whatever
          dissolves — a civilisation that feeds by exhalation. Manure, given air, water and time, is
          not rotting. It is being rewritten.
        </p>
      </TwoCol>

      <DataGrid cols={4} standalone>
        <DataCard value="&gt;90%">
          Of the nitrogen that falls on it, the share a healthy forest keeps inside its own loop — clear
          the forest and it leaks away.
        </DataCard>
        <DataCard value="55°C / 3d">
          The heat and time a compost pile must hold to sterilise itself of pathogens and weed seeds,
          without a single chemical.
        </DataCard>
        <DataCard value="~50%">
          Of stable soil carbon that is dead microbial bodies bonded to minerals — not undecayed plant
          litter.
        </DataCard>
        <DataCard value="~90%">
          Of a coffee cherry that is by-product, not drink; the pulp alone is over 40% of the fruit.
        </DataCard>
        <DataCard value="100×">
          Less methane from carefully composted coffee pulp than from the same pulp left to rot in a
          heap.
        </DataCard>
        <DataCard value="+18%">
          Soil carbon under shade-grown coffee versus sun — with 19% higher fertility and a fraction of
          the erosion.
        </DataCard>
        <DataCard value="7–18 t">
          Soil an acre&apos;s earthworms lift to the surface in a single year, turning the topsoil over
          from below.
        </DataCard>
        <DataCard value="7.2%">
          How circular the world economy actually was in 2023 — down from 9.1% in 2018. The honest
          counterweight.
        </DataCard>
      </DataGrid>

      <TwoCol id="carbon" heading="Made of the dead.">
        <p className="p1">
          What that rewriting produces is stranger than the old word &ldquo;humus&rdquo; suggests — and
          here the science has recently turned over. For a century, soil carbon was imagined as humus:
          large, stable molecules too chemically tough to rot. That picture, it turns out, does not
          hold. There is no separate class of permanent
          humus. Soil organic matter is a continuum of things in the middle of decomposing, and what
          makes some of it last is not the toughness of the molecule but where it sits — sealed inside
          an aggregate, or bonded to a{' '}
          <Term tip="Mineral-associated organic matter — carbon bonded to clay and silt surfaces. It is the slow-cycling, stable pool of soil carbon, but its capacity is finite: mineral surfaces saturate.">mineral surface</Term>,
          out of a microbe&apos;s reach. Persistence is a property of the ecosystem, not the molecule.
        </p>
        <p className="p2">
          And the most durable carbon in soil turns out to be largely not plant matter at all. It is
          the dead bodies of microbes —{' '}
          <Term tip="The residue of dead microbial cells. Recent work finds it makes up roughly half the stable carbon in many soils — carbon stored not as surviving plant litter but as the remains of the microbes that ate it.">necromass</Term>{' '}
          — glued to clay. Compost, read this way, stores carbon by feeding the microbes that will die
          and become the soil. It is a quiet, counter-intuitive economy, and it has limits worth stating
          plainly: the mineral surfaces saturate, the store is finite, and it releases again if the
          ground is torn back open. Compost mostly moves carbon fixed elsewhere; whether it builds net
          new carbon in a landscape depends on what the manure and the cherry pulp would otherwise have
          done. The honest version keeps the caveat attached.
        </p>
      </TwoCol>

      <TwoCol id="fungi" heading="Fungi build the house.">
        <p className="p1">
          If bacteria are the chemistry of the soil, fungi are its architecture. Their filaments thread
          between particles and bind them into crumbs; one group, the{' '}
          <Term tip="Fungi that partner with the roots of most plants, extending their reach through the soil in exchange for the plant's carbon. Around 80% of plant species form the symbiosis.">mycorrhizal</Term>{' '}
          fungi that partner with most plant roots, secretes a sticky protein called{' '}
          <Term tip="A glycoprotein associated with mycorrhizal fungi that correlates with soil aggregate stability. It is measured loosely enough that 'the glue that binds the soil' is a useful simplification, not a proven law.">glomalin</Term>{' '}
          that helps hold those crumbs together. The crumbs are the point: they make the pore spaces
          where water is held. A soil richer in organic matter holds more water a plant can actually use
          — modestly, and more in sand than in clay, but reliably.
        </p>
        <p className="p2">
          It is tempting to go further and cast the fungi as a mind — a &ldquo;wood-wide web&rdquo;
          through which trees consciously feed their young. The evidence does not carry that story: the
          popular version runs well ahead of what has actually been shown. What compost restores is
          quieter and better attested — not a forest internet, but a local economy of exchange, running
          at the scale of a root hair.
        </p>
      </TwoCol>

      <ScrollHighlight>
        {`A leaf falls.
         Fungi take it apart.
         Minerals hold what is left.
         Roots draw it up.
         The leaf becomes the tree again.`}
      </ScrollHighlight>

      <PullQuote>
        The opposite of waste is not recycling. The opposite of waste is *relationship*.
      </PullQuote>

      <TwoCol id="resilience" heading="Structure is resilience.">
        <p className="p1">
          Everything above resolves into a single practical quality: structure. A soil built by
          microbes and bound by fungi is not a bag of nutrients but a sponge with a skeleton. It drinks
          rain instead of shedding it, so slopes flood less and hold moisture deeper into a drought. It
          carries more life — and the diversity of a healthy soil food web is not decoration but the
          redundancy that lets a system take a shock and keep working.
        </p>
        <p className="p2">
          This is what a plantation is really buying when it composts, and it is worth more than the
          nutrients printed on a bag: not fertiliser, but a tolerance for bad years. A landscape with
          living soil is one that bends without breaking.
        </p>
      </TwoCol>

      <Placeholder
        type="Cross-section · living soil"
        caption="A spade of dark, aggregated soil against pale subsoil — structure you can see, water it can hold"
      />

      <Placeholder
        type="Detail · coffee pulp"
        caption="Fresh cherry pulp — over 40% of the fruit, a pollutant in a heap, a fertiliser in a windrow"
      />

      <TwoCol id="coffee" heading="The cherry that feeds the tree.">
        <p className="p1">
          A coffee farm makes the argument for you, because a coffee farm produces so much apparent
          waste. Only about a tenth of the cherry becomes the drink; the rest — pulp, mucilage,
          parchment, husk — is by-product, and the pulp alone is more than forty per cent of the fruit.
          Left in a heap it rots without air and breathes methane. Composted with care, the same pulp
          returns to the rows as organic matter and nutrients, releasing perhaps a hundredth of the
          methane, and closing a loop the estate was already standing inside.
        </p>
        <p className="p2">
          Whether that better soil makes a better cup is the honest edge of the story. Shade-grown
          coffee does grow in ground measurably richer in carbon and life, on slopes that lose a
          fraction of the earth bare plantations do. It is plausible, and mechanistically reasonable,
          that healthier soil makes a finer bean. It is not proven: cup quality answers to genetics,
          altitude, processing and roast as much as to soil, and a careful writer says so. What can be
          said is narrower, and still remarkable — the waste of one harvest can rebuild the ground the
          next one grows in.
        </p>
      </TwoCol>

      <TwoCol id="gap" heading="The principle is real. The practice is rare.">
        <p className="p1">
          It would be dishonest to end in triumph. The circular idea is decades old and still mostly
          unrealised: by one accounting the world economy was about seven per cent circular in 2023,
          and slipping. &ldquo;Regenerative&rdquo; has no agreed definition, which lets it be printed on
          things that have not earned it. Soil carbon is real but reversible and hard to verify. The
          distance between the principle and the practice is enormous.
        </p>
        <p className="p2">
          That distance is not a reason to abandon the principle. It is the location of the work. The
          forest already runs the closed loop; a farm has to be built back toward it, deliberately, pile
          by pile and season by season, with the honesty to keep measuring whether it is working.
        </p>
      </TwoCol>

      <OneCol heading="The opposite of waste is relationship.">
        <p className="p1">
          Which returns us to the reframing. The opposite of waste is not recycling — recycling still
          imagines a thing to be disposed of, only more cleverly. The opposite of waste is relationship:
          an output so fully connected to the next system that the category of waste dissolves. A leaf
          is not thrown away by a tree. It is handed to the fungi, which hand it to the minerals, which
          hand it to the roots, which hand it back to the light.
        </p>
        <p className="p2">
          Call it, if you like, a gift economy — one in which the flourishing of each depends on the
          flourishing of all, and wealth is the quality of the relationships rather than the size of the
          pile. It is offered here as a lens, not as evidence. But the science and the philosophy arrive
          at the same place from opposite directions. Aura composts not to add nutrients to a field, but
          to rejoin the relationships that make a field intelligent — to keep the loop, on ground where
          it was broken, closed enough to hold. That is the whole of it. Not a coffee estate with good
          waste management. A steward of a living system, learning to leak less.
        </p>
      </OneCol>

      <OneCol heading="A note on honesty.">
        <p className="p2">
          Where the science is still settling — the death of the &ldquo;humus&rdquo; model, whether
          compost adds new carbon or relocates it, how much water organic matter really holds, whether
          soil health reaches the cup — this essay says so in the body, rather than choosing the
          flattering number.
        </p>
      </OneCol>

      <Continue currentHref="/circular" />
    </>
  )
}

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

export default function HerdPage() {
  return (
    <>
      <HeroBanner
        currentHref="/herd"
        title="Ecosystem Engineers"
        type="Detail · the herd"
        caption="Why a grazing herd — moved, rested, followed by dung and beetle and bird — is one of the oldest ecosystem engineers on Earth"
        alt="Aura — cattle as ecosystem engineers"
      />

      <TwoCol id="reframe" heading="A cow is not what leaves it.">
        <p className="p1">
          Ask what a cow is for and the answer arrives as a product: milk, meat, leather, a line on
          a balance sheet. It is the wrong question, and it produces the wrong animal. A cow standing
          still in a shed is an input. A cow moving across grassland is something older and stranger
          — a working part of the machinery that built the grassland in the first place.
        </p>
        <p className="p2">
          This is not sentiment. Ecologists have a precise name for it. An{' '}
          <Term tip="An organism that shapes habitat for others by physically changing the materials around it. The beaver is the textbook case.">ecosystem engineer</Term>{' '}
          is any organism that modulates the resources available to other species by causing physical
          changes in the world around it. The beaver is the textbook case. So, it turns out, is a large
          grazing herbivore. It does not merely eat the landscape. It rebuilds it.
        </p>
      </TwoCol>

      <Placeholder
        type="Landscape · the herd, moving"
        caption="A herd at low density crossing open grassland — movement, not occupation, is the mechanism"
      />

      <Placeholder
        type="Detail · hoofprint"
        caption="A single print pressing seed and litter into the soil surface"
      />

      <TwoCol id="coevolution" heading="Grass is built to be eaten.">
        <p className="p1">
          Grass invites the animal that eats it. Most plants grow from the tip; cut the tip and you
          wound the plant. Grasses grow from the base — from{' '}
          <Term tip="Growing tissue at or below the soil surface. Because the growing point sits low, a grazed blade regrows from the base within days rather than being killed. An adaptation to being eaten — and to fire.">intercalary meristems</Term>{' '}
          at or below the soil surface — so a grazed blade regrows from ground level within days. This
          is not an accident. It is an adaptation to being eaten, refined over roughly twenty million
          years alongside the animals doing the eating.
        </p>
        <p className="p2">
          The animals adapted in turn, evolving{' '}
          <Term tip="High-crowned, ever-growing teeth that let a grazer withstand a lifetime of chewing abrasive, silica-rich grass and grit.">hypsodont</Term>{' '}
          teeth to survive a diet of silica-laced grass and grit. Grass and grazer are not so much
          predator and prey as two halves of a single, slow negotiation. When open grasslands spread
          across the planet in the late Miocene, they spread with the herds.
        </p>
      </TwoCol>

      <TwoCol id="lawn" heading="The herd gardens the grass.">
        <p className="p1">
          Watch a herd on good ground and a pattern appears. Ecologists studying the Serengeti called it
          a grazing lawn: a short, dense, leafy sward that the animals graze
          into existence and then maintain, because grazed grass tillers and stays young. The herd is,
          functionally, gardening the pasture it depends on.
        </p>
        <p className="p2">
          The engineering is physical. Hooves press seed into soil and trample old growth into surface
          litter that shades the ground and slows evaporation. Dung and urine redistribute nutrients
          the animal gathered elsewhere. Done in short, intense bouts followed by long recovery, this
          builds soil. Done without recovery, it does the opposite.
        </p>
        <p className="p2">
          That last sentence is the whole argument, and it should be said plainly. Continuous, heavy
          grazing with no rest is one of the most reliable ways to destroy land: it drains root
          reserves, bares the soil, and hands the topsoil to the wind. The science here is settled.
          The cow is not a virtue. It is a lever, and a lever moves in two directions.
        </p>
      </TwoCol>

      <PullQuote>
        The cow is not a virtue. It is a *lever* — and a lever moves in two directions.
      </PullQuote>

      <TwoCol id="pat" heading="One pat, a working economy.">
        <p className="p1">
          Consider a single dung pat. Within it is roughly eighty-five per cent of the phosphorus and
          potassium the animal ate that day, returned to the ground almost unused, along with billions
          of gut microbes. It does not sit there long.
        </p>
        <p className="p2">
          Within minutes, dung beetles arrive — in African savanna, thousands at a time; one classic
          account records some sixteen thousand beetles clearing nearly three pounds of dung in under
          two hours. They bury it, tunnelling it underground where its nutrients feed bacteria and
          fungi instead of evaporating into the air. In the process they aerate the pat, which
          suppresses the methane it would otherwise release, disperse seeds, and break the life cycle
          of pasture flies and parasites.
        </p>
        <p className="p2">
          Someone has put a price on this. Dung beetles are worth an estimated 380 million dollars a
          year to the United States cattle industry, and 367 million pounds a year to Britain&apos;s —
          for work no one pays them to do.
        </p>
      </TwoCol>

      <Placeholder
        type="Macro · the pat"
        caption="A fresh pat within the hour — beetles already tunnelling, burying nutrients before they gas off"
      />

      <Placeholder
        type="Detail · beetle at work"
        caption="A dung beetle rolling a brood ball — free nutrient-cycling, valued in the hundreds of millions"
      />

      <TwoCol id="invisible" heading="The invisible middle.">
        <p className="p1">
          Below the beetle, the cascade continues into organisms too small to see. Bacteria and fungi
          break the buried dung down; protozoa and nematodes graze the bacteria and excrete
          plant-available nitrogen — a step ecologists call the microbial loop, responsible for a large
          share of the nitrogen a pasture releases each year.
        </p>
        <p className="p2">
          Fungi do something subtler. <Term tip="A symbiosis between fungal threads and plant roots. The fungus extends the root's reach through the soil and trades phosphorus and water for the plant's carbon. Around 80% of plant species form it.">Mycorrhizal</Term>{' '}
          fungi thread their filaments through the soil and trade phosphorus and water to plants in
          exchange for carbon. Along the way they secrete{' '}
          <Term tip="A sticky protein secreted by mycorrhizal fungi that binds soil particles into water-holding crumbs.">glomalin</Term>,
          a protein that glues soil into crumbs. Those crumbs hold water: a soil at four per cent
          organic matter can hold more than twice the available water of one at one per cent.
          Earthworms extend the plumbing further: an acre&apos;s worms lift seven to eighteen tons of
          soil to the surface each year, and their burrows turn hard, sealed ground into ground that
          drinks the rain.
        </p>
      </TwoCol>

      <ScrollHighlight>
        {`A cow eats grass.
         The grass becomes dung.
         The dung becomes soil.
         The soil becomes grass.
         The loop closes in days.`}
      </ScrollHighlight>

      <TwoCol id="riders" heading="What rides with the herd.">
        <p className="p1">
          The herd is a moving habitat. Cattle egrets walk beside grazing animals to catch the insects
          they flush; oxpeckers ride African ungulates and glean their ticks — though the oxpecker&apos;s
          reputation as a pure helper is contested, since it also feeds on its host&apos;s wounds, and
          honesty requires the caveat. Beneath the surface, the dung food web feeds the swallows,
          starlings and bats that hunt the beetles and their larvae.
        </p>
        <p className="p2">
          There is a larger effect. A herd grazing unevenly leaves a mosaic — patches cropped short
          beside patches left tall — and different grassland birds need different patches. Uniformity
          is the enemy of diversity; heterogeneity is its engine. One survey of a grazed-and-mown
          meadow in Transylvania recorded about ninety-eight plant species in ten square metres, a
          density that out-diversifies rainforest at that scale, sustained by nothing more exotic than
          animals and a scythe.
        </p>
      </TwoCol>

      <Placeholder
        type="Portrait · egret and herd"
        caption="A bird working the grass a step ahead of a grazing animal — the herd as moving habitat"
      />

      <Placeholder
        type="Landscape · the mosaic"
        caption="Short-grazed patches beside tall — the heterogeneity that grassland birds depend on"
      />

      <TwoCol id="pump" heading="The animal that moves mountains, slowly.">
        <p className="p1">
          At continental scale the effect becomes almost geological. Large animals carry fertility in
          their guts and their bodies, moving it uphill and against the gradient that water alone would
          run down. Model the loss of the Ice-Age megafauna, and the lateral transport of phosphorus
          across a landscape like Amazonia falls by more than ninety-eight per cent once the giants are
          gone. Africa is the exception, because Africa kept
          its giants. The domestic cow is the heir to the mammoth: a nutrient pump that still walks.
        </p>
        <p className="p2">
          Here the argument has to slow down and tell the truth about its limits. It is fashionable to
          claim that grazing cattle can reverse climate change. They cannot. The widely watched proposal
          that holistic grazing could return the atmosphere to pre-industrial carbon has been rejected
          across rangeland and climate science; the carbon arithmetic behind it is off by roughly
          sevenfold. Soil-carbon gains from good grazing
          are real, but finite, reversible and slow, and at the global scale livestock remain a net
          source of greenhouse gas, not a sink. The claim that a fungal network lets trees consciously
          nurse their young — the &ldquo;wood-wide web&rdquo; — has likewise been shown to outrun its
          evidence.
        </p>
        <p className="p2">
          None of this unmakes the case. It sharpens it. The cow is not a climate solution, and it is
          not a miracle. It is infrastructure — and infrastructure is judged by how it is run.
        </p>
      </TwoCol>

      <PullQuote>
        The domestic cow is the heir to the mammoth — a *nutrient pump* that still walks.
      </PullQuote>

      <TwoCol id="broken" heading="The link is easy to break.">
        <p className="p1">
          The cascade is not automatic. Most of a dose of ivermectin, the common cattle dewormer,
          leaves the animal intact in its dung and stays lethal to insects for weeks; the pat meant to
          feed the soil food web instead poisons it. In a feedlot the dung never reaches a pasture at
          all. The engineering only happens when the pieces are allowed to meet.
        </p>
        <p className="p2">
          So the honest statement is narrow and it holds. Well-managed grazing on living ground can
          build soil, hold water, cycle nutrients and lift local biodiversity. Mismanaged, the same
          animal does the reverse. The variable is not the cow. It is the choreography.
        </p>
      </TwoCol>

      <TwoCol id="stewardship" heading="The intelligence is in the relationship.">
        <p className="p1">
          The knowledge of how to run it is old, and it was not written in journals. Plains peoples
          burned grassland to draw bison onto fresh regrowth, manufacturing the shifting mosaic that
          grassland birds still depend on — a practice ecologists now call pyric herbivory, having
          arrived at it a century late. Maasai herders hold wet-season pasture in reserve for the dry;
          some of their rangelands are more diverse, not less, for being grazed. Across Europe, the
          richest meadows are the ones grazed and mown for centuries; abandon them and the richness
          fades.
        </p>
        <p className="p2">
          The pattern across every one of these systems is the same. The animal is not the
          intelligence. The relationship is — the timing of the move, the length of the rest, the
          reading of the land — and that relationship has always been tended by people. Remove the
          herder&apos;s judgment and you are left with either a machine or a weed.
        </p>
      </TwoCol>

      <DataGrid cols={4} standalone>
        <DataCard value="85%">
          Of the phosphorus and potassium a grazing animal eats, returned to the pasture in dung and
          urine within a day.
        </DataCard>
        <DataCard value="16,000">
          Dung beetles recorded clearing nearly three pounds of dung in under two hours on African
          savanna.
        </DataCard>
        <DataCard value="$380M">
          Estimated yearly value of dung-beetle services to the US cattle industry — £367M in the UK.
        </DataCard>
        <DataCard value="&gt;98%">
          Modelled fall in phosphorus transport across Amazonia after the Ice-Age megafauna vanished.
        </DataCard>
        <DataCard value="98 / 10m²">
          Plant species in one grazed-and-mown Transylvanian meadow — denser than rainforest at that
          scale.
        </DataCard>
        <DataCard value="20M yrs">
          Roughly how long grasses and grazers have been shaping one another.
        </DataCard>
        <DataCard value="×7">
          Factor by which the popular &ldquo;cattle will reverse the climate&rdquo; carbon claim is
          overstated.
        </DataCard>
        <DataCard value="52">
          Malnad Gidda on the Mudigere estate — an indigenous breed, the land&apos;s oldest working
          infrastructure.
        </DataCard>
      </DataGrid>

      <TwoCol id="aura" heading="Why Aura keeps a herd.">
        <p className="p1">
          This is why Aura keeps cattle, and it is not for what leaves them. At Mudigere the herd moves
          under the coffee canopy and along the forest edge — a system with a name,{' '}
          <Term tip="The deliberate integration of trees, forage and grazing animals on the same ground. It stores several times the carbon of open pasture and raises the biodiversity of the land it shades.">silvopasture</Term>,
          that banks several times the carbon of open pasture and raises the biodiversity of the ground
          it shades. Their dung feeds the estate&apos;s fermentations and preparations; their grazing
          shapes the understorey; the beetles and worms and fungi that follow them build the soil the
          coffee roots into.
        </p>
        <p className="p2">
          Fifty-two Malnad Gidda — an indigenous breed bred by this climate over centuries — are not a
          production line. They are the estate&apos;s oldest working infrastructure. Aura&apos;s wager
          is that the future is not built by replacing that intelligence with a machine, but by keeping
          it: by treating the herd as a system to be tended rather than a yield to be maximised. The
          cow was engineering landscapes for twenty million years before anyone thought to milk one. The
          work now is mostly to move it at the right time, and otherwise to stay out of its way.
        </p>
      </TwoCol>

      <OneCol heading="Not a yield. A relationship.">
        <p className="p1">
          There is an older way to name this — a philosophy of reciprocity, in which an economy is built
          on the quality of its relationships rather than the illusion of self-sufficiency. It is offered
          here as a lens, not as evidence. A grassland and its herd are each other&apos;s gift: the grass
          feeds the animal, the animal makes the soil that feeds the grass.
        </p>
        <p className="p2">
          Break the exchange and both diminish. Tend it, and a single cow becomes what it has always
          quietly been — not livestock, but infrastructure; not a product of the land, but one of the
          oldest processes by which the land keeps itself intelligent.
        </p>
      </OneCol>

      <OneCol heading="A note on honesty.">
        <p className="p2">
          Where the science is contested — the scale of grazing&apos;s carbon benefit, the
          &ldquo;wood-wide web,&rdquo; whether grazing raises total plant production — this essay says
          so in the body, rather than quietly choosing the flattering number.
        </p>
      </OneCol>

      <Continue currentHref="/herd" />
    </>
  )
}

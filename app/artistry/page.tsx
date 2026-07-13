'use client'

import {
  HeroBanner,
  OneCol,
  TwoCol,
  Placeholder,
  DataGrid,
  DataCard,
  PullQuote,
  ScrollHighlight,
  Continue,
  Term,
} from '@/components/article/Article'

export default function ArtistryPage() {
  return (
    <>
      <HeroBanner
        currentHref="/artistry"
        title="A space to make."
        src="/aura-artistry.mp4"
        mediaType="video"
        poster="/aura-artistry.jpg"
        caption="Six studios cut from the estate itself — where creators make what only this ground allows"
        alt="Aura artistry — the studios where creators come to make"
      />

      <Placeholder
        type="Detail · workbench"
        caption="Cedar workbench in natural light — ceramics on one end, circuitry on the other"
      />

      <Placeholder
        type="Detail · glaze"
        caption="Glaze test tiles, fired from local red laterite oxides"
      />

      <TwoCol id="premise" heading="The studio is the estate.">
        <p className="p1">
          A glaze mixed from the same red laterite the coffee grows in, fired in a kiln burning
          offcuts from the canopy thinning — that cup is the whole idea in one object. The studios
          are not built beside the plantation. They are cut from it. The land is the raw material,
          the tool, and the room.
        </p>
        <p className="p2">
          What the plantation makes in food, the studios make in object, cloth, letterform, and
          sound. Same ground, two harvests. A creator who works here works with material sourced,
          fermented, or fired within a walk of the bench — nothing flown in to finish a piece.
        </p>
        <p className="p2">
          Long hours. Few meetings. No one checking whether the kiln room has Wi-Fi. Who comes to
          make here, and how, is its own journal — <Term tip="The residency's selection, teachers, and application detail live in the Monastic Polymaths journal.">Monastic Polymaths</Term>. This
          one is about the space itself, and what leaves it.
        </p>
      </TwoCol>

      <PullQuote>
        Coffee roots and design systems. Code meets clay.
      </PullQuote>

      <ScrollHighlight>
        {`Code on Monday.
         Clay on Tuesday.
         Coffee on Wednesday.
         One space, three grammars.`}
      </ScrollHighlight>

      <TwoCol id="studios" heading="Six rooms to make in.">
        <p className="p1">
          Every valley has its studios, and every one obeys the same rule: the tools in it must be
          serviceable by the hands that live here. No dependency on a supply chain the land cannot
          feed. No complexity the next apprentice cannot inherit.
        </p>
        <DataGrid cols={3}>
          <DataCard value="Ceramics · Mudigere">
            Wheel, kiln, glazes mixed from local oxides. Vessels for the farm-to-table kitchen,
            tiles for the cabins. The earth of the valley, made durable.
          </DataCard>
          <DataCard value="Textile · Mudigere">
            Hand-loom, natural dye, indigo vat. Cotton planted between the coffee rows, woven into
            the linen of the cabins and the kitchen.
          </DataCard>
          <DataCard value="Joinery · Ohara">
            Cedar, hinoki, cypress — joinery in the old Japanese manner, learned from Kenji, the
            third-generation carpenter carrying on his grandfather&apos;s garden house.
          </DataCard>
          <DataCard value="Field recording · Both">
            The valley recorded continuously — monsoon, cicadas, river, bell. Composers and coders
            draw from the library. A living archive of place.
          </DataCard>
          <DataCard value="Typography · Both">
            A bilingual practice — Kannada and Latin in Mudigere, Japanese and Latin in Ohara.
            Letterforms that honour the ground they set on.
          </DataCard>
          <DataCard value="Native systems · Both">
            Code is a craft here too — the farm system, the provenance ledger — written for this
            soil, on the bench, by the person who will keep it running.
          </DataCard>
        </DataGrid>
      </TwoCol>

      <Placeholder
        type="Process · pottery"
        caption="Clay turned at the wheel, glazes mixed from local oxides — Mudigere ceramics studio"
      />

      <Placeholder
        type="Process · loom"
        caption="Hand-loom weaving, indigo vat beside it — the Mudigere textile studio"
      />

      <TwoCol id="conditions" heading="What the space gives a maker.">
        <p className="p1">
          Most studios give you four walls and a deadline. This one gives you a whole living system
          to make inside — a kiln that burns the estate&apos;s own wood, a dye vat heated by the
          kitchen, a herd, a canopy, a river, and a table of people who have each read one craft
          for thirty years.
        </p>
        <p className="p2">
          The friction between disciplines is the material. A potter next to a fermenter next to
          the person who wrote the ledger — that is where work nobody else could make gets made.
          The space does not assign briefs. It sets the conditions and lets the land do the rest.
        </p>
      </TwoCol>

      <Placeholder
        type="Detail · gathering"
        caption="Long tables under the canopy — the annual Bhoomi gathering, Mudigere"
      />

      <Placeholder
        type="Portrait · makers"
        caption="Potter, fermenter, and coder at the same table — no stage, no keynote"
      />

      <TwoCol id="bhoomi" heading="Bhoomi: one week a year, the space opens.">
        <p className="p1">
          <Term tip="भूमि — Sanskrit for 'earth' or 'ground.' Also the name of Aura's annual gathering.">Bhoomi</Term> is
          the one week a year the studios stop being private. Makers, growers, and a small invited
          circle from outside the valley sit at the same long table — the potter beside the
          fermenter beside the person who wrote the ledger. No keynote. No stage. Just the bench,
          open.
        </p>
        <p className="p2">
          What gets made that week doesn&apos;t leave the valley for sale. It leaves as an idea
          someone takes home and tries on their own ground. That is the entire export model: not
          the objects, but the posture that produced them.
        </p>
      </TwoCol>

      <TwoCol id="outputs" heading="What leaves the space.">
        <p className="p1">
          A studio justifies itself by what leaves it. This is the harvest, not the intention.
        </p>
        <DataGrid cols={2}>
          <DataCard value="Vessels &amp; tiles">
            The cup the residency drinks from, the tile underfoot in the cabins, the platter on the
            long table at dinner. None of it bought in.
          </DataCard>
          <DataCard value="Cloth &amp; thread">
            Linen, indigo, cotton — woven on a small hand-loom, dyed in a vat that runs on heat from
            the kitchen. The bedsheets and aprons of the valley.
          </DataCard>
          <DataCard value="Cedar joinery">
            The teahouse hinge, the cabin sliding door, the bench under the verandah. Each piece
            signed by Kenji and dated.
          </DataCard>
          <DataCard value="Letterforms">
            Type drawn in Mudigere and Ohara, used on the labels of the lots, the menu, the
            certificate that ships with the bag.
          </DataCard>
          <DataCard value="Field libraries">
            Audio archives, photographic logs, soil-colour swatches. The valley as raw material for
            the next maker who arrives.
          </DataCard>
          <DataCard value="Native software">
            The ledger, the farm OS. Code made for this valley and inherited by the next apprentice,
            not licensed to the next buyer.
          </DataCard>
        </DataGrid>
      </TwoCol>

      <Placeholder
        type="Detail · craft + code"
        caption="A clay form on one half of the bench, a breadboard on the other. Same maker."
      />

      <Placeholder
        type="Detail · Kenji's bench"
        caption="Joinery tools laid out in the Ohara workshop, cedar shavings underfoot"
      />

      <OneCol heading="A space you can't ship.">
        <p className="p1">
          The studio is fired with wood from the canopy, dyed from the forest floor, floored with
          tiles pressed from the valley&apos;s own clay. None of it travels — and neither does the
          space. You cannot export a kiln that burns this estate&apos;s offcuts, or a table of
          people who have read this land for decades. You can only come and make inside it.
        </p>
        <p className="p2">
          What a creator carries out is the work, and the posture that made it. Who gets to carry it
          — the makers we invite, and how you write to us — is <em>Monastic Polymaths</em>.
        </p>
      </OneCol>

      <Continue currentHref="/artistry" />
    </>
  )
}

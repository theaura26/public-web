'use client'

import {
  HeroBanner,
  OneCol,
  TwoCol,
  PullQuote,
  DataGrid,
  DataCard,
  Placeholder,
  Portrait,
  ScrollHighlight,
  Continue,
} from '@/components/article/Article'

export default function CowsOfAuraPage() {
  return (
    <>
      <HeroBanner
        title="Cows of Aura"
        type="Portrait · animal, morning light"
        caption="COW-0001 is Litty, dark brown with white marks, born to Lulu at the estate"
        alt="A Malnad Gidda cow at Sampigekhan Estate, Mudigere"
      />

      <TwoCol id="premise" heading="An ear tag can fall out. A name is not a record.">
        <p className="p1">
          About fifty Malnad Gidda graze these 150 acres, and the estate has always known them by
          name. Names are how people work. They are not how a farm remembers.
        </p>
        <p className="p2">
          Tags come off, get replaced and get reused. Names repeat, and shorten, and change
          depending on who is speaking. Neither survives ten years of records well enough to
          answer a question like: what did this animal&rsquo;s dung go into, and which block did
          it end up on.
        </p>
        <p className="p2">
          So every animal now gets a third thing. A number that is issued once and never
          reassigned.
        </p>
      </TwoCol>

      <PullQuote>
        The ear tag can change. The Cow ID must not.
      </PullQuote>

      <TwoCol id="identity" heading="One animal per row, and nine fields before it counts.">
        <p className="p1">
          The register holds one animal per row, and one rule above all the others: the Cow ID is
          stable for life. COW-0001 is Litty — dark brown with white marks, born to Lulu, who is
          COW-0010, at the estate. If Litty&rsquo;s tag is lost tomorrow she is still COW-0001,
          and everything ever recorded against her still resolves.
        </p>
        <p className="p2">
          Nine fields are mandatory before a row is considered real: the ID, the name, the ear
          tag, the animal type, sex, the date the animal joined Aura, current status, current
          location, and the person responsible for it. Every record has an owner and a place.
        </p>
        <p className="p2">
          Where something is genuinely unknown, the register requires the word <em>Unknown</em>
          {' '}rather than a blank. A blank is ambiguous — it might mean nobody checked. Unknown is
          a statement, and a statement can be corrected later.
        </p>
      </TwoCol>

      <Placeholder
        type="Detail · the register open on a field tablet"
        caption="One animal per row, nine mandatory fields, and a number issued once"
      />

      <ScrollHighlight>
        {`One animal.\n   One row.\n   One number, issued once.`}
      </ScrollHighlight>

      <TwoCol id="role" heading="Every animal has a job written down.">
        <p className="p1">
          Alongside identity, the register records what each animal is for. This is where a herd
          register stops being livestock administration and starts being agronomy: the functional
          role connects the animal to the fertility system it feeds.
        </p>
        <DataGrid>
          <DataCard value="Milk">
            Lactation status, lactation number, last calving date. The dairy side of the herd.
          </DataCard>
          <DataCard value="Breeding">
            Dam and sire by Cow ID, so lineage is a link you can follow.
          </DataCard>
          <DataCard value="BD 500 / CPP">
            Dung destined for the biodynamic preparations — the horn manure and the cow pat pits.
          </DataCard>
          <DataCard value="Jeevamrit">
            Dung and urine for the Vedic brews, which run to volume against the season&rsquo;s
            calendar.
          </DataCard>
        </DataGrid>
        <p className="p2">
          There is a dung use priority on every row. The material that leaves an animal has a
          designated destination before it leaves, which is the only way a claim like{' '}
          <em>this preparation came from this herd</em> can ever be checked rather than asserted.
        </p>
      </TwoCol>

      <Portrait
        src="/aura-placeholder.svg"
        ratio="5 / 7"
        alt="A Malnad Gidda in the shed at Sampigekhan Estate"
        caption="Every animal a row, and the row outlives the ear tag"
      />

      <TwoCol id="grazing" heading="Where they are, and how they are kept.">
        <p className="p1">
          Location is a mandatory field and it changes: cow shed, quarantine shed, treatment pen,
          calf pen, grazing paddock, compost yard. Grazing zone is recorded separately, A through
          D, because the estate rotates them and wants to be able to ask what a zone looked like
          after a herd had been on it.
        </p>
        <p className="p2">
          Feeding regime is recorded as grazing only, grazing with fodder, stall fed, or a
          recovery ration. Body condition is scored one to five, monthly. Health risk is carried
          as a plain flag — low, stable, watch, medium, high, critical — so an exception can be
          found without reading every row.
        </p>
        <p className="p2">
          Breed and breed type are both held, because the herd is not uniform. Malnad Gidda is
          the indigenous breed of these hills and the reason the herd exists in this form; the
          register also carries Hallikar, Gir, Sahiwal and crosses, and marks each as indigenous,
          crossbred, exotic or unknown. Aura would rather be able to compare than assume.
        </p>
      </TwoCol>

      <TwoCol id="limits" heading="The structure is built. Filling it is work in progress.">
        <p className="p1">
          The register is the identity layer and nothing more. Daily milk, daily health and daily
          feed do not belong in it — those are logs, and logs point back at the Cow ID rather
          than living inside the base table.
        </p>
        <p className="p2">
          The structure is built and the rules are settled. Filling it for every animal in the
          herd is work in progress, and no claim is made here about how complete it is on any
          given day.
        </p>
        <p className="p2">
          The reason to build it this way is simple enough. A farm that can name its animals is
          affectionate. A farm that can trace one animal&rsquo;s dung to one block on one date is
          accountable. Aura would like to be both, and only one of the two can be audited.
        </p>
      </TwoCol>

      <Continue currentHref="/cows-of-aura" />
    </>
  )
}

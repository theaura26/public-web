# Editorial system

How the Aura site is written and set. For anyone adding a page.

## Page families

Each family has a different job, and should read differently. A page that
could be mistaken for another Aura page after changing only its title has
not been written yet.

| Family | Job | Shape | Depth |
|---|---|---|---|
| **Home** | Orientation and conviction | Declaration, evidence, the three pillars, an invitation | 500–900 |
| **Brand proposition** | Why Aura exists | Concise claims carried by concrete practice | 700–1,200 |
| **Practice / pillar** | What Aura does in a domain | What the work is, what it produces, who does it | 700–1,400 |
| **Place** | Give a place its own character | Scene-led, particular, long-form | 700–1,400 |
| **Regenerative Life explainer** | The highest evidence standard on the site | What it is → what is done → what is measured → what we can't prove yet | 1,000–1,800 |
| **Field Note** | Authored and specific | Varies: field report, register, ritual, species account | 450–1,600 |
| **Product** | Answer a buyer's practical questions | Parent lists its seasons; leaf states its record | 250–700 |
| **Index** | Orient and route onward | Lanes and filters. Never repeats child copy | as short as works |
| **Utility** | Clarity and action | Shortest possible | as short as works |

Word counts are a diagnostic. A page short of evidence stays short, and the
gap is recorded in `open-questions.md`.

## The four-part subject page

The nine disciplines and the three pillars share `components/SubjectPage.tsx`:

1. **What it is** — the lede, carried as the first heading.
2. **What is done** — practice, with records behind it.
3. **What is measured** — a spec list. Any qualification travels beside the
   figure rather than being left to a footnote.
4. **What we can't prove yet** — where the record stops.

The fourth is load-bearing. A farm that publishes the edge of its own
evidence is telling you the rest of the numbers are real, and that is the
only reason to believe the first three parts. It renders **only when there
is a genuine gap** — a page with nothing outstanding does not manufacture a
caveat to fill a heading.

Three layout arrangements rotate across the set, keyed on a subject's
position, so twelve pages do not read as one form filled in twelve times.
What moves is where the picture, the quote and the figures fall.

## Evidence rules

The controlling document is `AURA_COFFEE/01_STRATEGY/claims-and-proof.md`.
Three rules come out of it:

1. A fact has a record behind it. State it plainly.
2. A reading of facts is published as a reading — "our own readings", "the
   estate's reasoning is" — never as a demonstrated result.
3. Anything not yet true is future tense, or it belongs under *what we
   can't prove yet*.

Distinguish observed fact, measured result, established practice, informed
interpretation, belief, ambition and plan. When an Aura-specific fact cannot
be verified: do not guess, do not turn an intention into an achievement, and
write the page conservatively without the unverified detail.

Aura is **not** certified organic or biodynamic. It practises both and
publishes the record instead. Never imply otherwise.

Every externally checkable claim is recorded in `claims-ledger.md`.

## Voice

British English. Intelligent, calm, precise, observant.

- Concrete nouns, active verbs, observable detail.
- State the subject early.
- Vary sentence length with purpose. Some passages spare, others explanatory.
- Metaphor selectively, anchored to something real.
- Say what the consequence is: what it changes, what becomes possible.
- First-person plural only for what Aura can own.
- Confidence without grandiosity.

### Never write

**The negation construction.** "X, not Y." "It is not A, it is B." "Not just."
"Not merely." "More than." "Doesn't just." Say what a thing **is**. This one
recurs and is the most important rule on the page.

Also avoid: "where X meets Y"; "at the intersection of"; "in a world where";
"reimagining", "redefining", "revolutionising", "transformative", "seamless",
"holistic", "timeless" without evidence; empty triads; em dashes as a default
rhythm device; headings that all share one grammatical pattern; conclusions
that restate the introduction; "Discover more" where a specific action exists;
any paragraph that could be pasted onto a different farm, studio or retreat
unchanged.

### Signature language

Use where it earns its place, and stop repeating it once it stops earning it:
Natural Intelligence; generational impact; ancestral wisdom and creative
capital; land, time and practice; grown and tended over time.

## Type

Six roles, defined in `app/globals.css` and documented in
`DESIGN-SYSTEM.md` §8. Do not restate their values in a component — inherit
them. Three separate components had drifted by restating the old display
spec, one of them under a comment claiming it inherited.

`h2` renders at three sizes on purpose: 60px for a content section heading,
32px for a lane heading, 28px in the footer, each scaling on its own clamp.
The element is chosen for the document outline and the size for the visual
hierarchy, and where they disagree it is recorded in `DESIGN-SYSTEM.md`.

The reverse — choosing the element from the size — is the mistake. The
homepage sanctuary banners were `large ? 'h1' : 'h2'`, which gave the
homepage three `h1`s because two of them were simply big. Pick the element
from the outline; set the size inline if it differs.

**Every page needs exactly one visible `h1`.** Where the title is set as
artwork — an SVG wordmark, a letter row, a Figma-faithful board — add
`<h1 className="sr-only">` carrying the real title. `/ohara` and `/reason`
both opened at `h2` with no top level until this was added. Use the
`.sr-only` utility in `globals.css`; it is clipped rather than pushed
off-screen, so it never widens `scrollWidth`.

**No eyebrows.** A page title stands on its own.

## Links

A field note referenced inside a discipline page is written `[label](/href)`
in the data and opens in a new tab — a reader midway through an argument
should not lose the thread to check a supporting note.

Every page ends with a specific next step. Discipline pages close on the rest
of the ring, starting from the one just read.

## Before publishing

1. Read it aloud. It should sound like a person.
2. Check every factual addition against the claims ledger.
3. Confirm the opening creates interest, the middle supplies substance, the
   ending gives consequence.
4. Change the title and see whether the page could be another Aura page. If
   it could, it is not finished.
5. Run `npm run lint:editorial` for prohibited constructions. It is clean
   as of this pass, so any finding is something you introduced. `--strict`
   exits non-zero and is safe to put in CI.
6. View it at 375, 768 and 1280 against a **production build**. The dev
   server has served stale CSS during this project, and an audit against it
   reports sizes the site does not ship.

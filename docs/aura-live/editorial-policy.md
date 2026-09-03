# Aura Live — the editorial policy

This is the rulebook for what appears on `/live`. It is written to be
read and changed by anyone at Aura, not only by whoever is writing the
code. Where it says *configurable*, changing it is a setting, not a
rebuild.

The code that enforces this is `lib/aura-live/policy.ts` and
`lib/aura-live/score.ts`. If you change this document, that code changes
in the same commit.

---

## What Aura Live is for

Proof of the land, to the world.

It exists so that somebody who has never been to Mudigere can see what
actually happens there, with the day, the place and the evidence attached.
Everything below follows from that. A feed that publishes one thing it
cannot stand behind has spent the only thing it had.

**The feed is allowed to be empty.** Events reach the estate record a few
times a week, not a few times a day. A quiet week should look like a quiet
week. Nothing is ever invented, padded or promoted to keep the page busy.

## What every entry must answer

Three things, always:

- **What happened**
- **Who did it, or what was seen** — a person, a team, a species, an
  animal, or a natural process. A vine snake needs no human attached to it.
- **When** — the day, and the time only if the estate actually recorded one.

And, when the record supports it: **where** on the estate, **why it
matters** in one factual line, a **photograph**, and the evidence behind it.

## The thirteen subjects

Not invented for the feed. These are the subjects the site already
publishes under **Now** — Mudigere, as it is today — and Aura Live uses
exactly those, under exactly those names. A test fails if the two lists
drift apart.

| | | Data today |
|---|---|---|
| **Seasons** | Temperature, rainfall and weather, when they tell a story. | Rainfall exists but is withheld — see Numbers |
| **Lunar rhythm** | The biodynamic calendar, and work timed against it. | — |
| **Sprays** | A preparation actually applied to the land. | 100 events |
| **Fertiliser prep** | Making the inputs: CPP, Jeevamrit, compost, the preparations. | 72 events |
| **Labs** | Testing, trials, and what the estate learned. | — |
| **Biodiversity** | Something wild was seen and recorded. | 6 field records + 14 photographed sightings |
| **Bees** | The hives, and what the bees are doing. | — |
| **Cows** | Care, health, birth or movement in the herd. Never a headcount. | — |
| **Field activities** | Work on the land: planting, shade, clearing, tagging. | 78 events |
| **Harvest** | Something came off the land, worth recording. | 14 events |
| **Fermentation** | Processing the crop, and what the ferment did. | — |
| **People & gatherings** | Somebody did something externally interesting. | — |
| **Prayers** | The estate's observances, when they are the estate's to share. | — |

Six subjects have nothing in them, and that is not an oversight. The
estate does not currently log bees, fermentation, prayers, the lunar
rhythm, the herd's daily life or lab results in a form the gateway
carries. Inventing a mapping so a subject is not empty would be the feed
deciding what the estate did.

## Never published

- Worker briefings, meetings, instructions and action plans.
- Attendance, payroll, labour headcounts, anything personal about staff.
- Administrative activity.
- Planned work written up as though it had happened.
- Anything the gateway marks *possible* or *reference* rather than actual.
- Anything marked missed, pending, planned, scheduled, cancelled,
  instructed, in progress or at risk.
- Low-confidence or unreviewed records. *(Configurable; the bar is 0.90.)*
- Records carrying an unresolved warning about their own reliability.
- A duplicate, or a trivial variation, of something already on the page.
- An empty card produced only because a scheduled run happened.
- The exact location of a vulnerable species.
- Anything that would embarrass or expose a worker.
- Ecological, scientific or sustainability claims Aura has not measured.
- Any name, time, place, quantity or explanation not in the estate record.
- Internal file paths, source documents, row numbers or anything else
  about how the sausage is made.

## Setbacks

Bad news is not automatically suppressed. Credibility is not the same as
only ever publishing good days, and a feed that has never once recorded a
loss is not a feed anyone should believe.

A setback is publishable when it is **verified**, **consequential**,
**safe to disclose**, and **accompanied by what was done about it or
learned from it**. A row saying five plants died is not a story. The same
row, with the response, is.

## Names

Three people are cleared to be named on the site: **Pulkit**, **Rao** and
**Chander**. That decision lives in
`docs/editorial/open-questions.md` §4 and Aura Live follows it.

Anyone else who appears in a *Done By* column becomes **"Aura's estate
team"** — and only where the record establishes that it was estate work.
Where it does not, the actor is left out rather than guessed at.

**Team credits are different and are kept.** "Sadananda's Team" is how the
estate's own People column credits a crew, and crediting a crew is not the
same act as publishing an individual's name against their work.

Free text gets the same treatment. Every run builds the roster of estate
personnel from the record itself, so a name in a note — *"Nayana corrected
this to 410"* — costs the note, and a name in a headline or body kills the
card. A new worker is protected the first time they are logged, not the
first time somebody remembers to add them to a list.

*(The cleared list is configurable: `AURA_LIVE_CLEARED_NAMES`.)*

## Sensitive wildlife

Some species are worth more to a poacher than to a reader. For those, the
**sighting is published and the block is not**.

The default list covers gaur, elephant, tiger, leopard, pangolin,
hornbill, orchids, slender loris, civet, python and king cobra. It is
configurable — which taxa are sensitive is an ecologist's judgement and it
changes: `AURA_LIVE_SENSITIVE_TAXA`.

## Voice

Calm, observant, precise, warm, quietly confident. The land speaking
through evidence.

Never: announcements, exclamation marks, "exciting news", "our amazing
team", claims Aura has not measured, scientific language where plain
language works, the same sentence shape on every card, or routine work
written up as an achievement.

Good, as a register — not as text to reuse:

> A green vine snake was observed in Mudigere this evening.

> Sadananda's team applied 124 litres of buttermilk preparation across
> 5.48 acres in Block 3.

> Coffee in Block 2 has entered fruiting, marking the next stage of this
> season's crop.

## Photographs

A card uses the estate's own photograph of the event whenever one exists
and is approved.

When none exists, it may use a picture from **Aura's visual archive** —
and it says so, on the picture and in the evidence panel. No reader should
ever be able to mistake an archive photograph for evidence of the event.
The same card always shows the same picture.

## Numbers

Every figure is quoted as the estate wrote it, unit included. Nothing is
converted, summed or recalculated.

Three batches of 200 litres are published as *three batches, 200 litres
each* — never as 600 litres, because nobody wrote 600 down.

**Rainfall is currently withheld.** The rainfall sheet records one number a
day and never says what it measures. 3.32 could be inches or millimetres,
and those are two completely different Augusts. When somebody confirms the
unit, one setting turns rainfall on: `AURA_LIVE_RAINFALL_UNIT`.

## When something is chosen over something else

Every eligible event is scored, and only what clears the bar is published.
The score is never shown to a reader. It rewards public interest, how
directly the event speaks to what Aura is, the strength of the evidence,
whether there is a real photograph, novelty and specificity. It penalises
naming an individual, sensitive subjects, setbacks that need their
context, and repetition — the same category filling the page, the same
subject twice, or the same work in the same place on the same day.

Every score is stored with the sentences explaining it, so "why is that
card there?" has an answer six months later.

## The publishing rhythm

The estate publishes in two windows, Mudigere time:

- **06:00 – 10:00**
- **15:00 – 19:30**

The job looks for new events every thirty minutes inside those windows and
exits quietly outside them. Both windows are configurable:
`AURA_LIVE_WINDOWS`.

Because the estate record is typed up in batches, **most runs will find
nothing.** That is the system working.

## The settings, in one place

| Setting | Default | What it does |
|---|---|---|
| `AURA_LIVE_WINDOWS` | `06:00-10:00,15:00-19:30` | when the feed may publish |
| `AURA_LIVE_MIN_CONFIDENCE` | `0.9` | how sure the gateway must be |
| `AURA_LIVE_REVIEW_STATUSES` | `reviewed,approved` | which review states count |
| `AURA_LIVE_MIN_SCORE` | `8` | the editorial bar |
| `AURA_LIVE_MAX_PUBLISH_PER_RUN` | `6` | cards per run |
| `AURA_LIVE_MAX_PER_CATEGORY_PER_RUN` | `2` | cards per category per run |
| `AURA_LIVE_MAX_FEED_ENTRIES` | `60` | how long the page is |
| `AURA_LIVE_STALE_AFTER_MINUTES` | `180` | when the page stops calling itself live |
| `AURA_LIVE_CLEARED_NAMES` | `Pulkit,Rao,Chander` | who may be named |
| `AURA_LIVE_SENSITIVE_TAXA` | gaur, elephant, … | whose location is withheld |
| `AURA_LIVE_RAINFALL_UNIT` | *(empty)* | turns rainfall on, once the unit is known |

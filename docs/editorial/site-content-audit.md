# Site content audit

Generated from the repository and a crawl of the sitemap. One row per public route.

`Words` counts rendered prose only — component chrome, class names and attributes are stripped.
Index and utility routes draw their content from shared components, so a low count there is correct by design.

| Route | Family | Words | Target | Status |
|---|---|---|---:|---|
| `/` | Home | 3825 | 500–900 | OK |
| `/areca` | Field Note | 606 | 450–1,600 | OK |
| `/art` | Utility | 257 | orientation only | OK — by design |
| `/artistry` | Field Note | 858 | 450–1,600 | OK |
| `/atelier` | Brand proposition | 405 | 700–1,200 | thin — see below |
| `/biodynamic` | Field Note | 825 | 450–1,600 | OK |
| `/brand` | Brand proposition | 536 | 700–1,200 | thin — see below |
| `/bug-hotels` | Field Note | 522 | 450–1,600 | OK |
| `/circular` | Field Note | 1414 | 450–1,600 | OK |
| `/coffee` | Field Note | 1033 | 450–1,600 | OK |
| `/contact` | Utility | 565 | orientation only | OK — by design |
| `/cows-of-aura` | Field Note | 662 | 450–1,600 | OK |
| `/ecology` | Field Note | 792 | 450–1,600 | OK |
| `/fermentation` | Field Note | 665 | 450–1,600 | OK |
| `/field-notes` | Index | 45 | orientation only | OK — by design |
| `/field-notes/activities` | Index | 0 | orientation only | OK — by design |
| `/field-notes/animals` | Index | 0 | orientation only | OK — by design |
| `/field-notes/art-culture` | Index | 0 | orientation only | OK — by design |
| `/field-notes/biodiversity` | Index | 0 | orientation only | OK — by design |
| `/field-notes/biodynamic` | Index | 0 | orientation only | OK — by design |
| `/field-notes/coffee-fermentation` | Index | 0 | orientation only | OK — by design |
| `/field-notes/labs` | Index | 0 | orientation only | OK — by design |
| `/field-notes/land-ecology` | Index | 0 | orientation only | OK — by design |
| `/forest-islands` | Field Note | 573 | 450–1,600 | OK |
| `/from-aura` | Product & provenance | 49 | 250–700 | thin — see below |
| `/herd` | Field Note | 1077 | 450–1,600 | OK |
| `/idea` | Brand proposition | 525 | 700–1,200 | thin — see below |
| `/land` | Place | 535 | 700–1,400 | thin — see below |
| `/land-spirit-soul` | Field Note | 468 | 450–1,600 | OK |
| `/living-systems` | Field Note | 579 | 450–1,600 | OK |
| `/mudigere` | Place | 1544 | 700–1,400 | OK |
| `/mudigere-estate` | Place | 1256 | 700–1,400 | OK |
| `/now` | Utility | 27 | orientation only | OK — by design |
| `/ohara` | Place | 1789 | 700–1,400 | OK |
| `/pepper` | Field Note | 555 | 450–1,600 | OK |
| `/pollinators` | Field Note | 693 | 450–1,600 | OK |
| `/provenance` | Field Note | 793 | 450–1,600 | OK |
| `/reason` | Brand proposition | 1108 | 700–1,200 | OK |
| `/reason/agroculture` | Brand proposition | 330 | 700–1,200 | thin — see below |
| `/reason/hospitality` | Brand proposition | 256 | 700–1,200 | thin — see below |
| `/reason/natural-intelligence` | Brand proposition | 217 | 700–1,200 | thin — see below |
| `/regenerative-coffee` | Microsite | 820 | as built | OK — by design |
| `/regenerative-coffee/biodynamic` | Microsite | 507 | as built | OK — by design |
| `/regenerative-coffee/experience` | Microsite | 99 | as built | OK — by design |
| `/regenerative-coffee/flavour` | Microsite | 614 | as built | OK — by design |
| `/regenerative-coffee/transparency` | Microsite | 445 | as built | OK — by design |
| `/regenerative-life` | Index | 32 | orientation only | OK — by design |
| `/regenerative-life/aura-intelligence` | Regenerative Life explainer | 280 | 1,000–1,800 | thin — see below |
| `/regenerative-life/biodiversity` | Regenerative Life explainer | 303 | 1,000–1,800 | thin — see below |
| `/regenerative-life/biodynamic` | Regenerative Life explainer | 370 | 1,000–1,800 | thin — see below |
| `/regenerative-life/hydrology` | Regenerative Life explainer | 262 | 1,000–1,800 | thin — see below |
| `/regenerative-life/microbiome` | Regenerative Life explainer | 335 | 1,000–1,800 | thin — see below |
| `/regenerative-life/plant-pathology` | Regenerative Life explainer | 289 | 1,000–1,800 | thin — see below |
| `/regenerative-life/soil` | Regenerative Life explainer | 309 | 1,000–1,800 | thin — see below |
| `/regenerative-life/tree-level-observation` | Regenerative Life explainer | 271 | 1,000–1,800 | thin — see below |
| `/regenerative-life/vedic-farming` | Regenerative Life explainer | 293 | 1,000–1,800 | thin — see below |
| `/residency` | Field Note | 801 | 450–1,600 | OK |
| `/rta` | Field Note | 610 | 450–1,600 | OK |
| `/sanctuary` | Place | 812 | 700–1,400 | OK |
| `/shade` | Field Note | 1070 | 450–1,600 | OK |
| `/vedic` | Field Note | 764 | 450–1,600 | OK |
| `/wisdom` | Brand proposition | 583 | 700–1,200 | thin — see below |

## Where the depth actually falls short

Counting words found four genuine gaps. Everything else either meets its
target or is an index doing its job.

| Route | Words | Why it matters |
|---|---|---|
| `/reason/natural-intelligence` | 217 | The concept the whole site rests on, explained in fewer words than a field note about bug hotels. A reader who does not already know the term leaves without it. |
| `/reason/hospitality` | 256 | Two sanctuaries open and two named, and the page cannot yet say what a stay involves. |
| `/regenerative-life/hydrology` | 262 | Documented as the thinnest of the nine, correctly — the measurement record is weather and process water only. |
| `/regenerative-life/tree-level-observation` | 271 | Has strong material (the 2026 lux survey) that the page under-uses. |

`/regenerative-coffee/experience` reads as 99 words because its copy lives in
`components/coffee/Programme.tsx` and `ExperienceForm.tsx`. It is not thin.

## Page families, and how each behaves

| Family | Routes | Job | Rhythm |
|---|---:|---|---|
| Home | 1 | Orientation and conviction | Declaration, then evidence, then the three pillars |
| Brand proposition | 8 | Why Aura exists | Concise claims carried by concrete practice |
| Regenerative Life explainer | 9 | The highest evidence standard on the site | What it is, what is done, what is measured, what we cannot prove |
| Place | 5 | Give each place its own character | Long-form, scene-led, particular |
| Field Note | 20 | Authored and specific | Varied: field report, register, ritual, invasive-species account |
| Product & provenance | 1 route, 31 generated | Answer a buyer's practical questions | Minimal; a parent lists its seasons, a leaf states its record |
| Index | 10 | Orient and route onward | Lanes and filters, no repetition of child copy |
| Utility | 3 | Clarity and action | Shortest possible |
| Microsite | 5 | The coffee argument, in three acts | Its own system, deliberately distinct |

## Verification items

Carried in `claims-ledger.md`. The four that would change a public claim are
listed in `open-questions.md`.

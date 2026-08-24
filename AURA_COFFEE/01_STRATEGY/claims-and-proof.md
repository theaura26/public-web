# Claims and Proof
## Aura Regenerative Coffee — publishing control document

**Rule:** if a claim is not green in the *Publish?* column, it does not appear in the microsite, the keynote, the film, or on a bag.

**Source note.** Every claim below was extracted from Aura's own published site (this repository, `theaura.life`). That makes the site a *statement* of the claim, not evidence for it. Where the underlying record has not been seen, the claim is marked `[NEEDS PROOF]` even though it is already public. Several claims currently live on the site should be corrected — those are flagged **⚠ FIX LIVE SITE**.

**Classification key**

| | |
|---|---|
| **FACT** | An observation with a record behind it. Publishable as stated. |
| **INTERPRETATION** | A reading of facts. Publishable if framed as a reading, with the word *estimate*, *we read*, or *our own measurement*. |
| **AMBITION** | Not yet true. Future tense only. Never present tense. |
| **MARKETING** | Language, not measurement. Fine as voice; never as evidence. |

---

## A. THE LAND

| Claim | Evidence | Source | Status | Publish? |
|---|---|---|---|---|
| 150 acres at Sampigekhan Estate, Mudigere, Chikmagalur district, Karnataka | Estate record | `app/land`, `app/mudigere-estate` | FACT | ✅ Yes |
| 3,600 ft altitude | Estate record | `app/land` | FACT | ✅ Yes |
| Red laterite soil, pH 6.0–6.5 | Estate soil tests `[NEEDS PROOF]` — attach a lab report | `app/land`, `app/coffee` | FACT | ✅ Yes |
| 40–100 in annual rainfall; 14–30 °C; 58% humidity | Estate weather station at 3,600 ft | `app/land`, `app/provenance` | FACT | ✅ Yes |
| 35,000 trees across the estate | Tree count/tagging record `[NEEDS PROOF]` — confirm the count is complete, not estimated | `app/land` | FACT if counted, INTERPRETATION if estimated | ⚠ Verify first |
| 100 acres shade-grown coffee; 32 acres tea | Estate record | `app/land` | FACT | ✅ Yes |
| Four-story canopy: emergent / canopy / understory / ground | Estate record, tree tagging | `app/shade` | FACT | ✅ Yes |
| "The Western Ghats — one of the world's recognised biodiversity hotspots, 7,000+ plant species" | Published ecological literature `[NEEDS SOURCE]` — cite Myers et al. or the Western Ghats WHS listing | `app/land` | FACT (external) | ✅ Yes, once cited |
| **"UNESCO biodiversity zone"** as an estate attribute | The Western Ghats World Heritage Site is a *serial* property of 39 discrete components. Being in the region ≠ being inside an inscribed component. | `app/land`, `app/coffee` DataCards | ⚠ **MARKETING dressed as FACT** | ❌ **No — rewrite.** Say: *"in the Western Ghats, a UNESCO World Heritage region."* Never *"our estate is UNESCO-designated."* **⚠ FIX LIVE SITE** |
| **"World's Oldest Arabica Region, Rediscovered"** | Arabica's centre of origin is Ethiopia; Yemen precedes India by centuries. The Baba Budan story dates Indian coffee to the 17th century — old for India, not oldest in the world. | `app/page.tsx` | ⚠ **FACTUALLY WRONG** | ❌ **No.** Rewrite as: *"Where Indian coffee began."* **⚠ FIX LIVE SITE** |
| Coordinates 13.1365°N, 75.6403°E | Estate record | `app/land` | — | ⚠ **Conflict** |
| Coordinates 13.168594, 75.433983 | Estate map embed | `app/mudigere-estate` | — | ⚠ **Conflict** — the two differ by ~23 km. `[NEEDS PROOF]` Confirm one, correct the other. **⚠ FIX LIVE SITE** |

---

## B. THE HERD

| Claim | Evidence | Source | Status | Publish? |
|---|---|---|---|---|
| 52 Malnad Gidda cattle | Herd register, per-animal ear tags | `app/herd` | FACT | ✅ Yes |
| Malnad Gidda is an indigenous Karnataka breed adapted to these hills | Breed literature `[NEEDS SOURCE]` — cite the Karnataka Veterinary University / NBAGR breed registry | `app/herd` | FACT (external) | ✅ Yes, once cited |
| "Their gut microbiome is shaped by this land, so their dung carries a microbial signature native to it" | No metagenomic comparison against another breed on record | `app/herd`, `app/circular` | **INTERPRETATION** | ⚠ Publish only as a reading: *"we keep an indigenous breed because we believe the microbiome follows the ground it grazes."* Not as demonstrated fact. `[NEEDS PROOF]` |
| "A commercial dairy breed cannot replicate it" | No comparative study | `app/herd` | **AMBITION / assertion** | ❌ No. Remove or downgrade. **⚠ FIX LIVE SITE** |
| Per-animal passport: health, milk, urine logged daily; dung logged per herd each morning | Herd records | `app/herd` | FACT | ✅ Yes |
| GPS grazing tags | Explicitly "ordered, on their way" | `app/herd` | **AMBITION** | ⚠ `[FUTURE]` tense only |
| The herd grazes the same 150 acres, kept pesticide-free and chemical-free | Estate practice record `[NEEDS PROOF]` — a signed no-input declaration per block would settle it | `app/herd` | FACT | ✅ Yes |
| A cow was attacked by a leopard inside the farm and survived | Estate account, first-hand | `app/herd` | FACT (anecdote) | ✅ Yes — attribute to the person who saw it |
| Estate-bred, line kept pure | Breeding records `[NEEDS PROOF]` | `app/herd` | FACT | ⚠ Verify |

---

## C. THE LOOP — PREPARATIONS AND FERTILITY

| Claim | Evidence | Source | Status | Publish? |
|---|---|---|---|---|
| ~154,000 litres of Jeevamrit brewed per year | Stock registers, batch numbering | `app/circular` | FACT | ⚠ `[NEEDS PROOF]` Confirm actual vs planned volume, and which year |
| ~2,420 kg of CPP per year across 14 numbered pits | Pit numbering, batch records | `app/circular` | FACT | ⚠ Same — confirm actual vs planned |
| Barrels stirred ~45 min daily, vortex and reverse | Daily practice, worker logs | `app/circular` | FACT | ✅ Yes |
| CPP matured 90 days; preparations run 60–90 day cycles | Batch records | `app/circular` | FACT | ✅ Yes |
| BD 500–508 and the Vedic set (Jeevamrit, Panchgavya, Beejamrit, CPP, Kunapjal) are prepared and applied | Application logs | `app/biodynamic` | FACT | ✅ Yes |
| Every batch tested before and after — pH, EC, microbial colony counts, *Trichoderma*, *Pseudomonas* | Estate lab records | `app/circular`, `app/biodynamic` | FACT | ⚠ `[NEEDS PROOF]` Attach one real lab report. This is the keystone proof of the entire brand |
| "No untested material touches the soil." A failing batch is corrected or held | Practice + lab records | `app/circular` | FACT | ✅ Yes — **strongest single claim in the system** |
| Block retested 90 days after application, cross-referenced to the batch | Soil test records | `app/circular`, `app/biodynamic` | FACT | ⚠ `[NEEDS PROOF]` Attach one before/after pair |
| "Nothing is bought in and nothing leaks out" | Estate practice | `app/circular` | FACT for fertility | ⚠ Precision required. True of **fertility**. Not true of the estate as a whole — fuel, tools, packaging, labour all come in. Publish as *"we don't buy fertility."* |
| Heavy metals and pathogens tested at an external lab | External lab reports `[NEEDS PROOF]` | `app/biodynamic` | FACT | ⚠ Attach the report |
| "The lunar charts and the talk of the earth breathing are poetry… we keep these preparations for the biology" | Aura's own published position | `app/biodynamic`, `app/fermentation` | FACT (position) | ✅ **Yes — protect this. Do not soften it.** |
| AAT chromatography as BD soil vitality imaging | Estate practice | `app/biodynamic` | INTERPRETATION — chromatography is a qualitative indicator, not a validated metric | ⚠ Publish as a practice, never as evidence of an outcome |

---

## D. THE CANOPY AND LIGHT

| Claim | Evidence | Source | Status | Publish? |
|---|---|---|---|---|
| CCRI light targets — Arabica 50,000–70,000 lux; Robusta 70,000–90,000 | CCRI agronomic standards `[NEEDS SOURCE]` — cite the CCRI publication | `app/shade` | FACT (external) | ✅ Yes, once cited |
| 2026 pre-monsoon illuminance survey: 5 clusters × 10 readings = 50 observations/acre | Survey record, two digital lux meters | `app/shade` | FACT | ✅ Yes |
| Block 3 (Byton Patte) 2026: Zone A ~33,000 · Zone B ~62,000 · Zone C ~82,000 lux | Survey data | `app/shade` | FACT | ✅ Yes |
| ~80 acres whiskered in the May–June 2026 window; 11 loppers, 10 choppers | Operation record | `app/shade` | FACT | ✅ Yes |
| Named surveyors: Nayana and Jagadeshwari, forestry interns | Estate record | `app/shade` | FACT | ⚠ Get written consent before naming individuals in published work |
| "Blocks held at 65–75% canopy cup measurably better" | Aura's own cupping vs canopy readings `[NEEDS PROOF]` — needs the dataset | `app/shade` | **INTERPRETATION** | ⚠ Publish as *"our own readings show…"*, never as a general agronomic law |
| Canopy vitality tracked by satellite (NDVI) quarterly | Satellite subscription + records `[NEEDS PROOF]` | `app/shade`, `app/provenance` | FACT | ⚠ Verify it is running |
| Every major cut sealed with cow pat preparation and turmeric | Practice | `app/shade` | FACT | ✅ Yes |

---

## E. THE COFFEE

| Claim | Evidence | Source | Status | Publish? |
|---|---|---|---|---|
| Arabica Sln.9 and Sln.795 | Planting records | `app/coffee` | FACT | ✅ Yes |
| Six micro-lots, one harvest, six processing methods | Wet mill records | `app/coffee` | FACT | ✅ Yes |
| Per-lot figures — harvest kg, immature kg, floats kg, Brix, water TDS, ferment hours, drying days | Wet mill logs | `app/coffee` | FACT | ⚠ `[NEEDS PROOF]` Confirm the harvest year. Currently undated on the live site — **add the year.** |
| Minimum 95% ripeness at pick; all floats removed; ferment ends at pH 4.2 | Protocol + logs | `app/coffee` | FACT | ✅ Yes |
| pH read every 15 min; temperature 3×/day; Brix at start, middle, end | Ferment logs | `app/coffee`, `app/fermentation` | FACT | ✅ Yes |
| Temperature pattern 21 °C morning / 32 °C afternoon / 18 °C night | Ferment logs | `app/coffee` | FACT | ✅ Yes |
| Tasting notes — blueberry, fig, raisin (Dry Osmosis); honey, caramel, nut (Red Honey) | Estate cupping | `app/coffee` | **INTERPRETATION** (sensory) | ✅ Yes — attribute: *"our cupping table calls it…"* |
| "Liquid Gold" named at its first public tasting | Event record | `app/coffee` | FACT | ✅ Yes |
| **"80+ SCA"** | Listed on the live site as a **cupping target** | `app/coffee` DataCard | **AMBITION** | ❌ **Never publish as an achieved score.** Say *"our target is 80+"* or publish an actual third-party score. `[NEEDS PROOF]` |
| Screen grading and defect analysis per SCA protocol | Lab practice | `app/coffee` | FACT | ✅ Yes |
| Wild yeasts (*Pichia*, *Hanseniaspora*) and lactic-acid bacteria drive the ferment | Published fermentation science `[NEEDS SOURCE]` — cite | `app/coffee` | FACT (external) | ✅ Yes, once cited |
| "We have watched every step of it happen" | Implies on-estate microbial identification | `app/coffee` | **INTERPRETATION** | ⚠ Unless Aura has run its own metabarcoding, soften to *"we track it hour by hour."* `[NEEDS PROOF]` |
| **Solera carry-forward holds a house culture across seasons** | Aura states plainly that this is unproven and untested | `app/coffee` | **AMBITION, honestly labelled** | ✅ **Yes — publish exactly as Aura already words it.** This is a brand asset, not a weakness |
| "Altitude and variety set the ceiling; the ferment decides how much of it the cup reaches" | Aura's own position | `app/coffee` | INTERPRETATION | ✅ Yes |

---

## F. TRACEABILITY AND THE RECORD

| Claim | Evidence | Source | Status | Publish? |
|---|---|---|---|---|
| Nine data streams, each on its own clock | System record | `app/provenance` | FACT | ✅ Yes |
| Every human event signed by the person who did it, from the field | Event log | `app/provenance` | FACT | ✅ Yes |
| Example record: *BD 501, Block 07, 06:14, waning moon, humidity 78%, by Raju, dung batch G-03* | Event log | `app/provenance` | FACT | ✅ Yes — the single best proof artefact available |
| Records held in plain JSON and CSV | System architecture | `app/provenance` | FACT | ✅ Yes |
| QR on every 30 kg GrainPro bag opens the lot page | Packing practice | `app/provenance` | FACT | ⚠ `[NEEDS PROOF]` Is a live lot page published? If not, this is `[FUTURE]` |
| **"Milestones are written to chain — permanent, public, verifiable"** | No chain named. No contract address. No explorer link. No verifier a buyer can click. | `app/provenance` | **AMBITION presented as FACT** | ❌ **No.** Either publish a public verification link, or restate as `[FUTURE]`. **⚠ FIX LIVE SITE** |
| **"The BD seasonal cycle is sealed on the blockchain as a permanent, verifiable event"** | Same — unverifiable as published | `app/biodynamic` | **AMBITION presented as FACT** | ❌ **No.** Same remedy. **⚠ FIX LIVE SITE** |
| **"Organic and biodynamic certification evidence becomes tamper-evident"** | Implies a certification process exists | `app/biodynamic` | **AMBITION** | ❌ No — see section H |
| Plant-level ID: a CPP ball is logged to an individual plant | Plant ID system | `app/circular` | FACT | ⚠ `[NEEDS PROOF]` Confirm coverage — all plants, or a pilot block? |

**The fix for the traceability pillar is not to say less. It is to publish one thing:** a single real lot page, complete, at a public URL. That one asset converts the entire pillar from assertion to evidence, and it removes any need to mention a blockchain at all.

---

## G. ECOLOGY AND CARBON

| Claim | Evidence | Source | Status | Publish? |
|---|---|---|---|---|
| Soil respiration read monthly (NaOH, 0–15 cm); earthworms counted quarterly in a 50 × 50 cm quadrat; mycorrhizal colonisation annually | Monitoring protocols | `app/ecology` | FACT if running | ⚠ `[NEEDS PROOF]` Confirm which programmes are **live** vs **designed** |
| Fourteen monitoring programmes rolled into an Ecological Health Index, 0–100 per block | Index design | `app/ecology` | ⚠ Likely **AMBITION in part** | ⚠ Do not imply full estate coverage until every block has a scored index with a date. `[NEEDS PROOF]` |
| Forest islands: 5 m × 1 m × 60 cm, five layers, CPP-inoculated, unmaintained | Build record | `app/ecology` | FACT | ⚠ Confirm how many exist |
| Woody biomass cut to 60–90 cm and retained in-block; decay class I–V logged | Practice + records | `app/ecology` | FACT | ✅ Yes |
| **"3–5× carbon vs monoculture coffee"** (also stated as **4–5×**) | An estimate. Two different figures appear across the site. No methodology published. | `app/land`, `app/coffee`, `app/provenance` | **INTERPRETATION** | ⚠ **Pick one figure, publish the method, and always use the word *estimated*.** The inconsistency is the bigger problem. **⚠ FIX LIVE SITE** |
| **"500–1,000 t CO₂ credit potential per year"** | Potential, unverified, unissued | `app/land` | **AMBITION** | ❌ Not in consumer or trade communication. Investor material only, labelled *potential* |
| "35,000 trees on chain over time" | — | `app/land` | **AMBITION** | ⚠ `[FUTURE]` tense only |

---

## H. CERTIFICATION — THE HARD LINE

| Claim | Reality | Publish? |
|---|---|---|
| Aura is **certified organic** | No certificate on record. The 32-acre tea block is described as *"in organic transition targeting 2027"*, which confirms the estate is **not** currently certified. | ❌ **Never** |
| Aura is **certified biodynamic** (Demeter or equivalent) | No certificate on record | ❌ **Never** |
| Aura **practises** biodynamic and Vedic agriculture | Extensive practice records | ✅ Yes |
| Aura **farms without synthetic pesticides and chemicals** | Estate practice `[NEEDS PROOF]` — a signed per-block input declaration would make this airtight | ✅ Yes, with the declaration |
| Tea block in organic transition, targeting 2027 | Stated ambition with a date | ✅ Yes, as ambition with the date attached |

**Safe formulation, approved for all channels:**
> *Aura is not certified organic or biodynamic. It practises both, and publishes the record instead.*

That sentence is stronger than a certificate. It should be used deliberately, not hidden.

---

## I. LANGUAGE THAT IS MARKETING, NOT EVIDENCE

Fine as voice. Never presented as proof, never footnoted, never placed next to a number as though it were one.

| Line | Verdict |
|---|---|
| "One remarkable circle." | ✅ Signature |
| "The forest is the farm." | ✅ True enough to publish, poetic in register |
| "The cup is evidence." | ✅ Voice |
| "Coffee is agricultural memory made drinkable." | ✅ Voice |
| "The herd is biological infrastructure." | ✅ Voice |
| "A ledger cannot forget, and it cannot flatter." | ✅ Voice — attributed to Arvind |
| "Natural Intelligence" | ✅ Aura's own term. Define once on first use, then leave it alone |
| "We farm for the next hundred years." | ✅ Voice — an intention, not a forecast |
| "The land gets the better deal." | ✅ Voice — the best headline available |

---

## J. THE ACTION LIST

Ordered by how much each one unlocks.

1. **Publish one complete lot page at a public URL.** Converts the whole transparency pillar from claim to evidence. Removes the need to mention a blockchain.
2. **Attach one real lab report** — a preparation batch, tested before and after. The keystone proof.
3. **Attach one soil before/after pair** at 90 days for a single block.
4. **Get a third-party cupping score.** Until then, 80+ is a target and must be worded as one.
5. **Fix the two coordinate sets.** One of them is wrong.
6. **Fix "World's Oldest Arabica Region."** It is not true.
7. **Fix "UNESCO biodiversity zone"** as an estate attribute.
8. **Resolve 3–5× vs 4–5× carbon**, publish the method, and always say *estimated*.
9. **Restate every blockchain claim** as `[FUTURE]` until a public verification link exists.
10. **Date the six lot files.** Which harvest?
11. **Confirm which of the fourteen ecological programmes are running**, and how many blocks carry a scored index.
12. **Written consent** from every named individual before publication.

# Microsite — Information Architecture
## theaura.life/regenerative-coffee

**The page is the card, built at full size.** The founder's handwritten card carries the whole architecture — a title, a question, a definition, three underlined words, and an answer. The page enlarges that, using theaura.life's journal kit and nothing else.

---

## WHERE IT SITS

It is a page on `theaura.life`, not a separate microsite. It inherits the site's navbar, its theme toggle, its agent view, and its footer, and it ends with the kit's `<Continue>` block pointing at the journals that go deeper.

```
theaura.life
  └── /regenerative-coffee        ← this page
        ├── → /coffee             the six lots in full
        ├── → /circular           the fertility loop
        └── → /herd               the herd
```

**No sub-pages.** The original concept proposed `/lots` and `/experience` as utility pages. Both were cut: `/coffee` already carries the full lot data, and the Experience is three paragraphs and an email address, which does not need its own URL.

---

## THE PAGE, BLOCK BY BLOCK

Nine sections — inside the kit's 6–9 rule.

```
  HeroBanner            "Regenerative Coffee" · coffee blossom
                        caption: coffee that leaves the land better than it found it

  ══ THE QUESTION ═══════════════════════════════════════════
  OneCol                Is that a thing?
                        the definition, and the three words

  ══ BIODYNAMIC ═════════════════════════════════════════════
  TwoCol   #biodynamic  Grown in a closed loop
                        └ DataGrid · six estate facts
  Placeholder           the herd, on their own ground
  TwoCol   #herd        Our best farmers have four legs
  TwoCol   #loop        Nothing comes in. Nothing leaves.
  SpecTable             the fertility programme, a year
  Placeholder           dung and urine, at dawn
  TwoCol   #light       Measure first. Prune later. Validate afterwards.
  SpecTable             Block 3 · Byton Patte · 2026
  PullQuote             cut too much / cut too little

  ══ TRANSPARENT ════════════════════════════════════════════
  TwoCol   #transparent Written down as it happens
  Placeholder           counted in every batch
  TwoCol   #unproven    And here is what we don't know
  PullQuote             a ledger cannot forget          — Arvind

  ══ FLAVOURFUL ═════════════════════════════════════════════
  TwoCol   #flavourful  Six lots. One harvest.
  DataGrid standalone   the six lots, 3-up tile mode
  TwoCol   #ceiling     The honest half of the story

  ══ CLOSE ══════════════════════════════════════════════════
  ScrollHighlight       …Yes, it is. / One remarkable circle.
  TwoCol   #experience  Three months. Three different estates.
                        └ DataGrid · September / December / January
  OneCol   #closing     Yes, it is. — invitation, and the certification line
  Continue              /coffee · /circular · /herd
```

**Section ids are anchors, not navigation.** They exist so the deck, the film and outbound email can deep-link a specific movement. Nothing on the page renders a menu from them.

---

## THE THREE MOVEMENTS

The card's three words are the page's three movements, in the order the argument needs them. They appear as `<TwoCol>` headings, not as a nav bar.

| Movement | Sections | The job |
|---|---|---|
| **Biodynamic** | land · herd · loop · light | Make a closed loop feel inevitable, not idealistic |
| **Transparent** | the record · what we can't prove | Turn *charming* into *real* |
| **Flavourful** | six lots · the ceiling | Make them want to taste it |

**"One remarkable circle" appears exactly once**, in the closing `<ScrollHighlight>`. It is the takeaway, and a takeaway used early is just a strapline.

---

## HOW PROOF IS CARRIED

The kit already had the answer, so the page uses it rather than inventing a drawer.

| Kind of proof | Block |
|---|---|
| A number that changes how a sentence lands | `<DataGrid>` stat cards, inside the `<TwoCol>` body |
| A set of related figures | `<SpecTable>` — fertility programme, lux survey |
| A term the reader may not know | `<Term>` tooltip, **first occurrence only** |
| The full file | A link out to `/coffee` via `<Continue>` |

**What is deliberately not on this page:** cupping scores (there is no third-party score yet), any on-chain claim (nothing publicly verifiable exists), and the harvest year on the lot data (not yet confirmed). See [claims-and-proof.md](../01_STRATEGY/claims-and-proof.md).

**The one line that does the most work** sits in the closing block, plainly, with no styling:

> Aura is not certified organic or biodynamic. It practises both, and publishes the record instead.

---

## DIVISION OF LABOUR WITH THE JOURNALS

| Content | This page | The journal |
|---|---|---|
| The proposition | ✅ Owns it | Referenced |
| Six lots, summarised | ✅ | ✅ `/coffee` |
| Six lots, full data | Linked | `/coffee` |
| The herd | One section | `/herd` — full |
| The fertility loop | One section + SpecTable | `/circular` — full |
| Canopy and lux survey | One section + SpecTable | `/shade` — full |
| Ecology and health index | Not present | `/ecology` |
| Fermentation science | Two sentences | `/fermentation` |
| The record architecture | One section | `/provenance` |

**The rule:** this page states, the journals explain. If a section starts explaining, cut it and link.

---

## INHERITED BEHAVIOUR

None of this needed page-specific code.

- **Responsive** — the kit's blocks handle every breakpoint; `--section-gap` tightens ~25% below 768px
- **Day / night** — works in both, because nothing hard-codes a colour
- **Agent view** — `data-view="agent"` flattens the page to monospace prose at 720px, with semantic headings intact
- **Reduced motion** — all animation collapses to ~0ms; the page reads completely
- **Video** — poster-first, `preload="none"`, playing on intersection (the Solera lot card)

---

## THE ONE THING THAT WOULD MAKE THIS PAGE BETTER

**A published lot file at a public URL.**

The *Transparent* movement currently describes a record rather than showing one. One real, complete, clickable lot page — block, pick date, method, ferment log, drying, cupping notes — turns the middle third of the argument from assertion into evidence, and makes any mention of a blockchain unnecessary.

Everything else on this page is craft. That is architecture.

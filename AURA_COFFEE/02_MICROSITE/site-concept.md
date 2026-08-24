# Microsite — Experience Concept
## theaura.life/regenerative-coffee

---

## THE IDEA IN FIVE SENTENCES

**The site is the card, built at full size.**

The founder's handwritten card already contains the whole architecture — a title, a question, a definition, three underlined words, and an answer — so the page does not invent a structure, it enlarges one. It opens on the question, defines the promise once, and then spends the rest of the scroll paying for it in three movements named after the card's three words. Every number on the page has a record behind it, and the one claim Aura cannot yet prove gets its own section rather than a footnote. It closes where it started — *yes, it is* — and the only thing it asks anyone to do is write to a named email address.

**It is built entirely from theaura.life's own design system.** Not styled to look like it. Built from it.

---

## WHY ONE LONG SCROLL, NOT FOUR PAGES

The brief offered *Home / Story / Proof / Experience* or a simpler long-scroll. **Take the long scroll.** Three reasons, in order of weight:

**One — the argument depends on sequence.** A four-page site lets the reader take the proof before the story, or the taste before the land. You cannot make someone smile at *"is that a thing?"* if they have already read the lab results. A single scroll is the only architecture that guarantees the order.

**Two — it is how every other Aura long-form page works.** The journals are single scrolls. A four-page microsite would be the only thing on the estate's site that behaves differently, for no reason a reader would notice.

**Three — Aura already has the encyclopedia.** `theaura.life` carries eleven long-form journals — herd, circular, ecology, shade, fermentation, coffee, provenance, land. This page must not be a twelfth. It is the front door: short, confident, and willing to send a curious reader to the deep material rather than duplicating it.

---

## THE SYSTEM

**Tokens from [`app/globals.css`](../../app/globals.css). Blocks from [`JOURNAL_KIT.md`](../../JOURNAL_KIT.md). Nothing else.**

The kit's own rule governs this page: *if the seven blocks don't cover it, the passage gets rewritten to fit them.* That rule held — the page uses no bespoke layout, no local palette, no local type scale, and no custom CSS at all.

**Type.** Bricolage Grotesque for headings, DM Sans for body (`.p1` / `.p2`), DM Mono for labels and data. As [DESIGN-SYSTEM.md](../../DESIGN-SYSTEM.md) §8 sets out.

**Colour.** `--bg`, `--text`, `--text-body`, `--border` and the themed surfaces. `--brand-accent` on the SpecTable label, and nowhere else. Because it never hard-codes a colour, the page works in both day and night.

**Layout.** The journal alignment law — one left rail for every heading, paragraph and caption; centre reserved for `<PullQuote>` and nothing else. Full-bleed `<Placeholder>` images interrupt the column.

**Motion.** Only the kit's own gestures: the `<HeroBanner>` pin and blur-clear, the `<Placeholder>` blur lifting as it centres, the `<ScrollHighlight>` word brightening. Nothing was added.

**Structure.** Nine sections — inside the kit's 6–9 rule. One opener, alternating `<TwoCol>` and `<Placeholder>`, two `<PullQuote>` beats, a `<ScrollHighlight>` declaration, a quiet `<OneCol>` close, `<Continue>` last.

---

## THE THREE MOVEMENTS

The card's three words become the page's three movements, in the order the argument needs them.

| | Movement | What it has to do |
|---|---|---|
| **Biodynamic** | The land, the herd, the loop, the light | Make a closed loop feel inevitable rather than idealistic |
| **Transparent** | The record, and what we can't prove | Convert *this is charming* into *this is real* |
| **Flavourful** | Six lots, the ceiling, the cup | Make them want to taste it |

**"One remarkable circle" appears once**, in the closing `<ScrollHighlight>`. It is a takeaway, and a takeaway used early is just a strapline.

---

## THE THREE READERS, ONE PATH

| Reader | What they do | Where they leave |
|---|---|---|
| **The curious** | Scroll to the bottom, smile twice | Nowhere. They just now like Aura |
| **The interested** | Scroll, hover a `<Term>` or two | A journal, via `<Continue>` |
| **The buyer** | Scroll fast, read the SpecTables | `coffee@theaura.life` |

All three take the same route. No reader is asked to choose a path before they know what the page is.

---

## THE FOUR RULES

**1. Smile before explain.** The page opens on a question, not a proposition. The reader's first act is to answer it in their own head.

**2. Proof sits next to the claim, never on top of it.** Numbers live in `<SpecTable>` and `<DataGrid>`; jargon gets a `<Term>` tooltip on first use only. The prose reads cleanly if a reader ignores every one of them.

**3. Photography carries the estate. Copy carries the idea.** Where an image can do the work, the copy gets out of the way.

**4. Nothing was added to the system to make this page work.** If a moment needed a device the kit doesn't have, the moment was rewritten.

---

## WHAT THIS PAGE IS NOT

- Not a shop. Aura allocates by lot, by hand. There is no cart.
- Not a sustainability report. No pledges, no targets, no UN goals.
- Not a farm tour. The estate journals already do that better.
- Not a second homepage. It answers one question about one product.
- Not a design exercise. It looks like theaura.life because it is theaura.life.

---

## THE MEASURE OF SUCCESS

A roaster reaches the bottom and emails.

Everyone else reaches the bottom and says *huh* — then tells someone about the cows.

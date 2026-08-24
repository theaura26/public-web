# Microsite — Interaction Direction

**The rule that governs this page:** it uses theaura.life's interactions and adds none of its own.

Aura's journal kit already carries a complete, tested motion language — the hero pin, the blur-clear, the word reveal, the glossary tooltip, the hover on the next-reads cards. A page about restraint that ships a second, parallel set of interactions has argued against itself before it loads. So nothing here is new. This document records what the kit does, where it does it on this page, and what was considered and deliberately not added.

---

## WHAT THE PAGE USES

### 1. `<HeroBanner>` — the pin and blur-clear
The banner holds for the first 100vh of scroll. The image lifts from 20px blur and 1.1× scale to sharp and 1× while the title parallaxes up out of frame.

**Where:** the opener, on the coffee blossom.
**Why it earns its place:** it is the site's established way of saying *a long read starts here*, and a reader arriving from any journal already knows the gesture.

### 2. `<Placeholder>` — full-bleed, blur lifting on approach
Full-viewport images that interrupt the reading column, each carrying a bottom-left caption on the section rail. The blur clears as the image centres.

**Where:** three times — the herd, the dung at dawn, the microbes under the lens.
**Why:** it is the only pacing device the page needs. Three full stops in a long scroll.

### 3. `<ScrollHighlight>` — words brightening as they enter
Words begin at 18% opacity and come up as they cross the upper viewport band.

**Where:** once, on the closing declaration that ends *One remarkable circle.*
**Why:** the kit calls it a tone-setter, not a workhorse, and limits it to once or twice a page. Used here for the single moment the page wants read slowly.

### 4. `<Term>` — the glossary tooltip
Dotted underline on the first occurrence of any jargon term; hover or tap gives a short mono explanation. Native `title` keeps it accessible.

**Where:** Malnad Gidda, Jeevamrit, lux, Trichoderma, Pseudomonas, Solera, Brix — first use only, then plain.
**Why:** this is the kit's answer to the problem the proof drawer was invented to solve, and it was already here. A reader who wants the detail gets it; the prose reads cleanly for everyone else.

### 5. `<SpecTable>` and `<DataGrid>` — evidence, held still
No motion. Numbers sit where the sentence needs them.

**Where:** the estate facts, the fertility programme, the lux survey, the six lots, the three months.

### 6. `<Continue>` — the next reads
Three cards with the kit's hover gesture — image blurs, aura glyph fades in.

**Where:** last block on the page, pointing at `/coffee`, `/circular` and `/herd`.

---

## WHAT WAS CONSIDERED AND NOT ADDED

Each of these was designed, and each was cut for the same reason: the system does not have it, and this page is not the place to introduce it.

| Idea | Why it's out |
|---|---|
| **A closing ring** that fills with scroll depth | The best idea in the original concept, and still a bespoke device. If it ever ships it belongs in `globals.css` as a site-wide element, introduced on its own terms — not smuggled in on one page |
| **Proof drawers** — tap a claim, a record unfolds | `<Term>` already does this, and is already learned |
| **A three-pillar sticky nav** | The site has one navbar. A second one on a single page is a different website |
| **An Experience CTA panel** | The page ends with a named email address, which is how this business actually runs |
| **Before/after slider** | Would be excellent, and there is no before image. `[ASSET NEEDED]` |
| **Sound** | Not on a page read at a desk. The film's sound design is where that work belongs |
| **Counting numbers** | 154,000 is impressive because of what made it, not because it moves |

**The one worth revisiting:** the ring. It is the platform's visual idea and it deserves to exist — as an Aura-wide device, designed into the system, not as a one-page ornament.

---

## THE PRINCIPLES THE KIT ALREADY ENFORCES

Inherited, not chosen:

**Reduced motion is a first-class layout.** `globals.css` collapses animation to ~0ms and resets `.reveal` opacity to 1 under `prefers-reduced-motion`. The page works completely with zero motion.

**Agent view.** `data-view="agent"` flattens the whole page to monospace prose at 720px. Because the page is built from kit blocks with semantic headings, this works without a single page-specific rule.

**Video is poster-first**, `preload="none"`, playing on intersection — the pattern already used across every journal.

**Day and night both work**, because nothing on the page hard-codes a colour.

---

## THE FIVE-SECOND TEST

A reader who lands and leaves without scrolling has received:

> **Regenerative Coffee** — *coffee that leaves the land better than it found it.*

A title and a caption, in the banner. That is a complete proposition before a single interaction has fired.

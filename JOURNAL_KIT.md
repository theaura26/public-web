# Journal Design Kit

Two openers, seven blocks, two display utilities. Nothing else.

If a journal needs something not in this kit, the journal is wrong — not the kit. Constraint is the point.

The canonical example is [app/idea/page.tsx](app/idea/page.tsx). If your new journal looks more complicated than that, simplify.

---

## Alignment law

There are exactly **two horizontal positions** anything in a journal can take:

1. **Left rail** — every heading, paragraph, list, image caption, and OneCol block sits on the same left rail (the `.section-w` content edge). This rail is the spine of the page.
2. **Center** — reserved exclusively for `<PullQuote>`. Nothing else uses it.

Pages read like a clean column of writing, with full-bleed images interrupting it and the occasional centered quote as a beat.

---

## Openers — pick one

Every journal starts with **exactly one** opener.

### 1a. `<HeroBanner>` — display opener

Sticky full-screen banner. The reader sees the image clearly at first paint; as they scroll into the sticky stage, the image **blurs and pulls back** (1 → 1.1× scale, 0 → 20px blur) while the title parallaxes **upward** at 30% of scroll-into-wrap. Title is `mix-blend-mode: difference` so the colour inverts against whatever's behind it.

```tsx
<HeroBanner
  currentHref="/wisdom"
  title="Moral Spine"
  type="Portrait · hands"
  caption="Attention as moral choice — Sampigelkhan Estate"
/>
```

- `currentHref` auto-derives the banner image from `lib/journals.ts` — the same thumbnail the navbar and Continue cards use. Pass it on every journal.
- Single-word titles centre; multi-word titles spread edge-to-edge (justify-between) across the section rail. Match the homepage hero spec exactly.
- The banner pins for the first 100vh of scroll, then releases. Title parallaxes up so it rises out of frame as the image blurs.
- Drafting state: drop `src` (or rely on the journal index), pass `type` + `caption` — the slot renders as a grey `#d6d6d6` card with the centered "type · caption" hint.
- A fixed back arrow (`← BACK`) sits top-left across the whole page. Its colour adapts via mix-blend over the banner and switches to `var(--text)` once the reader scrolls past.

### 1b. `<ArticleHero>` — indexed opener

Title on the left rail with a TOC on the right. Use this for long reads where the reader needs to navigate sections — short reads (<800 words) should keep just `title` + `subline`.

```tsx
<ArticleHero
  title="Moral Spine"
  subline="The sentence we return to when the spreadsheet disagrees with the soil."
  toc={[
    { q: 'What is the moral spine?', href: '#spine' },
    { q: 'What does the spine refuse?', href: '#refuse' },
  ]}
/>
```

---

## 2. `<OneCol>` — single left-aligned column

The narrow reading column. Sits on the left rail at the same 760px max-width as `<ScrollHighlight>` — when you place a OneCol of prose above a `<ScrollHighlight>`, they share the same column.

```tsx
<OneCol heading="The Practice">
  <p className="p1">Begin with the ground. Work upward.</p>
  <p className="p2">Plant the tree whose shade you will not sit in.</p>
</OneCol>
```

**`heading` is required.** Orphan prose without a heading is what `<TwoCol>` is for, or `<ScrollHighlight>` if it's a declaration.

---

## 3. `<TwoCol>` — heading left, body right

The workhorse. Heading on the left rail, body in the right column. Both columns are left-aligned within themselves.

```tsx
<TwoCol id="pillars" heading="Sanctuary. Agroculture. Artistry.">
  <p className="p1">First paragraph — sets the frame.</p>
  <p className="p2">Subsequent paragraphs.</p>
</TwoCol>
```

First paragraph: `className="p1"` (lead size). Rest: `className="p2"`.

`<DataGrid>` (stat mode) can live inside `<TwoCol>` body. `<DataGrid standalone>` (tile mode) lives at section-w width, never nested in a body.

---

## 4. `<PullQuote>` — centered grotesque display

**The only centered element in the kit.** Bracketed top and bottom by full-viewport `var(--border)` rules that ground the centered quote against the prose around it. Use sparingly — once per long section, twice max per page.

```tsx
<PullQuote attribution="Arvind">
  Aura is not built, it is grown.
</PullQuote>
```

`attribution` is optional. Skip it for editorial declarations.

---

## 5. `<DataGrid>` + `<DataCard>` — responsive cards

The only "more than one column" pattern allowed. Two modes — same primitive, different visual.

**Stat mode** (no `img`, no `type`) — thin top-rule cards. Use inside `<TwoCol>` to frame filters or measurable claims:

```tsx
<TwoCol heading="Seven Decision Filters">
  <p className="p1">Lead paragraph…</p>
  <DataGrid>
    <DataCard value="Does it enrich the land?">
      Soil, water, canopy, pollinators, microbiome.
    </DataCard>
    <DataCard value="Does it honour the place?">
      Mudigere is Kannada and Malnad.
    </DataCard>
  </DataGrid>
</TwoCol>
```

**Tile mode** (with `img` — or `type` for drafting) — hero-style cards, **4:5 portrait** thumbnail on top, matching the homepage pillar grid. Always pass `standalone` so the grid spans the full section width, never nested in a `<TwoCol>` body:

```tsx
<DataGrid cols={3} standalone>
  <DataCard type="Landscape · old growth" value="Natural Intelligence">
    3.8 billion years of field trials…
  </DataCard>
  <DataCard type="Portrait · elder hands" value="Human Intelligence">…</DataCard>
  <DataCard type="Detail · sensor / circuit" value="Machine Intelligence">…</DataCard>
</DataGrid>
```

**Default to drafting tiles (`type` only).** Until you have approved imagery, leave `img` off — the thumbnail renders as the same grey drafting card `<Placeholder>` uses.

---

## 6. `<Placeholder>` — full-screen image with bottom-left caption

Spans the **full viewport** — 100vw wide, 100vh tall, the same expanding-banner gesture the homepage hero uses. Caption renders as a label in the bottom-left corner, anchored to the section-w left rail so it lines up with the prose above and below.

```tsx
<Placeholder
  src="/aura-mudigere-sunrise.jpg"
  alt="150 acres at sunrise, Mudigere"
  caption="150 acres at sunrise, Mudigere"
/>
```

**Drafting state.** Drop `src`, supply `type` + `caption`. The slot becomes a `#d6d6d6` card with the centered "type · caption" hint:

```tsx
<Placeholder type="Aerial landscape" caption="150 acres at sunrise, Mudigere" />
```

**Suggested `type` values:** `Landscape`, `Aerial landscape`, `Portrait`, `Portrait · animal`, `Detail`, `Hero banner`, `Process shot`, `Architecture`.

For motion, pass `mediaType="video"` and a `.mp4` src — same component, autoplays in view.

---

## 7. `<Continue>` — auto-pulled next reads

Footer cards linking to the next 3 active journals. Pass the current page's href and the kit derives the rest from [lib/journals.ts](lib/journals.ts).

```tsx
<Continue currentHref="/idea" />
```

The active journal set is the source of truth in `lib/journals.ts`. To change the next-reads sequence, reorder that file — never override `items` unless you have a specific reason.

Each card carries the journal's thumbnail (16:9), title, and one-line description, and uses the same hover gesture as the navbar journal tiles (image blurs, aura-symbol glyph fades in).

---

## Display utilities

### `<ScrollHighlight>` — Apple-style word reveal

Words start at 18% opacity and brighten as they enter the upper viewport band.

```tsx
<ScrollHighlight>
  {`A thousand years is the unit.
   Soil is the substrate.
   Time is the test.`}
</ScrollHighlight>
```

- Pass a plain string. Newlines split into separate display lines.
- Stands on its own — carries its own section wrapper and left rail. Don't wrap it in `<OneCol>`.
- Use **at most once or twice per journal** — it's a tone-setter, not a workhorse.
- The only way to make a declaration on the left rail without a heading. (For heading + prose, use `<OneCol>`.)

### `<Term>` — inline glossary tooltip

Wraps the **first** occurrence of a jargon term in a journal. Dotted underline; hover shows a small mono-uppercase tooltip with the explanation. Native `title` attribute keeps it accessible on touch / screen readers.

```tsx
<p className="p2">
  Cow dung packed into a horn, applied at dusk — <Term tip="Horn manure. Cow dung packed in a cow horn, buried over winter, applied at dusk.">BD 500</Term> in practice.
</p>
```

Only wrap the first appearance per page — leave later mentions plain so the text doesn't get noisy.

---

## Anatomy of a journal

```
HeroBanner or ArticleHero ← exactly one opener
  TwoCol                  ← section 1 (heading left, body right)
Placeholder               ← full-screen image with bottom-left caption
  PullQuote               ← editorial moment (CENTER — bracketed by border rules)
  TwoCol                  ← section 2
    DataGrid              ← stat-mode cards inside the body
  DataGrid standalone     ← tile-mode row at full section width
  ScrollHighlight         ← declaration on the left rail, no heading
  TwoCol × N              ← keep sectioning
Placeholder               ← another image beat
  OneCol                  ← closing passage with a heading
  Continue                ← auto-pulled next reads (with thumbnails + hover)
```

A good journal is **6–9 sections**. Less than 6 reads thin; more than 9 reads sprawling.

Cadence: alternate `<TwoCol>` with `<Placeholder>` and the occasional `<PullQuote>`. End on a quiet `<OneCol>` before the `<Continue>`.

---

## Type — paragraphs

Use plain `<p>` with the global classes — there is no `<P>` component:

| Class | Use |
|---|---|
| `p1` | Lead paragraph — first of a section. 16px, full-strength colour. |
| `p2` | Body paragraphs — everything after. 14px, muted colour. |

```tsx
<p className="p1">A thousand years is not a forecast. It is a discipline.</p>
<p className="p2">Most enterprises are measured in quarters.</p>
<p className="p2">Aura is measured in generations.</p>
```

Inline glyphs:
- `<Rta />` — renders "RTA" in DM Sans regardless of surrounding font.
- `<Term tip="...">word</Term>` — see Display utilities above.

---

## Tokens

All design tokens live in [`app/globals.css :root`](app/globals.css). The kit should never hardcode colours, radii, or spacing — if a value isn't tokenised, add a token there first.

Active tokens (May 2026 audit):

| Group | Tokens |
|---|---|
| Colour (brand) | `--brand-accent`, `--error` |
| Colour (theme) | `--bg`, `--bg-card`, `--text`, `--text-body`, `--text-muted`, `--text-dim`, `--border`, `--border-strong`, `--selection` + `--contrast-*` mirrors |
| Spacing | `--space-2` (8) → `--space-9` (80) |
| Layout | `--gutter`, `--max-w`, `--nav-h`, `--section-gap`, `--grid-gap` |
| Radius | `--radius-1` (2px, cards), `--radius-2` (4px, inputs) |
| Motion | `--ease`, `--ease-out`, `--ease-spring`, `--dur-fast`, `--dur-base`, `--dur-slow`, `--dur-theme` |
| Type families | `--font-sans`, `--font-mono`, `--font-grotesque`, `--font-instrument`, `--font-pixelify` |
| Z-index | `--z-modal` |

Mobile (≤768px) overrides `--section-gap` to `clamp(56px, 9vh, 100px)` — sections breathe ~25% less tight on a narrow viewport.

All borders / rule lines use `var(--border)` — never hardcoded greys.

---

## Rules

1. **Two positions only.** Left rail for everything. Center for `<PullQuote>` and nothing else.
2. **Images are full-screen.** `<Placeholder>` spans 100vw × 100vh, caption at bottom-left.
3. **`<OneCol>` always has a heading.** Orphan prose belongs in `<TwoCol>` or `<ScrollHighlight>`.
4. **`<DataGrid standalone>` for tile mode.** Inline `<DataGrid>` (no `standalone`) only inside `<TwoCol>` bodies, stat mode only.
5. **No bespoke layouts.** If the seven blocks don't cover it, rewrite the passage to fit them.
6. **One opener per page.** `HeroBanner` or `ArticleHero`, always first.
7. **`<ScrollHighlight>` is a moment, not a pattern.** Once or twice, never inside another wrapper.
8. **`<Continue>` always ends the page.** No exceptions.
9. **The active journal list is `lib/journals.ts`.** Update it there — Navbar, HeroBanner thumbnail, and Continue cards all read from the same source.
10. **Tooltips only on first occurrence.** Wrap the first appearance of any jargon term with `<Term>`; later mentions stay plain.

---

## The canonical example

Read [app/idea/page.tsx](app/idea/page.tsx) end-to-end. It uses only the seven blocks plus one `<ScrollHighlight>`. If your new journal looks more complicated than that, simplify.

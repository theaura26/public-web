# Journal Design Kit

Two openers, seven blocks, one reveal utility. Nothing else.

If a journal needs something not in this kit, the journal is wrong — not the kit. Constraint is the point.

---

## Alignment law

There are exactly **two horizontal positions** anything in a journal can take:

1. **Left rail** — every heading, paragraph, list, image caption, and OneCol block sits on the same left rail (the `.section-w` content edge). This rail is the spine of the page.
2. **Center** — reserved exclusively for `<PullQuote>`. Nothing else uses it.

Pages read like a clean column of writing with full-bleed images interrupting it, and the occasional centered quote as a beat.

---

## Openers — pick one

Every journal starts with **exactly one** opener. Choose the register that fits.

### 1a. `<HeroBanner>` — display opener

Big centred display title with words justified edge-to-edge inside the section rail, then a full-screen banner below (same `<ExpandingBanner>` the homepage hero uses). Use this for marquee pieces — the manifesto, the flagship article — where the title itself is the statement.

```tsx
<HeroBanner
  title={`The 1000\nYear Idea`}
  type="Aerial landscape"
  caption="150 acres at sunrise, Mudigere"
/>
```

- Split `title` on `\n` to control line breaks. Each line lays out as a flex row so the words spread evenly between the section rails.
- The banner uses `type` + `caption` while drafting, `src` (and `mediaType="video"` for film) once you have approved media.

### 1b. `<ArticleHero>` — indexed opener

Title on the left rail with a TOC on the right. Use this for long reads where the reader needs to navigate sections.

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

Drop the TOC if the journal is under ~800 words; keep just `title` + `subline`.

---

## 2. `<OneCol>` — single left-aligned column

The narrow reading column. Sits on the left rail at the same 760px max-width as `<ScrollHighlight>` — when you place a OneCol of prose above a `<ScrollHighlight>`, they share the same column.

```tsx
<OneCol heading="The Practice">
  <p className="p1">Begin with the ground. Work upward.</p>
  <p className="p2">Plant the tree whose shade you will not sit in.</p>
</OneCol>
```

**`heading` is required.** Every OneCol must declare what it is — orphan prose without a heading is what `<TwoCol>` is for. If you want a moment of declaration without a heading, use `<ScrollHighlight>`.

---

## 3. `<TwoCol>` — heading left, body right

The workhorse. Heading on the left rail, body in the right column. Both columns are left-aligned within themselves.

```tsx
<TwoCol id="pillars" heading="Sanctuary. Agroculture. Artistry.">
  <p className="p1">First paragraph — sets the frame.</p>
  <p className="p2">Subsequent paragraphs.</p>
  <p className="p2">Etc.</p>
</TwoCol>
```

First paragraph: `className="p1"` (lead size). Rest: `className="p2"`.

`<DataGrid>` can live inside `<TwoCol>` body.

---

## 4. `<PullQuote>` — centered grotesque display

**The only centered element in the kit.** Bracketed top and bottom by full-viewport grey rules that ground the centered quote against the prose around it. Use sparingly — once per long section, twice max per page.

```tsx
<PullQuote attribution="Arvind">
  Aura is not built, it is grown.
</PullQuote>
```

`attribution` is optional. Skip it for editorial declarations.

---

## 5. `<DataGrid>` + `<DataCard>` — responsive cards

The only "more than one column" pattern allowed. Two modes — same primitive, controlled by whether each card has an image.

**Stat mode** (no `img`, no `type`) — thin cards, top rule, value + body. Use inside `<TwoCol>` to frame filters or measurable claims:

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

**Tile mode** (with `img` — or `type` for drafting) — hero-style cards, **4:5 portrait** thumbnail on top, matching the homepage pillar grid. Always use `standalone` so the grid spans the full section width, never nested in a `<TwoCol>` body:

```tsx
<DataGrid cols={3} standalone>
  <DataCard type="Landscape · old growth" value="Natural Intelligence">
    3.8 billion years of field trials…
  </DataCard>
  <DataCard type="Portrait · elder hands" value="Human Intelligence">
    The accumulated craft of those who listened…
  </DataCard>
  <DataCard type="Detail · sensor / circuit" value="Machine Intelligence">
    The most recent arrival — given the smallest jobs…
  </DataCard>
</DataGrid>
```

**Default to drafting tiles (`type` only).** Until you have approved imagery, leave `img` off — the thumbnail renders as the same grey drafting card `<Placeholder>` uses. Add `img` later when the photo is ready:

```tsx
<DataCard img="/aura-natural.jpg" type="Landscape · old growth" value="Natural Intelligence">
  …
</DataCard>
```

---

## 6. `<Placeholder>` — full-screen image with bottom-left caption

Spans the **full viewport** — 100vw wide and 100vh tall, the same expanding-banner gesture the homepage hero video uses. Caption renders as a small label in the bottom-left corner of the image, anchored to the section-w left rail so it lines up with the prose above and below.

```tsx
<Placeholder
  src="/aura-mudigere-sunrise.jpg"
  alt="150 acres at sunrise, Mudigere"
  caption="150 acres at sunrise, Mudigere"
/>
```

**Drafting state.** Drop `src` and supply `type` + `caption`. The slot renders as a neutral grey card (`#d6d6d6` — same in day and night) with a centered label combining the two, so a photo editor reads "what kind of image goes here, and of what":

```tsx
<Placeholder
  type="Aerial landscape"
  caption="150 acres at sunrise, Mudigere"
/>
```

**Suggested `type` values:** `Landscape`, `Aerial landscape`, `Portrait`, `Portrait · animal`, `Detail`, `Hero banner`, `Process shot`, `Architecture`. Pick what's clearest for the editor — the value is a hint, not a constraint.

Images are an editorial beat — let them claim the full width. They interrupt the column rather than living inside it.

---

## 7. `<Continue>` — auto-pulled next reads

Footer cards linking to the next 3 active journals. Pass the current page's href and the kit derives the rest from [lib/journals.ts](lib/journals.ts).

```tsx
<Continue currentHref="/idea" />
```

The active set is the source of truth in `lib/journals.ts`. To change the next-reads sequence, reorder that file — never override `items` unless you have a specific reason.

---

## The display utility — `<ScrollHighlight>`

Apple-style word-by-word reveal. Words start at 18% opacity and brighten as they enter the upper viewport band.

```tsx
<ScrollHighlight>
  {`A thousand years is the unit.
   Soil is the substrate.
   Time is the test.`}
</ScrollHighlight>
```

- Pass a plain string. Newlines split into separate display lines.
- Stands on its own — it carries its own section wrapper and left rail. **Don't** wrap it in `<OneCol>`.
- Use **at most once or twice per journal** — it's a tone-setter, not a workhorse.
- It's the only way to make a declaration on the left rail without a heading. (If you want a heading + prose, use `<OneCol heading="…">`.)

---

## Anatomy of a journal

```
HeroBanner or ArticleHero ← exactly one opener
  TwoCol                  ← section 1 (heading left, body right)
Placeholder               ← full-screen image with bottom-left caption
  PullQuote               ← editorial moment (CENTER — bracketed by grey rules)
  TwoCol                  ← section 2
    DataGrid              ← cards inside the body
  ScrollHighlight         ← declaration on the left rail, no heading
  TwoCol × N              ← keep sectioning
Placeholder               ← another image beat
  OneCol                  ← closing passage with a heading (left rail)
  Continue                ← auto-pulled next reads (with thumbnails + hover)
```

A good journal is **6–9 sections**. Less than 6 reads thin; more than 9 reads sprawling.

Cadence: alternate `<TwoCol>` with `<Placeholder>` and the occasional `<PullQuote>`. End on a quiet `<OneCol>` before the `<Continue>`.

---

## Type — paragraphs

The kit no longer ships a `<P>` component. Use plain `<p>` with the existing global classes:

| Class | Use |
|---|---|
| `p1` | Lead paragraph — first of a section |
| `p2` | Body paragraphs — everything after |

```tsx
<p className="p1">A thousand years is not a forecast. It is a discipline.</p>
<p className="p2">Most enterprises are measured in quarters.</p>
<p className="p2">Aura is measured in generations.</p>
```

For inline glyphs:
- `<Rta />` — renders "RTA" in DM Sans regardless of surrounding font.

---

## Rules

1. **Two positions only.** Left rail for everything. Center for `<PullQuote>` and nothing else.
2. **Images are full-screen.** `<Placeholder>` spans 100vw × 100vh, caption at bottom-left.
3. **`<OneCol>` always has a heading.** Orphan prose without a heading is what `<TwoCol>` is for, or `<ScrollHighlight>` if it's a declaration.
4. **No bespoke layouts.** If the seven blocks don't cover it, rewrite the passage to fit them.
5. **One `<ArticleHero>` per page.** Always at the top.
6. **`<ScrollHighlight>` is a moment, not a pattern.** Once or twice, never inside another wrapper.
7. **`<Continue>` always ends the page.** No exceptions.
8. **The active journal list is `lib/journals.ts`.** Update it there — Navbar and Continue both read from the same source, including thumbnails.

---

## What's deprecated (don't use in new journals)

These exist as shims so existing pages keep compiling — they should be migrated off as we redesign each:

- `<P>` → use plain `<p className="p1">` / `<p className="p2">`
- `<Section>` → use `<OneCol>` or `<TwoCol>`
- `<PullStat>` — dropped from the kit; if you need a number, use a single-card `<DataGrid>`
- `<FocalImage>` → `<Placeholder>`
- `<Figure>` → `<Placeholder>`
- `<Couplet>`, `<SideBySide>` — inline if you need them, otherwise drop

---

## The canonical example

Read [app/idea/page.tsx](app/idea/page.tsx) end-to-end. It uses only the seven blocks plus one `<ScrollHighlight>`. If your new journal looks more complicated than that, simplify.

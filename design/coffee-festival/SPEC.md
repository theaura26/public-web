# RIPE — Coffee Festival page

Extraction of **AURA // Coffee Festival**, page *Web*, node `857:42` ("RIPE"),
1920 × 18753 on a `#000000` ground.
<https://www.figma.com/design/EuPeJbNrgT7WaaAiwhl0gV/AURA----Coffee-Festival?node-id=857-42>

Exact geometry for all 190 nodes is in `nodes.json`, sorted top to bottom;
`nodes.before-prep.json` is the same frame as it was before this file's
preparation, kept so the two can be diffed.

This file is the reading of it: what the design *is*, what was changed to make
it legible, and what is still worth knowing before building from it.

---

## 1. State of the Figma file

Prepared on 2026-09-12. Nothing was moved: the frame is still 1920 x 18753,
and a node-by-node diff against `nodes.before-prep.json` shows 4 nodes shifted
1-2px (right-aligned table cells re-hugging) and one text box re-measuring its
own hug width with its glyphs unmoved. That diff is reproducible - both
snapshots are in this folder.

| | before | after |
|---|---|---|
| Paint styles | 0 | **7** |
| Text styles | 0 | **18** |
| Text nodes carrying a style | 0 | **121 of 121** |
| Generically named layers | 63 | **0** |
| Two-in-one text nodes | 21 | **0** (split into 45) |
| Auto-layout frames | 1 | 1 |
| Components | 0 | 0 |

Every layer now reads `NN Section / role - description`, so the section
structure is legible from the layer panel and from any metadata dump.

### What was deliberately NOT done

**Sectioning into frames.** z-order in this file does not follow y-position:
only 4 of 12 sections occupy a contiguous z-range, and "10 Remember" spans
indices 25-96 with nine other sections interleaved. `00 Backdrop / plate -
lower page` sits at z3 but covers y14485-18753. Wrapping sections into frames
would reorder stacking and drop backdrops over text. Doing it safely means
normalising z-order first, which is a layout change - ask before it happens.

**Auto-layout and components.** Same reason: both reflow. The repeated
patterns that would benefit are the day cards (8), the come-prepared cards
(10), the nav items (5), the registry rows (7) and the timeline months (6).

### Still true, and still your call

- **Two typefaces are not on the website.** `Archie Brackett Bold` (display)
  and `Arvind Regular` (quote voice) are absent from `app/layout.tsx`. See section 3.
- **Source images total 152 MB** - individual photographs of 12-15 MB inside
  904x475 frames. See section 6; you do not need to re-export them.
- **`FEBUARY` is misspelled** in the harvest timeline.
- **Four near-duplicate type styles** are preserved rather than merged, because
  merging them would reflow text. They are named so they are easy to find:
  `Heading/60 (odd line-height)` (110% where 17 others use 100%) and
  `Body/20 (odd line-height)` (150% where 8 others use 120%).
- **`#1FE379`** appears once where `#23FF88` is used everywhere else, and
  `#4F6B41` / `#003306` appear once each. Left as they are.

### Reading the design

`Vector 136`, now `05 The days / spine - vertical rule (timeline)`, is a
0x5505 line at x=960. It is the centre rule the whole day sequence hangs off,
not decoration.

The day programmes are lists: each `Card/Date 20` heading is followed by a
`Body/20 Light` block whose newlines are list items, not line breaks.

## 2. Structure, top to bottom

| y | h | Section | Notes |
|---|---|---|---|
| 0 | 1089 | **Hero** | Frame `aura-award-cup.jpg`. Two stacked images, then RIPE / tagline / meta. |
| 1718 | 311 | **Intro** | One 22px paragraph, 635 wide, left at x179. |
| 2310 | 52 | **Section bar** | Two rules + 5 labels. THE RHYTHM · COME PREPARED · GRATITUDE · REMEMBER · THE HARVEST |
| 2743 | 242 | **THE RHYTHM** | 200px display, 1344 wide. |
| 3062 | 5505 | **The days** | Three columns against a centre spine. See §4. |
| 8890 | 765 | **Two arcs** | "The experience moves through two different arcs." + two arc cards. |
| 9939 | 242 | **COME PREPARED** | 180px display, 1593 wide. |
| 10290 | 175 | **Working-estate line** | 60px, 1409 wide. |
| 10814 | 450 | **How to show up** | 6 cards, 3 columns × 2 rows. |
| 11481 | 700 | **What to bring** | 4 cards (Field / Evening / useful / Making) + cap illustration. |
| 12461 | 1013 | **Scatter + closing** | `Group 1437258068` collage, "with Boojee and BESST…", "Nothing here grows alone." 80px Arvind. |
| 13817 | 800 | **Gratitude** | Portrait image 540×797 left, heading + prayer text right. |
| 14675 | 1500 | **Remember** | Question, memory form, two polaroids with Arvind captions. |
| 16437 | 700 | **Tree registry** | Heading + 7-row key/value table with rules between rows. |
| 17371 | 900 | **The Harvest** | Closing lines + 6-month timeline SEPTEMBER → FEBUARY. |

---

## 3. Type

| Role | Face | Sizes | On the site today |
|---|---|---|---|
| Display | **Archie Brackett Bold** | 200, 180 | **absent** — this is the RIPE logotype face |
| Quote / handwriting | **Arvind Regular** | 80, 30, 27.2 | **absent** — nearest existing is `--font-hand` (Mynerve) |
| Headings / body | Bricolage Grotesque — Light, Regular, SemiBold, Bold, ExtraBold | 75, 60, 30, 22, 20, 17 | present as `--font-grotesque` |

Decide per face: license and self-host it, or substitute. The two display
strings (`RIPE`, `THE RHYTHM`, `COME PREPARED`) are already available as
artwork in `public/RIPE/*.svg` and `ripe-logotype.png`, so Archie Brackett may
not need to ship as a webfont at all.

## 4. The days — layout

A three-column timeline against `Vector 136`, a vertical rule at x=960
running y3062 → y8567.

| Column | x | width | Content |
|---|---|---|---|
| Left | 433 | 312–366 | Beat titles, Bricolage Regular **60px** |
| Centre | 505–508 | 904–910 | Photographs, 475–478 tall |
| Right | 1458 | 348–402 | Day programmes, 20px, ExtraBold date + Light body |
| Floating | 812–1150 | 253–312 | Arvind 30px quotes, off-grid on purpose |

Beats in order: Friends of Aura · Come in · Find your rhythm · Get closer ·
The company comes together · White. Indigo. Or both. · Arrive & Exhale ·
See & Feel · Understand · Make It Yours.

Days in order: 20, 21, 22 SEPTEMBER (Friends of Aura arc) then 23, 24, 25,
26, 27 SEPTEMBER (In Good Company arc).

Quotes in order: "Good to be here." · "I'm beginning to understand this
place." · "I'm starting to become part of the place." · "I am somewhere
special." · "There is so much happening here." · "Now I understand how it
connects." · "I was part of Aura."

## 5. Colour

| Hex | Uses | Role |
|---|---|---|
| `#FFFFFF` | 97 | Type, on black |
| `#000000` | frame | Page ground |
| `#23FF88` | 6 | RIPE green — date chips, accents |
| `#8CA7FE` | 1 | Periwinkle. Only on "For 23 September: white, indigo, or both." |
| `#1FE379` | 1 | Second green, 1 use — probably meant to be `#23FF88` |
| `#E3DCCE` | 2 | Warm paper |
| `#D9D9D9` | 2 | Form field grey (placeholder fills) |
| `#4F6B41` `#003306` `#3C3C3C` | 1–2 | Incidental |

## 6. Assets

**`public/RIPE/` is already an export of this frame.** Every display size
matches within rounding:

| Figma | In `public/RIPE` |
|---|---|
| 904×475 ×6 | the six day photographs |
| 910×478 | `aura-company-comes-closer.jpg` |
| 540×797 | `aura-gratitude.jpg` |
| 2432×2286 | `aura-dawn.jpg` |
| 474×378 | `aura-cap.png` (475×379) |
| 1619×1013 | `aura-collage.png` (1619×1014) |
| 512×544 / 497×530 | `aura-remember-01/02.png` |

Not yet exported: `image 1461` (1916×1079), `Screenshot 2026-09-11…`
(2056×1148, inside the hero), `aura-cherry-morning.jpg` (379×214),
`image 1459` (570×570, used twice).

Export at display size, never at source: the originals behind these are
12–15 MB each, 152 MB in total.

## 7. Interactive

- **Memory form** (y15624–16108): free text, Your Name (optional), Tree
  connection (optional), Add a photograph (optional), `add memory` button.
  The design states its own behaviour: *"Memories added here stay with this
  page for now — nothing is sent anywhere yet."*
- **Tree registry** (y16802–17062): GUEST · TREE ID · SPECIES · BLOCK ·
  PLANTING DATE · FIRST PHOTOGRAPH · LATEST OBSERVATION. Values are
  placeholders — `-`, "Assigned after planting", "Chosen with the estate".
- **Harvest timeline** (y18105–18233): six months, empty. The design says
  *"The harvest timeline opens once the gathering ends on 27 September."*

---

## 8. The build, and where it departs from the design

Built at `app/ripe` + `components/ripe`, local-only behind `guardComingSoon()`.
Verified: production build 404s `/ripe` while every other route stays 200,
and it is absent from the sitemap.

Three departures, all forced rather than chosen:

1. **The hero photograph.** The design layers `aura-laterite-wet.jpg` under a
   screenshot; neither is exported and neither is in `public/RIPE`. The film of
   the same branch stands in. Export those two and it is a one-line swap.
2. **Arvind Regular** carries the handwritten lines. The site does not have it,
   so they are set in Mynerve, the site's own `--font-hand`. Affects the seven
   quotes over the photographs and the two polaroid captions.
3. **Archie Brackett Bold** is not needed as a webfont: all three display
   strings it sets — RIPE, THE RHYTHM, COME PREPARED — ship as artwork.

### The design's copy breaks two of Aura's own editorial rules

Reproduced verbatim rather than reworded, because they are the festival's
words and not mine to rewrite. `npm run lint:editorial` reports both:

| Line | Rule |
|---|---|
| "It is not a performance. It is not an activity." (Gratitude) | `negation` — the "X, not Y" construction is banned outright |
| "Not only coffee." (25 September) | `not-just` — "not just" / "not merely" / "not only" |

Either reword them in the design, or add them to the `QUOTED` list in
`scripts/editorial/lint.mjs`. That list is documented as being for words a
named person actually said, so adding them is a decision rather than a tidy-up.

### What the design says about its own form

The memory form sends nothing. That is the design's instruction, printed under
it: *"Memories added here stay with this page for now — nothing is sent
anywhere yet."* Entries are kept in the reader's own browser. This page
therefore needs no contact endpoint, no mail provider and no environment
variable.

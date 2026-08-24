# Keynote — Visual Direction
## The system, as built

The deck is generated from [build_deck.py](build_deck.py). Edit the script and re-run rather than hand-editing slides, so the system stays consistent.

```bash
python3 build_deck.py
```

The visual language is lifted directly from `20260706_NaturalIntelligence.pdf` so the coffee deck and the Natural Intelligence deck read as one house. Slides can be moved between them without re-styling.

---

## TYPE

| Role | Face | Treatment |
|---|---|---|
| **Display** | Helvetica Neue Bold | ALL CAPS, tight leading (0.88–0.90), negative tracking (−1.4 to −3). 40–108 pt |
| **Eyebrow** | DM Mono Regular | UPPERCASE, +1.2 letterspacing, 11 pt, top-left at 0.55″ |
| **Body** | Helvetica Neue Regular | Sentence case, 13–15 pt, 1.4 leading |
| **Data / labels** | DM Mono | UPPERCASE, 9.5–26 pt |
| **Wordmark** | Instrument Serif | lower case `aura`, 40 pt |

**In Figma and on machines without Helvetica Neue**, Inter Black/Bold is the substitute — see the storyboard board on the `AURA / Coffee` page. Do not mix the two within one artefact.

**The one typographic rule:** display type is always uppercase and always tight. If a headline needs more than three lines, it is two slides.

---

## COLOUR

| | Hex | Use |
|---|---|---|
| Black | `#000000` | Grounds, plates, label boxes |
| White | `#FFFFFF` | Grounds, reversed type |
| Pink | `#FF1E63` | *Transparent* act. The admission slide. "must be shot" flags |
| Green | `#3FA45B` | *Biodynamic* act. "footage exists" flags |
| Orange | `#F26B3A` | *Flavourful* act |
| Grey | `#9A9A9A` | Secondary process boxes, muted mono |

Accents are used **once per slide, never decoratively.** A colour on this deck always means something.

---

## THE ELEVEN LAYOUTS

Every slide is one of these. There are no bespoke layouts.

| Pattern | What it is | Used for |
|---|---|---|
| `s_cover` | Full-bleed image, `aura` left, labels right | 01, and the end card |
| `s_black_center` | Huge white type on black, scattered rotated image cards, mono subline | 02, 22, 32 |
| `s_act` | One word at 108 pt, coloured rule, mono sub-line | The three act dividers |
| `s_white_hero` | Mono eyebrow, huge black headline, body low-left | The statement slides |
| `s_photo_hero` | Full-bleed photo, dimmed, centred white type, mono caption | 08, 16, 27, 31 |
| `s_split` | Half photo, half type — eyebrow, headline, three paragraphs | 09, 12, 24, 30 |
| `s_grid` | 3-up image grid, name + mono spec list beneath | The evidence slides |
| `s_circle` | Ring with four black label boxes at the compass points | The loop |
| `s_spectrum` | Two images, axis with coloured labels at each end | 05 |
| `s_flow` | Process boxes with arrows and a return rule | The testing loop |
| `s_biglist` | Half photo with mono label, half stacked display list | "Every ferment. Every batch." |
| `s_record` | Black plate holding one mono record, notes right | The signed event |

---

## RHYTHM

The deck changes gear deliberately. Six silent slides, nine statements, seven evidence slides, seven photographic, three turns.

**The three turns are 05, 21 and 28.** Everything else exists to set one of them up. If the deck is cut for time, those three and the act dividers stay.

**Four slides carry no words and must not be filled:** 03, 12, 22, 29. If the speaker talks over them, the shape is gone.

---

## IMAGERY

All photography is drawn from `/public` in this repository — the same library the site and journals use. Nothing is stock, nothing is generated.

**Rules**
- Every image is cropped to fill (`object-fit: cover`), never letterboxed
- Full-bleed photo slides carry a black plate at 35–52% so white type always clears
- Photography is close and physical — hands, hide, bark, foam, soil, steam
- The estate is dim and green-grey; grade for that rather than against it

**The gaps this deck is working around:** there is no cupping-table image, no lux meter, no signed-record photograph and no harvest picking imagery in the library. Slides 15, 19, 28 and 33 use the nearest available frame and will improve materially once those are shot. See [photography-needs.md](../05_CONTENT/photography-needs.md).

---

## THE THREE VERSIONS

Built once, cut three ways — nothing is rewritten.

| Version | Slides | Runs |
|---|---|---|
| **Master** | All 34 | 20–25 min |
| **Trade** | 01–05, 17–31, 34 | 12 min |
| **Short** | 01–05, 09, 14, 22, 27, 32–34 | 5 min |

The short version is the one that gets forwarded. Build it deliberately.

---

## OUTPUT

| File | What |
|---|---|
| `AURA_Regenerative_Coffee.pptx` | Editable master, 34 slides, 16:9 |
| `AURA_Regenerative_Coffee.pdf` | Read-alone version, for sending |
| `build_deck.py` | The generator. Source of truth |

**Regenerate the PDF** after any edit:

```bash
soffice --headless --convert-to pdf --outdir . AURA_Regenerative_Coffee.pptx
```

---

## WHAT THE DECK REFUSES

No agenda slide. No "problem with the industry" section — Aura cannot source those comparative claims. No sustainability framework, no pledge, no UN goals. No org chart, no roadmap, no market sizing. No certification logos, because there are none, and slide 23 says so plainly. No slide with more than twenty-five words.

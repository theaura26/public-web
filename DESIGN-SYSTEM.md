# Aura — Design System

> **Verified against the code on 2026-08-19.** Where this guide and `app/globals.css`
> disagreed, the CSS won and this file was corrected. Retired items are struck through
> rather than deleted so the history stays legible.

The single source of truth lives in [`app/globals.css`](app/globals.css). Everything below is a usage guide. Edit token values in `globals.css`, never hard-code in components.

---

## 1. Brand colours

Always-on, theme-independent.

| Token | Hex | Use |
|---|---|---|
| `--brand-accent` | `#E37128` | hover underline, custom-cursor accent, primary action |
> **Retired.** The seven fermentation-named hues below were removed from `globals.css`.
> The names survive as content (lot names, image filenames); the tokens do not. They are
> listed here for history only — do not reintroduce them, and do not use them for data
> visualisation (they fail four of six accessibility checks).

| ~~`--brand-dry-osmosis`~~ | `#CA4926` | retired |
| ~~`--brand-red-honey`~~ | `#DD7C37` | retired |
| ~~`--brand-banana-wash`~~ | `#E4B239` | retired |
| ~~`--brand-solera-maceration`~~ | `#E1ADA2` | retired |
| ~~`--brand-solera-wash`~~ | `#A5B6C8` | retired |
| ~~`--brand-grappa`~~ | `#B6B050` | retired |
| ~~`--brand-volcanic`~~ | `#7A7C5C` | retired |
| ~~`--brand-appassimento`~~ | `#FFFFFF` | retired |
| `--error` | `#E8421A` | form error states |
| `--success` | `#1F6B4B` | confirmed state — form sent, validation passed |

## 2. Surfaces & text (themed)

Switch via `data-theme="day" | "night"` on `<html>`.

| Token | Day | Night | Use |
|---|---|---|---|
| `--bg` | `#ffffff` | `#131719` | page background |
| `--bg-card` | `#ffffff` | `#1a1d20` | card surfaces |
| `--text` | `#1a1a1a` | `#ededed` | primary copy |
| `--text-body` | `0.65 alpha` | `0.65 alpha` | secondary copy (.p2) |
| `--text-muted` | `0.4 alpha` | `0.4 alpha` | meta / labels |
| `--text-dim` | `0.25 alpha` | `0.25 alpha` | captions / fine print |
| `--border` | `0.08 alpha` | `0.08 alpha` | section dividers |
| `--border-strong` | `0.14 alpha` | `0.14 alpha` | inputs, key dividers |
| `--selection` | brand-accent at 24% | brand-accent at 32% | text-selection bg |

## 3. Spacing scale

8px base, with 4px micro step. Prefer tokens over arbitrary numbers for any spacing ≥ 4px.

| Token | px | Typical use |
|---|---|---|
| `--space-1` | 4 | tight inline gap |
| `--space-2` | 8 | tight component padding |
| `--space-3` | 12 | sm gap between related lines |
| `--space-4` | 16 | base gap between elements |
| `--space-5` | 24 | between heading and body |
| `--space-6` | 32 | between groups within a card |
| `--space-7` | 48 | between minor sections |
| `--space-8` | 64 | between major content blocks |
| `--space-9` | 80 | section internal padding |
| `--space-10` | 96 | between sections |
| `--space-11` | 120 | hero / closing spacing |
| `--space-12` | 160 | extra-roomy block separation |

## 4. Layout

| Token | Value | Use |
|---|---|---|
| `--gutter` | `clamp(20px, 4vw, 48px)` | horizontal page padding |
| `--max-w` | `1200px` | primary content width |
| `--max-w-narrow` | `720px` | long-form reading width / agent view |
| `--nav-h` | `56px` | fixed navbar height |
| `--section-gap` | `clamp(80px, 12vh, 140px)` | between major sections |
| `--grid-gap` | `clamp(32px, 5vw, 80px)` | between grid items |
| `--col2-gap` | `clamp(40px, 6vw, 100px)` | tighter 2-col asymmetry |

`.section-w` — centered content wrapper with `--max-w` + `--gutter` padding.
`.grid-2col` — fixed 50/50 grid at ≥768px with `--grid-gap`.

## 5. Radius

| Token | px | Use |
|---|---|---|
| `--radius-1` | 2 | tiles, video frames, sanctuary cards |
| `--radius-2` | 4 | buttons, form inputs |
| `--radius-pill` | 9999 | cursor dot, pills, avatars |

## 6. Z-index

Only one z token actually exists in the code: `--z-modal: 9990` (full-screen modals).
The rest of the scale that used to be documented here — `--z-content`, `--z-overlay`,
`--z-nav`, `--z-cursor` — was never present in `globals.css`; those layers are set with
literal z-index values at their use sites.

## 7. Motion

### Easings

| Token | Curve | Use |
|---|---|---|
| `--ease` | `cubic-bezier(0.4, 0, 0.2, 1)` | default, both directions |
| `--ease-out` | `cubic-bezier(0, 0, 0.2, 1)` | enter / reveal |
| `--ease-in` | `cubic-bezier(0.4, 0, 1, 1)` | exit |
| `--ease-spring` | `cubic-bezier(0.16, 1, 0.3, 1)` | panel slide-in |
| `--ease-bounce` | `cubic-bezier(0.34, 1.56, 0.64, 1)` | snap-back / elastic |

### Durations

| Token | Value | Use |
|---|---|---|
| `--dur-fast` | 150ms | hover, focus, micro-interactions |
| `--dur-base` | 250ms | default link / button transitions |
| `--dur-slow` | 450ms | panel open / close |
| `--dur-slower` | 700ms | hero blur-reveal, large reveals |
| `--dur-theme` | 400ms | day ↔ night theme swap |

Reveal-on-scroll uses 600ms with `--ease-out`.

### `prefers-reduced-motion`

`globals.css` collapses all animations and transitions to ~0ms when the user requests reduced motion. The `.reveal` opacity also resets to 1 so content is immediately visible.

## 8. Type system

Three families, four roles. Headings **and body** use Bricolage Grotesque — `--font-sans` is an alias of `--font-grotesque` (DM Sans was retired in #49). Mono is DM Mono. Pull quotes and handwriting use Mynerve (`--font-hand`).

| Role | Font | Size | Tracking | Line-height | Use |
|---|---|---|---|---|---|
| `h1` | grotesque | `clamp(44,9vw,88)` | `-0.06em` | 1.02 | page display, **weight 600, uppercase** |
| `h2` | grotesque | `clamp(36,5.5vw,60)` | `-0.04em` | 1.06 | section heading |
| `h3` | grotesque | `clamp(24,3vw,32)` | `-0.03em` | 1.15 | sub-heading / card title |
| `.p1` | sans | 16px | normal | 1.55 | primary body |
| `.p2` | sans | 14px | normal | 1.6 | secondary body, `--text-body` |
| `.label` | mono | 11px | 1px (UC) | normal | uppercase eyebrow / meta |

Globally enabled features: `kern`, `liga`, `calt`, `ss01` (Bricolage's stylistic alternates).
`text-rendering: optimizeLegibility` and `font-kerning: normal` are set on `html`.

`<strong>` / `<b>` are normalised to `font-weight: 400` and `var(--text)` — emphasis is achieved via colour promotion, not weight.

## 9. View modes

`data-view="agent"` on `<html>` switches the entire page into a machine-readable monospace view:

- All text → mono
- Heading sizes flatten to 16px
- Multi-column grids → single-column flex
- Body content → 720px max-width
- `.human-only` hidden, `.agent-only` shown

Use sparingly — almost everything should work in both modes.

## 10. Day / night

Default is **day** (`ModeProvider` initialises `theme: 'day'`, `viewMode: 'human'`); localStorage overrides after mount. Toggle keys `d` (night) and `l` (day) are wired in `Navbar.tsx`. `[data-theme="day"|"night"]` is applied to `<html>` and CSS variables flip atomically with a `--dur-theme` cross-fade.

`.invert-on-light` flips white SVG assets dark when day is active, leaving them untouched at night.

## 11. How to use

Inline styles, styled-jsx, or Tailwind arbitrary values can all read tokens:

```tsx
<div style={{ padding: 'var(--space-6) var(--gutter)', borderRadius: 'var(--radius-1)' }}>

<style jsx>{`
  .card { padding: var(--space-5); border: 1px solid var(--border); }
  .card:hover { border-color: var(--border-strong); transition: border-color var(--dur-base) var(--ease); }
`}</style>

<div className="p-[var(--space-6)] rounded-[var(--radius-1)]">
```

When in doubt: pick a token, not a magic number.

---

## 11b. The hover rule

**One affordance for everything clickable: a brand-accent underline.** It is declared once, on `a:hover, button:hover, [role="button"]:hover` in `globals.css`, and inherited everywhere. Two tokens control it:

| Token | Value | Why |
|---|---|---|
| `--rule-offset` | `0.22em` | **Proportional, not fixed.** A 4 px gap that sits right under an 11 px label looks pinched under a 32 px heading. The same number cannot be correct at both sizes. |
| `--rule-weight` | `1.5px` | Absolute. A hairline is a hairline at any size. |

This drifted once and is worth knowing how: the offset had been written as a literal in three files at three values — `4px` in `globals.css`, `6px` in the navbar, `7px` in the coffee microsite — because each was tuned by eye at its own type size. An em value is consistent by construction; a pixel value has to be re-tuned every time it meets new type, and nobody remembers to.

**Selection is the same underline held on.** Where something is both hoverable and current — a nav tab, an active sub-nav link — it carries `text-decoration: underline` permanently rather than a `border-bottom`. Two mechanisms means two lines under one word the moment a reader hovers the thing they are already on.

**To opt out**, set `text-decoration: none` on both the element and its `:hover`. Do this only where the underline is wrong for the object, not merely unfamiliar: the Ask Aura dock does it for chips, its close cross and its send icon, because an underline under an icon is meaningless.

---

## 12. Links and calls to action

**There is one link UI on this site.** A 22 px circled chevron, then `.label` text. It is the "Explore Mudigere" control on the homepage, and it is what every "go deeper" action must look like — hub panels, pillar sections, cards, invitations.

```tsx
<a className="label" style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
  <span aria-hidden style={{
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    width: 22, height: 22, borderRadius: '50%',
    border: '1px solid rgba(255,255,255,0.7)',
  }}>
    <svg viewBox="0 0 24 24" width="11" height="11" fill="none">
      <path d="M5 12h13M12.5 6l6.5 6-6.5 6" stroke="currentColor"
        strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </span>
  Explore Mudigere
</a>
```

The coffee microsite exposes it as `<ArrowLink>` / `<ArrowLinkStyles>` in [`components/coffee/Microsite.tsx`](components/coffee/Microsite.tsx).

**Do not invent** bordered pill buttons, underlined mono links, or bare text-plus-arrow. If an action needs a different weight, change its placement or its surrounding space — not its form.

---

## 12b. Known drift

Recorded rather than silently fixed, because changing them alters how the site feels and that is a decision, not a cleanup.

**Durations off the scale.** The scale is four values — 150 / 250 / 400 / 450 ms. Roughly forty declarations sit outside it, most often `0.3s`, `0.4s`, `0.6s` and `0.9s`. Some are deliberate and correct: the marquees run at 72 s and 90 s, the Ask Aura ring orbits at 7 s, and long ambient motion has no business on a UI scale. The rest is drift. Retiming them is a design pass, not a find-and-replace.

**Brand accent as a literal.** `#E37128` appears three times outside its token, in `VideoReactiveArt` and `RemarkableCircle`. Both are palettes passed to canvas and WebGL rather than CSS, so they cannot read a custom property — this is a real constraint, not laziness, but it does mean the accent has three copies that will not follow if the token changes.

**The display heading has two specs.** Section 8 defines `h1` as `clamp(44,9vw,88)` at `-0.06em` and line-height 1.02. `HeroBanner` and `JournalHero` — the opener on every journal and field note — use `clamp(48,7.2vw,106)` at `-0.03em` and line-height 1. Those are different kinds of heading, and both are in use on pages that sit next to each other in the same menu.

The Field Notes and From Aura index headings follow the banner, because they open a section the way a banner opens an article and were explicitly matched to it. The category pages, section indexes and coming-soon stubs follow section 8.

Pick one. Until then, the rule is: a page that opens with a full-width display line follows the banner; a page that opens with a heading in the reading column follows section 8.

**Two non-system curves.** `cubic-bezier(.6,0,.2,1)` and `cubic-bezier(0.34,1.56,0.64,1)` are in use and are not among the three in section 7. The second is an overshoot spring, which the system has no equivalent of. Either adopt it as a fourth curve or retire it.

---

## 13. styled-jsx and `next/link` — a standing trap

**styled-jsx scopes every element in a selector, including the first one.** A `next/link` renders its own `<a>`, which never receives the scope class. So this silently does nothing:

```tsx
<Link className="cta" href="/x">Go</Link>
<style jsx>{`
  .cta { color: white; }   /* ✗ compiles to .cta.jsx-abc — never matches */
`}</style>
```

The rule does not error, does not warn, and the element renders with inherited styles — which on a dark ground usually means invisible dark text. It has bitten this codebase more than once.

**Two fixes, in order of preference:**

```tsx
/* 1 — put shared link styles in a global block (best for anything reused) */
<style jsx global>{`
  .cta { color: white; }
`}</style>

/* 2 — wrap the scoped selector's root in :global() */
<style jsx>{`
  :global(.cta) { color: white; }
  :global(.cta):hover { color: var(--brand-accent); }
`}</style>
```

**The same applies to any component that renders its own root element** — not just `Link`. If you write a styled-jsx rule and the style does not appear, check whether the target is a component before checking anything else.

**How to catch it:** the styles are missing, not wrong. Read the computed style rather than trusting the screenshot — `getComputedStyle(el).filter === 'none'` on an element you gave a filter is the tell.

**Seen in the wild, all of them silent:**

| Where | Symptom |
|---|---|
| `.ln-end > *` on the coffee sub-nav | `pointer-events: auto` never applied, so the Aura Festival button was unclickable from the day it was written |
| `.mn-leaf` in the menu | every item rendered at the inherited 16 px through two separate rounds of being asked to make it bigger |
| `.ln-cta`, `.lane-card`, `.fn-item`, `.mg-btn-link` | styled correctly only after being made global |

### Two more things this file will do to you

**Backticks inside a CSS comment end the template literal.** The block is a template string, so `` /* like `this` */ `` terminates it and the build fails with a parse error pointing at a line that looks fine. Write the property name plainly.

**`backdrop-filter` is dropped from emitted rules on this build.** It does not warn; the property simply is not in the stylesheet. Set it inline instead:

```tsx
<div style={{ backdropFilter: 'blur(40px)', WebkitBackdropFilter: 'blur(40px)' }} />
```

`InfiniteArticleSlider`, the menu vignette, the Ask Aura panel and its bar all do this. If something that should be frosted looks flat, this is why — and note the bar carried a flat scrim for days before anyone noticed, because a missing blur reads as a design choice rather than a bug.

---

## 14. Tokens: `globals.css` is the source of truth

Sections 1–11 above have drifted ahead of the stylesheet. Before using a token, confirm it exists:

```bash
grep -- '--token-name:' app/globals.css
```

**Documented here but NOT in `globals.css` as of this audit** — using any of these resolves to nothing, silently:

`--space-1` · `--space-10` · `--space-11` · `--space-12` · `--col2-gap` · `--max-w-narrow` · `--bg-elevated` · `--nav-bg` · `--radius-pill` · `--z-content` · `--z-overlay` · `--z-nav` · `--z-cursor` · `--ease-in` · `--ease-bounce` · `--dur-slower` · every `--brand-*` swatch except `--brand-accent`

A missing token is not a build error. `padding: var(--space-12) 0` becomes `padding: 0` and the section collapses. Either add the token to `globals.css` or use one that exists.

---

### No eyebrows

A page title stands on its own. Do not put a small mono label above an
`<h1>` to announce the section a page belongs to — not "FIELD NOTES"
above a category name, not "THE REGENERATIVE LIFE" above a discipline.
The reader arrived from somewhere; the menu, the URL and the title
already say where they are, and the label just adds a line of noise
above the one line that matters.

This is a standing rule, not a preference on one page. If a page needs
to say which section it belongs to, it says it in the prose or in the
navigation at the foot.

The mono `.label` role is still correct for what it was made for:
naming a part of a page (SOURCES, ASK NEXT), captioning a figure, or
labelling a row in a spec table. The rule is about the position — above
the title — not about the type style.

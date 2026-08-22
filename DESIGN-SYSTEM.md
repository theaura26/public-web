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

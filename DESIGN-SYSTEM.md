# Aura — Design System

The single source of truth lives in [`app/globals.css`](app/globals.css). Everything below is a usage guide. Edit token values in `globals.css`, never hard-code in components.

---

## 1. Brand colours

Always-on, theme-independent.

| Token | Hex | Use |
|---|---|---|
| `--brand-accent` | `#E37128` | hover underline, custom-cursor accent, primary action |
| `--brand-dry-osmosis` | `#CA4926` | computational art palette |
| `--brand-red-honey` | `#DD7C37` | computational art palette |
| `--brand-banana-wash` | `#E4B239` | computational art palette |
| `--brand-solera-maceration` | `#E1ADA2` | computational art palette |
| `--brand-solera-wash` | `#A5B6C8` | computational art palette |
| `--brand-grappa` | `#B6B050` | computational art palette |
| `--brand-volcanic` | `#7A7C5C` | computational art palette |
| `--brand-appassimento` | `#FFFFFF` | reserved bright |
| `--error` | `#E8421A` | form error states |

## 2. Surfaces & text (themed)

Switch via `data-theme="day" | "night"` on `<html>`.

| Token | Day | Night | Use |
|---|---|---|---|
| `--bg` | `#ffffff` | `#131719` | page background |
| `--bg-elevated` | `#ffffff` | `#1a1d20` | nav, modals, panels above bg |
| `--bg-card` | `#ffffff` | `#1a1d20` | card surfaces |
| `--nav-bg` | `rgba(255,255,255,0.7)` | `rgba(19,23,25,0.92)` | translucent nav backdrop |
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

## 6. Z-index scale

| Token | Value | Layer |
|---|---|---|
| `--z-content` | 1 | normal flow content |
| `--z-overlay` | 30 | menu backdrop, computational art bg |
| `--z-nav` | 50 | navbar, hamburger panel |
| `--z-modal` | 9990 | LocationModal full-screen |
| `--z-cursor` | 9999 | custom cursor (always on top) |

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

Three families, four roles. All headings use Bricolage Grotesque (display-friendly geometric grotesque), body uses DM Sans, mono uses DM Mono.

| Role | Font | Size | Tracking | Line-height | Use |
|---|---|---|---|---|---|
| `h1` | grotesque | `clamp(56,9vw,88)` | `-0.05em` | 1.02 | page display |
| `h2` | grotesque | `clamp(36,5.5vw,60)` | `-0.04em` | 1.06 | section heading |
| `h3` | grotesque | `clamp(24,3vw,32)` | `-0.03em` | 1.15 | sub-heading / card title |
| `.p1` | sans | 17px | normal | 1.65 | primary body |
| `.p2` | sans | 16px | normal | 1.65 | secondary body |
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

Default is night. Toggle keys `d` (night) and `l` (day) are wired in `Navbar.tsx`. `[data-theme="day"|"night"]` is applied to `<html>` and CSS variables flip atomically with a `--dur-theme` cross-fade.

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

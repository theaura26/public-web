'use client'

import { useState } from 'react'
import { CaretDown } from '@phosphor-icons/react'

/* ═══════════════════════════════════════════════════════════════════
   HARVEST INTERACTIVE — lot cards and the block explorer.

   Ported from aura_roaster_v1.html: the "tap for lot data" flip cards
   and the eight-block estate map. Same black ground and hairline
   grammar as the Scene pages; the interaction is the roaster draft’s,
   the clothes are the microsite’s.
═══════════════════════════════════════════════════════════════════ */

/* ── data ───────────────────────────────────────────────────────── */

export type Lot = {
  id: string
  eyebrow: string
  name: string
  method: string
  headline: string[]
  note: string
  data: { k: string; v: string }[]
  process: string
}

export const ARABICA_LOTS: Lot[] = [
  {
    id: 'DO01',
    eyebrow: 'Our table: 85.25 · excellent range',
    name: 'Liquid Gold',
    method: 'Dry Osmosis',
    headline: ['Brix 19.55% · zero quakers', 'Agtron 63.2 · 48 hr anaerobic'],
    note: 'Berries, chocolate, spice, prune, grapefruit. Honey-like mouthfeel. The highest-scoring lot — zero defects, clean cup.',
    data: [
      { k: 'Lot', v: 'DO01 · Arabica' },
      { k: 'Block', v: 'Byton Patte' },
      { k: 'Varietal', v: 'Arabica Selection 9' },
      { k: 'Elevation', v: '1,127 m' },
      { k: 'Fruit weight', v: '1.43 g' },
      { k: 'Bulk density', v: '0.74 g/cc' },
      { k: 'Brix at harvest', v: '20%' },
      { k: 'pH fruit → end', v: '6.5 → 4.2' },
      { k: 'Profile', v: 'Apricot, Dark Plum, Date Syrup' },
    ],
    process:
      'Cherries dried on raised beds to 45% moisture, then sealed for a 48-hour anaerobic fermentation. Slow-dried on raised beds for 25 days with temperature and humidity controlled.',
  },
  {
    id: 'AM01-A',
    eyebrow: 'Our table: 84.25 · specialty range',
    name: 'Silver Lining',
    method: 'Appassimento Maceration',
    headline: ['48 hr cold soak below 10 °C', '8-day anaerobic · Agtron 67.5'],
    note: 'Tropical fruit, floral top notes, wine-like nuance, hazelnut, brown sugar. Bright acidity, long clean cocoa finish.',
    data: [
      { k: 'Lot', v: 'AM01 · Arabica' },
      { k: 'Block', v: 'Nagarakatte' },
      { k: 'Varietal', v: 'Arabica Selection 9' },
      { k: 'Elevation', v: '1,127 m' },
      { k: 'Fruit weight', v: '1.43 g' },
      { k: 'Bulk density', v: '0.74 g/cc' },
      { k: 'Brix at harvest', v: '20%' },
      { k: 'pH fruit → end', v: '6.0 → 4.2' },
      { k: 'Profile', v: 'Grapefruit, Red Apple, Raspberry' },
    ],
    process:
      'Cold-soaked below 10 °C for 48 hours. Anaerobic ferment for 8 days in a dark, closed room. Dried on raised beds in a dark room for 25 days — bagged at night, returned to the beds each morning.',
  },
  {
    id: 'BW01',
    eyebrow: 'Our table: 83.00 · specialty range',
    name: 'Coal Black',
    method: 'Banana Wash',
    headline: ['24 hr anaerobic + 48 hr banana leaf', 'Brix 19.25% · Agtron 53.1'],
    note: 'Dark chocolate, dried fruit, citrus, cocoa. Perfect uniformity and clean cup. Every banana leaf comes from the estate.',
    data: [
      { k: 'Lot', v: 'BW01 · Arabica' },
      { k: 'Block', v: 'One Gida Patte' },
      { k: 'Varietal', v: 'Arabica Selection 9' },
      { k: 'Elevation', v: '1,127 m' },
      { k: 'Fruit weight', v: '1.43 g' },
      { k: 'Bulk density', v: '0.74 g/cc' },
      { k: 'Brix at harvest', v: '21%' },
      { k: 'pH fruit → end', v: '6.5 → 4.2' },
      { k: 'Profile', v: 'Jasmine, Orange, Sweet Lime' },
    ],
    process:
      '24-hour anaerobic natural fermentation, then pulped and layered with estate-grown banana leaves for a 48-hour controlled ferment. Washed and slow-dried on raised beds for 18 days.',
  },
  {
    id: 'RH01',
    eyebrow: 'Our table: 82.25 · specialty range',
    name: 'Red Affair',
    method: 'Red Honey Anaerobic',
    headline: ['Mucilage on · anaerobic', 'Zero quakers · Agtron 64.5'],
    note: 'Clear citrus, spice, nuts, raisin. Zero defects — the score ceiling is roast development, not green quality.',
    data: [
      { k: 'Lot', v: 'RH01 · Arabica' },
      { k: 'Block', v: 'Charandi Patte' },
      { k: 'Varietal', v: 'Arabica Selection 9' },
      { k: 'Elevation', v: '1,127 m' },
      { k: 'Fruit weight', v: '1.43 g' },
      { k: 'Bulk density', v: '0.74 g/cc' },
      { k: 'Brix at harvest', v: '20%' },
      { k: 'pH fruit → end', v: '6.0 → 4.2' },
      { k: 'Profile', v: 'Orange Blossom, Grapefruit, Honey' },
    ],
    process:
      '48-hour anaerobic fermentation, then pulped with the mucilage retained. Dried at minimum thickness on raised beds for 5 days, then spread thin for up to 25 days under controlled conditions.',
  },
  {
    id: 'SMN01',
    eyebrow: 'Flagship',
    name: 'Solera Maceration',
    method: 'Carry-forward fermentation',
    headline: ['3-day ferment · 50% carry-forward', 'Brix 20.5% · pH 6.5 → 4.2'],
    note: 'Borrowed from sherry: a fraction of the previous batch carried forward as a live mother culture. One batch shapes every batch that follows.',
    data: [
      { k: 'Lot', v: 'SMN01 · Arabica' },
      { k: 'Block', v: 'Byton Patte' },
      { k: 'Varietal', v: 'Arabica Selection 9' },
      { k: 'Elevation', v: '1,127 m' },
      { k: 'Fruit weight', v: '1.43 g' },
      { k: 'Bulk density', v: '0.74 g/cc' },
      { k: 'Brix at harvest', v: '20.5%' },
      { k: 'pH fruit → end', v: '6.5 → 4.2' },
      { k: 'Profile', v: 'Blueberry Jam, Blackberry, Musk Melon' },
    ],
    process:
      'Sealed stainless-steel tank fermentation for 3 days. Half of the actively fermenting cherries blended with fresh harvest, alternating two-day ferment and rest cycles. Sun-dried by day, rested overnight in breathable bags to 12% moisture.',
  },
  {
    id: 'SMW01',
    eyebrow: 'Rarest',
    name: 'Solera Wash',
    method: 'Minimal intervention',
    headline: ['48 hr anaerobic · 3-day soak', 'Hand-washed · Brix 20%'],
    note: 'Everything non-essential stripped away. The smallest lot we have ever made, and the cleanest expression of the cherry.',
    data: [
      { k: 'Lot', v: 'SMW01 · Arabica' },
      { k: 'Block', v: 'Tenginamara Patte' },
      { k: 'Varietal', v: 'Arabica Selection 9' },
      { k: 'Elevation', v: '1,127 m' },
      { k: 'Fruit weight', v: '1.43 g' },
      { k: 'Bulk density', v: '0.74 g/cc' },
      { k: 'Brix at harvest', v: '20%' },
      { k: 'pH fruit → end', v: '6.5 → 4.2' },
      { k: 'Profile', v: 'Floral, Blood Lime, Brown Sugar' },
    ],
    process:
      '48-hour anaerobic fermentation. Half pulped, half remains with fresh cherries added for the Solera carry-forward. The pulped coffee is soaked three days with daily water changes, then washed and dried on raised beds for 20 days.',
  },
]

export const ROBUSTA_LOTS: Lot[] = [
  {
    id: 'AM01-R',
    eyebrow: 'National winner · Robusta Experimental',
    name: 'Appassimento Maceration',
    method: 'Robusta Old Peridenia',
    headline: ['Brix 28% · ripeness 97%+', '48 hr cold soak · 8-day anaerobic'],
    note: 'Blueberry, prunes, caramel. Robusta’s higher sugar transforms under the extended cold ferment — the highest Brix of any lot on the estate.',
    data: [
      { k: 'Lot', v: 'AM01 · Robusta' },
      { k: 'Block', v: 'T Line Robusta Patte' },
      { k: 'Varietal', v: 'Robusta Old Peridenia' },
      { k: 'Elevation', v: '1,127 m' },
      { k: 'Fruit weight', v: '1.05 g' },
      { k: 'Bulk density', v: '0.73 g/cc' },
      { k: 'Brix at harvest', v: '28%' },
      { k: 'pH fruit → end', v: '6.2 → 4.0' },
      { k: 'Profile', v: 'Blueberry, Prunes, Caramel' },
    ],
    process:
      'Cold-soaked below 10 °C for 48 hours. Anaerobic ferment for 8 days in a dark, closed room. Dried on raised beds in a dark room for 25 days — bagged at night, returned each morning. Ripeness 97%+.',
  },
  {
    id: 'VW01',
    eyebrow: 'National winner · Robusta Washed',
    name: 'Volcanic Wash',
    method: 'Robusta Old Peridenia',
    headline: ['Brix 27% · ripeness 97%+', '48 hr anaerobic · 3-day wash · 18-day dry'],
    note: 'Caramel, hazelnuts, brown sugar. Clean, structured, deeply sweet. The lot that proves specialty Robusta is not a contradiction.',
    data: [
      { k: 'Lot', v: 'VW01 · Robusta' },
      { k: 'Block', v: 'Gida Patte' },
      { k: 'Varietal', v: 'Robusta Old Peridenia' },
      { k: 'Elevation', v: '1,127 m' },
      { k: 'Fruit weight', v: '1.05 g' },
      { k: 'Bulk density', v: '0.73 g/cc' },
      { k: 'Brix at harvest', v: '27%' },
      { k: 'pH fruit → end', v: '6.2 → 4.0' },
      { k: 'Profile', v: 'Caramel, Hazelnuts, Brown Sugar' },
    ],
    process:
      '48-hour anaerobic fermentation. Pulped and soaked in water for three days with daily fresh water changes. Washed and slow-dried on raised beds for 18 days. Ripeness 97%+.',
  },
  {
    id: 'G01',
    eyebrow: 'Proprietary process',
    name: 'Grappa',
    method: 'Cascara-derived G1 culture',
    headline: ['Brix 26% · ripeness 97%+', '6-day G1 bacterial ferment · 18-day dry'],
    note: 'Black grape, mixed berry jam, molasses. A bacterial strain cultured from our own wet cascara — a process we have not found written down anywhere else, yet.',
    data: [
      { k: 'Lot', v: 'G01 · Robusta' },
      { k: 'Block', v: 'Shed Patte' },
      { k: 'Varietal', v: 'Robusta Old Peridenia' },
      { k: 'Elevation', v: '1,127 m' },
      { k: 'Fruit weight', v: '1.05 g' },
      { k: 'Bulk density', v: '0.73 g/cc' },
      { k: 'Brix at harvest', v: '26%' },
      { k: 'pH fruit → end', v: '6.2 → 4.0' },
      { k: 'Profile', v: 'Black Grape, Berry Jam, Molasses' },
    ],
    process:
      'Fermented for six days with the proprietary G1 bacterial strain developed from wet coffee cascara, applied layer-by-layer with the cherries. Slow-dried on raised beds for 18 days. Ripeness 97%+.',
  },
]

type Block = {
  id: string
  name: string
  varietal: string
  lots: string
  brix: string
  shade: string
  trees: string
  desc: string
  /* Map geometry, lifted from the roaster draft's own SVG so the
     estate reads as a shape rather than a list. viewBox 0 0 600 450. */
  d: string
  lx: number
  ly: number
}

const BLOCKS: Block[] = [
  { id: 'nagarakatte', d: 'M204,132 C196,147 170,160 149,166 C129,171 96,175 80,167 C63,158 52,132 50,114 C49,96 55,71 69,60 C83,49 113,47 135,49 C157,51 188,57 199,71 C211,85 212,116 204,132 Z', lx: 126, ly: 108, name: 'Nagarakatte', varietal: 'Arabica Selection 9', lots: 'AM01 — Appassimento Maceration', brix: '20%', shade: 'Silver Oak, Rosewood, Fig', trees: '~4,500', desc: 'The Appassimento block. Cold-fermented below 10 °C, dried in a dark room for 25 days — the block that produced the SCA 84.25 lot. High canopy density, cool microclimate.' },
  { id: 'byton', d: 'M383,86 C388,102 387,130 373,142 C359,154 324,158 300,158 C276,157 242,151 230,139 C218,126 220,101 226,84 C232,67 245,43 264,36 C284,29 321,34 340,42 C360,50 377,69 383,86 Z', lx: 302, ly: 98, name: 'Byton Patte', varietal: 'Arabica Selection 9', lots: 'DO01 — Dry Osmosis · SMN01 — Solera Maceration', brix: '20–20.5%', shade: 'Silver Oak, Jackfruit, Wild Fig', trees: '~5,200', desc: 'Two flagship lots from a single block. The 85.25 Dry Osmosis and the Solera Maceration both draw from Byton’s dense shade canopy and well-drained laterite soil. The estate’s highest-scoring Arabica zone.' },
  { id: 'tenginamara', d: 'M541,146 C529,160 499,167 478,168 C457,169 426,163 414,151 C402,138 402,112 405,94 C408,75 417,48 433,40 C450,31 483,36 503,44 C522,51 543,68 550,85 C556,102 553,132 541,146 Z', lx: 474, ly: 104, name: 'Tenginamara Patte', varietal: 'Arabica Selection 9', lots: 'SMW01 — Solera Wash', brix: '20%', shade: 'Silver Oak, Teak, native canopy', trees: '~3,800', desc: 'The Solera Wash block. 48-hour anaerobic, Solera carry-forward, 3-day soak, hand-washed. Minimal intervention — the cleanest expression of the cherry, and the rarest lot on the estate.' },
  { id: 'charandi', d: 'M183,223 C192,239 199,266 191,281 C184,295 156,309 136,312 C116,316 86,314 72,304 C58,293 52,268 52,250 C52,232 57,207 71,196 C86,185 118,180 137,184 C155,189 174,207 183,223 Z', lx: 120, ly: 250, name: 'Charandi Patte', varietal: 'Arabica Selection 9', lots: 'RH01 — Red Honey Anaerobic', brix: '20%', shade: 'Mixed native, Silver Oak', trees: '~4,100', desc: 'The Red Honey block. Mucilage-on drying after an anaerobic ferment. The Q grader notes a citrus core with room to climb as the roast develops. Zero defects, perfect clean cup.' },
  { id: 'onegida', d: 'M385,254 C381,270 357,286 337,295 C317,304 284,312 265,307 C246,301 227,278 221,262 C215,245 216,221 228,208 C240,196 270,188 292,187 C315,185 347,188 362,199 C378,211 389,238 385,254 Z', lx: 298, ly: 244, name: 'One Gida Patte', varietal: 'Arabica Selection 9', lots: 'BW01 — Banana Wash', brix: '21%', shade: 'Banana, Silver Oak, mixed native', trees: '~4,800', desc: 'The Banana Wash block. Estate-grown banana leaves layered with pulped cherries for 48 hours. The highest Brix among the Arabica lots, and the most distinctly Indian process on the estate.' },
  { id: 'tline', d: 'M533,204 C547,218 560,244 556,260 C552,276 527,293 507,301 C488,309 458,315 441,309 C423,302 407,280 401,262 C396,244 394,216 406,202 C418,189 451,179 472,180 C493,180 519,191 533,204 Z', lx: 474, ly: 246, name: 'T Line Robusta Patte', varietal: 'Robusta Old Peridenia', lots: 'AM01 — Appassimento Maceration (Robusta)', brix: '28%', shade: 'Dense four-storey canopy', trees: '~3,600', desc: 'National winner — Robusta Experimental. Brix 28%, the highest of any lot on the estate. Heritage Old Peridenia under dense shade, transformed by the same cold-ferment Appassimento technique.' },
  { id: 'shed', d: 'M242,404 C232,417 205,427 185,430 C164,433 132,431 118,422 C104,412 100,388 101,371 C102,355 110,332 125,323 C140,314 173,313 192,318 C212,323 235,336 243,351 C251,365 251,390 242,404 Z', lx: 172, ly: 374, name: 'Shed Patte', varietal: 'Robusta Old Peridenia', lots: 'G01 — Grappa', brix: '26%', shade: 'Mixed canopy, estate infrastructure', trees: '~3,200', desc: 'The Grappa block. Home of the proprietary G1 bacterial strain cultured from wet coffee cascara, applied layer-by-layer through a six-day fermentation. Available for allocation.' },
  { id: 'gida', d: 'M430,355 C437,371 439,396 426,409 C414,422 381,431 357,433 C332,434 296,429 281,417 C266,406 265,380 269,363 C273,347 286,326 305,317 C324,308 363,305 384,311 C405,317 423,338 430,355 Z', lx: 350, ly: 372, name: 'Gida Patte', varietal: 'Robusta Old Peridenia', lots: 'VW01 — Volcanic Wash', brix: '27%', shade: 'Dense mixed canopy', trees: '~3,400', desc: 'National winner — Robusta Washed. Pulped after a 48-hour anaerobic ferment, soaked three days with daily water changes. Clean, structured, deeply sweet.' },
]

/* ── lot cards — tap for lot data ───────────────────────────────── */

function LotCard({ lot }: { lot: Lot }) {
  const [open, setOpen] = useState(false)
  return (
    /* backdrop-filter inline: styled-jsx drops it from emitted rules on
       this build, the same way it does for the menu vignette. */
    <article className={`lc ${open ? 'is-open' : ''}`} style={{ backdropFilter: 'blur(18px) saturate(120%)', WebkitBackdropFilter: 'blur(18px) saturate(120%)' }}>
      <span className="lc-head">
        <span className="lc-badge">{lot.eyebrow}</span>
        <h3 className="lc-n">{lot.name}</h3>
        <p className="lc-m">{lot.method}</p>
      </span>

      <p className="lc-b">{lot.note}</p>

      <button
        type="button"
        className="lc-toggle"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
      >
        {open ? 'Hide lot data' : 'Show lot data'}
        <CaretDown size={12} weight="bold" className="lc-caret" aria-hidden />
      </button>

      {open && (
        <div className="lc-panel">
          <dl className="lc-dl">
            {lot.data.map((r) => (
              <div key={r.k} className="lc-r">
                <dt className="lc-k">{r.k}</dt>
                <dd className="lc-v">{r.v}</dd>
              </div>
            ))}
          </dl>
          <p className="lc-p">{lot.process}</p>
        </div>
      )}

      <style jsx>{`
        /* A ground of their own. These sit over the chapter's
           photograph, and a transparent card left the type fighting
           whatever was behind it. The blur separates the card from the
           picture without hiding it — you can still see the frame move
           underneath. */
        .lc {
          display: flex; flex-direction: column; gap: var(--space-5);
          background: rgba(12, 14, 15, 0.74); color: #fff;
          border: 1px solid rgba(255, 255, 255, 0.14);
          border-radius: var(--radius-1);
          padding: clamp(22px, 2.4vw, 32px);
          transition: border-color var(--dur-base) var(--ease),
                      background var(--dur-base) var(--ease);
        }
        .lc:hover {
          border-color: rgba(255, 255, 255, 0.3);
          background: rgba(12, 14, 15, 0.82);
        }

        /* name, grade and method read as one lock-up */
        .lc-head { display: flex; flex-direction: column; gap: 6px; }
        .lc-n {
          flex: 1 1 auto; min-width: 0;
          font-family: var(--font-grotesque), sans-serif;
          font-weight: 400; color: #fff;
          font-size: clamp(22px, 2.2vw, 30px); line-height: 1.1;
          letter-spacing: -0.03em; margin: 0;
        }
        .lc-badge {
            /* Matches .bx-de: an eyebrow above the name, in the accent,
               rather than a pill beside it. */
            font-family: var(--font-mono), monospace;
            font-size: 11px; font-weight: 500;
            letter-spacing: 1px; text-transform: uppercase;
            color: var(--brand-accent);
            display: block; margin: 0 0 var(--space-3);
        }
        .lc-m {
          font-family: var(--font-mono), monospace;
          font-size: 11px; letter-spacing: 1px; text-transform: uppercase;
          color: rgba(255, 255, 255, 0.6); margin: 0;
        }
        .lc-b {
          font-size: var(--p1-size); line-height: var(--p1-lh);
          color: rgba(255, 255, 255, 0.8); margin: 0;
        }

        /* the accordion control */
        .lc-toggle {
          align-self: flex-start;
          display: inline-flex; align-items: center; gap: 8px;
          background: transparent; border: none; padding: 0;
          cursor: pointer;
          font-family: var(--font-mono), monospace;
          font-size: 11px; letter-spacing: 1px; text-transform: uppercase;
          color: rgba(255, 255, 255, 0.6);
          transition: color var(--dur-base) var(--ease);
        }
        .lc-toggle:hover { color: #fff; }
        .lc-toggle :global(.lc-caret) {
          transition: transform var(--dur-base) var(--ease);
        }
        .is-open .lc-toggle :global(.lc-caret) { transform: rotate(180deg); }

        .lc-panel {
          display: flex; flex-direction: column; gap: var(--space-4);
          animation: lc-open 0.28s var(--ease);
        }
        @keyframes lc-open {
          from { opacity: 0; transform: translateY(-4px); }
          to { opacity: 1; transform: none; }
        }

        .lc-dl { display: flex; flex-direction: column; margin: 0; }
        .lc-r {
          display: flex; justify-content: space-between; gap: var(--space-4);
          align-items: baseline;
          padding: 7px 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        .lc-r:first-child { border-top: 1px solid rgba(255, 255, 255, 0.1); }
        .lc-k {
          font-family: var(--font-mono), monospace;
          font-size: 11px; letter-spacing: 1px; text-transform: uppercase;
          color: rgba(255, 255, 255, 0.5); white-space: nowrap; margin: 0;
        }
        /* .p1 scale — 16px / 1.55, light on the black ground */
        .lc-v {
          font-family: var(--font-sans);
          font-size: 16px; line-height: 1.55; text-align: right;
          color: rgba(255, 255, 255, 0.92); margin: 0;
        }

        .lc-p {
          font-size: 13px; line-height: 1.6;
          color: rgba(255, 255, 255, 0.62); margin: 0;
        }
      `}</style>
    </article>
  )
}

export function LotCards({ title, intro, lots }: {
  title: string
  intro?: string
  lots: Lot[]
}) {
  return (
    <section className="lots">
      <div className="section-w">
        <h2 className="lots-h">{title}</h2>
        {intro && <p className="lots-i">{intro}</p>}
        <div className="lots-g">
          {lots.map((lot) => <LotCard key={lot.id} lot={lot} />)}
        </div>
      </div>

      <style jsx>{`
        .lots {
          /* Transparent, above the chapter backdrop. A black ground here
             sat on top of the photographs and broke the run. */
          position: relative; z-index: 1;
          background: var(--brand-green); color: #fff;
          padding: clamp(104px, 16vh, 196px) 0;
        }
        .lots-h {
          font-family: var(--font-grotesque), sans-serif; font-weight: 400;
          font-size: clamp(30px, 4vw, 58px); line-height: 1.04;
          letter-spacing: -0.04em; color: #fff; margin: 0; max-width: 18ch;
        }
        .lots-i {
          font-size: var(--p1-size); line-height: var(--p1-lh);
          color: rgba(255, 255, 255, 0.72);
          margin: var(--space-5) 0 0; max-width: 52ch;
        }
        .lots-g {
          display: grid; gap: var(--space-5);
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          margin-top: var(--space-9);
          align-items: start;
        }
      `}</style>
    </section>
  )
}

/* ── block explorer — the estate, block by block ────────────────── */

export function BlockExplorer() {
  /* Opens on the first block. An empty panel beside a map is a prompt
     to do work before the page shows anything, and the reader has not
     been told yet that the blocks are clickable — showing one answers
     that by demonstration. */
  const [sel, setSel] = useState<Block | null>(BLOCKS[0])
  return (
    <section className="bx">
      <div className="section-w">
        <h2 className="bx-h">150 acres. Eight blocks. Every zone mapped.</h2>
        <p className="bx-i">
          Each block has its own microclimate, shade composition, soil
          profile and coffee character. Select one to see what grows there,
          what it feeds, and what the data says about the zone.
        </p>

        <div className="bx-grid">
          {/* the estate, as a shape */}
          <svg className="bx-map" viewBox="0 0 600 450" role="group" aria-label="Estate block map">
            {BLOCKS.map((b) => {
              const on = sel?.id === b.id
              return (
                <g key={b.id}>
                  <path
                    className={`bx-zone ${on ? 'is-on' : ''}`}
                    d={b.d}
                    tabIndex={0}
                    role="button"
                    aria-pressed={on}
                    aria-label={`${b.name} — ${b.varietal}`}
                    onClick={() => setSel(b)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSel(b) }
                    }}
                  />
                  <text className={`bx-zl ${on ? 'is-on' : ''}`} x={b.lx} y={b.ly}>{b.name}</text>
                </g>
              )
            })}
          </svg>

          <div className="bx-panel" aria-live="polite" style={{ backdropFilter: 'blur(18px) saturate(120%)', WebkitBackdropFilter: 'blur(18px) saturate(120%)' }}>
            {sel ? (
              <div className="bx-d">
                <p className="bx-de">{sel.varietal} · 1,127 m</p>
                <h3 className="bx-dn">{sel.name}</h3>
                <div className="bx-rows">
                  <span className="bx-r"><span className="bx-k">Lots</span><span className="bx-v">{sel.lots}</span></span>
                  <span className="bx-r"><span className="bx-k">Brix</span><span className="bx-v">{sel.brix}</span></span>
                  <span className="bx-r"><span className="bx-k">Trees</span><span className="bx-v">{sel.trees}</span></span>
                  <span className="bx-r"><span className="bx-k">Shade</span><span className="bx-v">{sel.shade}</span></span>
                </div>
                <p className="bx-db">{sel.desc}</p>
              </div>
            ) : (
              <p className="bx-empty">Choose a block to begin</p>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .bx {
          /* Transparent, above the chapter backdrop. A black ground here
             sat on top of the photographs and broke the run. */
          position: relative; z-index: 1;
          background: var(--brand-green); color: #fff;
          padding: clamp(104px, 16vh, 196px) 0;
        }
        .bx-h {
          font-family: var(--font-grotesque), sans-serif; font-weight: 400;
          font-size: clamp(30px, 4vw, 58px); line-height: 1.04;
          letter-spacing: -0.04em; color: #fff; margin: 0; max-width: 18ch;
        }
        .bx-i {
          font-size: var(--p1-size); line-height: var(--p1-lh);
          color: rgba(255, 255, 255, 0.72);
          margin: var(--space-5) 0 0; max-width: 52ch;
        }

        .bx-grid {
          display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
          gap: var(--grid-gap); margin-top: var(--space-9);
          align-items: start;
        }
        /* The block's detail on the left, the map on the right. Reordered
           here rather than in the markup so the map still comes first in
           the document — it is the control, and a keyboard reaches it
           before the panel it fills. */
        .bx-map { order: 2; }
        :global(.bx-panel) { order: 1; }
        @media (max-width: 860px) {
          /* Stacked, the map leads again: you cannot read a panel about a
             block you have not been shown yet. */
          .bx-map { order: 1; }
          :global(.bx-panel) { order: 2; }
        }

        .bx-map { width: 100%; aspect-ratio: 4 / 3; overflow: visible; }
        /* All one white. The blocks used to each carry their own green or
           brown, which read as a data encoding — eight colours implying
           eight categories that do not exist. They are the same kind of
           thing, so they are the same colour, and selection is the only
           state the map has to show. */
        :global(.bx-zone) {
          cursor: pointer;
          fill: #fff;
          fill-opacity: 0.14;
          stroke: rgba(255, 255, 255, 0.55);
          stroke-width: 1.5;
          transition: fill-opacity var(--dur-base) var(--ease),
                      stroke var(--dur-base) var(--ease);
        }
        :global(.bx-zone):hover { fill-opacity: 0.3; stroke: #fff; }
        :global(.bx-zone):focus-visible { outline: none; stroke: #fff; stroke-width: 2.5; }
        /* Selected reads as solid, so the label inverts to sit on it. */
        :global(.bx-zone.is-on) { fill-opacity: 1; stroke: #fff; stroke-width: 2; }
        :global(.bx-zl) {
          font-family: var(--font-mono), monospace;
          font-size: 9px; letter-spacing: 0.5px; text-transform: uppercase;
          fill: rgba(255, 255, 255, 0.92);
          pointer-events: none; text-anchor: middle; dominant-baseline: central;
          transition: fill var(--dur-base) var(--ease);
        }
        :global(.bx-zl.is-on) { fill: #0B0B0B; }

        .bx-panel {
          border: 1px solid rgba(255, 255, 255, 0.16);
          border-radius: var(--radius-1);
          padding: clamp(24px, 3vw, 44px);
          min-height: 320px;
          display: flex; align-items: center;
        }
        .bx-empty {
          font-family: var(--font-mono), monospace;
          font-size: 12px; letter-spacing: 1px; text-transform: uppercase;
          color: rgba(255, 255, 255, 0.4); margin: 0;
        }
        .bx-d { width: 100%; }
        .bx-de {
          font-family: var(--font-mono), monospace;
          font-size: 11px; letter-spacing: 1px; text-transform: uppercase;
          color: var(--brand-accent); margin: 0 0 var(--space-3);
        }
        .bx-dn {
          font-family: var(--font-grotesque), sans-serif; font-weight: 400;
          font-size: clamp(24px, 2.6vw, 38px); line-height: 1.08;
          letter-spacing: -0.03em; color: #fff; margin: 0 0 var(--space-5);
        }
        .bx-rows { display: flex; flex-direction: column; margin-bottom: var(--space-5); }
        .bx-r {
          display: flex; justify-content: space-between; gap: var(--space-5);
          align-items: baseline;
          padding: 8px 0; border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        .bx-r:first-child { border-top: 1px solid rgba(255, 255, 255, 0.1); }
        .bx-k {
          font-family: var(--font-mono), monospace;
          font-size: 11px; letter-spacing: 1px; text-transform: uppercase;
          color: rgba(255, 255, 255, 0.5);
        }
        .bx-v {
          font-family: var(--font-sans);
          font-size: 16px; line-height: 1.55; text-align: right;
          color: rgba(255, 255, 255, 0.92);
        }
        .bx-db {
          font-size: var(--p1-size); line-height: var(--p1-lh);
          color: rgba(255, 255, 255, 0.78); margin: 0;
        }

        @media (max-width: 860px) {
          .bx-grid { grid-template-columns: 1fr; }
          .bx-panel { min-height: 0; }
        }
      `}</style>
    </section>
  )

}

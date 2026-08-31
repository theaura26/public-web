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
  fill: string
  lx: number
  ly: number
}

const BLOCKS: Block[] = [
  { id: 'nagarakatte', d: 'M50,50 L200,30 L220,120 L180,180 L60,160 Z', fill: '#5B7F5B', lx: 130, ly: 100, name: 'Nagarakatte', varietal: 'Arabica Selection 9', lots: 'AM01 — Appassimento Maceration', brix: '20%', shade: 'Silver Oak, Rosewood, Fig', trees: '~4,500', desc: 'The Appassimento block. Cold-fermented below 10 °C, dried in a dark room for 25 days — the block that produced the SCA 84.25 lot. High canopy density, cool microclimate.' },
  { id: 'byton', d: 'M210,30 L380,20 L400,100 L370,160 L230,120 Z', fill: '#6B8F4B', lx: 300, ly: 80, name: 'Byton Patte', varietal: 'Arabica Selection 9', lots: 'DO01 — Dry Osmosis · SMN01 — Solera Maceration', brix: '20–20.5%', shade: 'Silver Oak, Jackfruit, Wild Fig', trees: '~5,200', desc: 'Two flagship lots from a single block. The 85.25 Dry Osmosis and the Solera Maceration both draw from Byton’s dense shade canopy and well-drained laterite soil. The estate’s highest-scoring Arabica zone.' },
  { id: 'tenginamara', d: 'M400,20 L550,50 L560,150 L410,110 Z', fill: '#4B7F6B', lx: 480, ly: 85, name: 'Tenginamara Patte', varietal: 'Arabica Selection 9', lots: 'SMW01 — Solera Wash', brix: '20%', shade: 'Silver Oak, Teak, native canopy', trees: '~3,800', desc: 'The Solera Wash block. 48-hour anaerobic, Solera carry-forward, 3-day soak, hand-washed. Minimal intervention — the cleanest expression of the cherry, and the rarest lot on the estate.' },
  { id: 'charandi', d: 'M60,170 L180,190 L200,280 L80,300 Z', fill: '#7B8F5B', lx: 130, ly: 240, name: 'Charandi Patte', varietal: 'Arabica Selection 9', lots: 'RH01 — Red Honey Anaerobic', brix: '20%', shade: 'Mixed native, Silver Oak', trees: '~4,100', desc: 'The Red Honey block. Mucilage-on drying after an anaerobic ferment. The Q grader notes a citrus core with room to climb as the roast develops. Zero defects, perfect clean cup.' },
  { id: 'onegida', d: 'M190,190 L370,170 L380,260 L210,290 Z', fill: '#5B8F7B', lx: 280, ly: 230, name: 'One Gida Patte', varietal: 'Arabica Selection 9', lots: 'BW01 — Banana Wash', brix: '21%', shade: 'Banana, Silver Oak, mixed native', trees: '~4,800', desc: 'The Banana Wash block. Estate-grown banana leaves layered with pulped cherries for 48 hours. The highest Brix among the Arabica lots, and the most distinctly Indian process on the estate.' },
  { id: 'tline', d: 'M380,170 L560,160 L570,270 L390,270 Z', fill: '#8B6F4B', lx: 470, ly: 220, name: 'T Line Robusta Patte', varietal: 'Robusta Old Peridenia', lots: 'AM01 — Appassimento Maceration (Robusta)', brix: '28%', shade: 'Dense four-storey canopy', trees: '~3,600', desc: 'National winner — Robusta Experimental. Brix 28%, the highest of any lot on the estate. Heritage Old Peridenia under dense shade, transformed by the same cold-ferment Appassimento technique.' },
  { id: 'shed', d: 'M80,310 L210,300 L230,390 L100,410 Z', fill: '#7B6F5B', lx: 155, ly: 355, name: 'Shed Patte', varietal: 'Robusta Old Peridenia', lots: 'G01 — Grappa', brix: '26%', shade: 'Mixed canopy, estate infrastructure', trees: '~3,200', desc: 'The Grappa block. Home of the proprietary G1 bacterial strain cultured from wet coffee cascara, applied layer-by-layer through a six-day fermentation. Available for allocation.' },
  { id: 'gida', d: 'M220,300 L390,280 L420,380 L240,400 Z', fill: '#6B7F4B', lx: 310, ly: 340, name: 'Gida Patte', varietal: 'Robusta Old Peridenia', lots: 'VW01 — Volcanic Wash', brix: '27%', shade: 'Dense mixed canopy', trees: '~3,400', desc: 'National winner — Robusta Washed. Pulped after a 48-hour anaerobic ferment, soaked three days with daily water changes. Clean, structured, deeply sweet.' },
]

/* ── lot cards — tap for lot data ───────────────────────────────── */

function LotCard({ lot }: { lot: Lot }) {
  const [open, setOpen] = useState(false)
  return (
    <article className={`lc ${open ? 'is-open' : ''}`}>
      <span className="lc-head">
        <span className="lc-top">
          <h3 className="lc-n">{lot.name}</h3>
          <span className="lc-badge">{lot.eyebrow}</span>
        </span>
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
        .lc {
          display: flex; flex-direction: column; gap: var(--space-5);
          background: transparent; color: #fff;
          border: 1px solid rgba(255, 255, 255, 0.14);
          border-radius: var(--radius-1);
          padding: clamp(22px, 2.4vw, 32px);
          transition: border-color var(--dur-base) var(--ease),
                      background var(--dur-base) var(--ease);
        }
        .lc:hover {
          border-color: rgba(255, 255, 255, 0.3);
          background: rgba(255, 255, 255, 0.03);
        }

        /* name, grade and method read as one lock-up */
        .lc-head { display: flex; flex-direction: column; gap: 6px; }
        .lc-top {
          display: flex; align-items: flex-start;
          justify-content: space-between; gap: var(--space-4);
        }
        .lc-n {
          flex: 1 1 auto; min-width: 0;
          font-family: var(--font-grotesque), sans-serif;
          font-weight: 400; color: #fff;
          font-size: clamp(22px, 2.2vw, 30px); line-height: 1.1;
          letter-spacing: -0.03em; margin: 0;
        }
        .lc-badge {
          font-family: var(--font-mono), monospace;
          font-size: 9px; line-height: 1.4;
          letter-spacing: 0.8px; text-transform: uppercase;
          color: rgba(255, 255, 255, 0.72);
          border: 1px solid rgba(255, 255, 255, 0.24);
          border-radius: 999px;
          padding: 4px 10px;
          text-align: right; flex: 0 1 auto; max-width: 52%;
          margin-top: 4px;
        }
        .lc-m {
          font-family: var(--font-mono), monospace;
          font-size: 11px; letter-spacing: 1px; text-transform: uppercase;
          color: rgba(255, 255, 255, 0.6); margin: 0;
        }
        .lc-b {
          font-size: 15px; line-height: 1.55;
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
          background: #000; color: #fff;
          padding: clamp(104px, 16vh, 196px) 0;
        }
        .lots-h {
          font-family: var(--font-grotesque), sans-serif; font-weight: 400;
          font-size: clamp(30px, 4vw, 58px); line-height: 1.04;
          letter-spacing: -0.04em; color: #fff; margin: 0; max-width: 18ch;
        }
        .lots-i {
          font-size: clamp(16px, 1.5vw, 19px); line-height: 1.6;
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
  const [sel, setSel] = useState<Block | null>(null)
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
                    fill={b.fill}
                    tabIndex={0}
                    role="button"
                    aria-pressed={on}
                    aria-label={`${b.name} — ${b.varietal}`}
                    onClick={() => setSel(b)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSel(b) }
                    }}
                  />
                  <text className="bx-zl" x={b.lx} y={b.ly}>{b.name}</text>
                </g>
              )
            })}
          </svg>

          <div className="bx-panel" aria-live="polite">
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
          background: #000; color: #fff;
          padding: clamp(104px, 16vh, 196px) 0;
        }
        .bx-h {
          font-family: var(--font-grotesque), sans-serif; font-weight: 400;
          font-size: clamp(30px, 4vw, 58px); line-height: 1.04;
          letter-spacing: -0.04em; color: #fff; margin: 0; max-width: 18ch;
        }
        .bx-i {
          font-size: clamp(16px, 1.5vw, 19px); line-height: 1.6;
          color: rgba(255, 255, 255, 0.72);
          margin: var(--space-5) 0 0; max-width: 52ch;
        }

        .bx-grid {
          display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
          gap: var(--grid-gap); margin-top: var(--space-9);
          align-items: start;
        }

        .bx-map { width: 100%; aspect-ratio: 4 / 3; overflow: visible; }
        :global(.bx-zone) {
          cursor: pointer;
          stroke: #000; stroke-width: 2;
          opacity: 0.62;
          transition: opacity var(--dur-base) var(--ease),
                      stroke var(--dur-base) var(--ease);
        }
        :global(.bx-zone):hover { opacity: 0.85; stroke: rgba(255,255,255,0.5); }
        :global(.bx-zone):focus-visible { outline: none; stroke: #fff; stroke-width: 2.5; }
        :global(.bx-zone.is-on) { opacity: 1; stroke: #fff; stroke-width: 2.5; }
        :global(.bx-zl) {
          font-family: var(--font-mono), monospace;
          font-size: 9px; letter-spacing: 0.5px; text-transform: uppercase;
          fill: rgba(255, 255, 255, 0.92);
          pointer-events: none; text-anchor: middle; dominant-baseline: central;
        }

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
          font-size: 15px; line-height: 1.6;
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

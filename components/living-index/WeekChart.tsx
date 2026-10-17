'use client'

import { useEffect, useRef, useState } from 'react'
import { amount, dayMonth, monthOf, type Week } from '@/lib/living-index/herd-logs'

/* A week-by-week column chart for one log: each column is that week's
 * average per logged day. One series, so no legend; the caption names it.
 * Hover or arrow keys show the week's figures; the same figures sit in the
 * table beneath the chart, so nothing is reachable by hover alone. */

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)

const PLOT_H = 132
const AXIS_H = 22
const TOP = 8

function niceMax(v: number): number {
  if (v <= 0) return 1
  const p = 10 ** Math.floor(Math.log10(v))
  for (const m of [1, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10]) if (m * p >= v) return m * p
  return 10 * p
}

export default function WeekChart({
  weeks, unit, caption, compact = false,
}: { weeks: Week[]; unit: 'litres' | 'kilograms'; caption: string; compact?: boolean }) {
  const box = useRef<HTMLDivElement>(null)
  const [w, setW] = useState(0)
  const [active, setActive] = useState<number | null>(null)
  const plotH = compact ? 88 : PLOT_H

  useEffect(() => {
    const el = box.current
    if (!el) return
    // Measure once straight away, then follow resizes. The first measure
    // does not wait for the observer, which only reports on a painted frame.
    const t = setTimeout(() => setW(Math.round(el.clientWidth)), 0)
    const ro = new ResizeObserver(([e]) => setW(Math.round(e.contentRect.width)))
    ro.observe(el)
    return () => { clearTimeout(t); ro.disconnect() }
  }, [])

  const max = niceMax(Math.max(...weeks.map((x) => x.perDay), 0))
  const ticks = [0, max / 2, max]
  const tick = (t: number) => (t === 0 || Number.isInteger(t) ? String(t) : String(Math.round(t * 10) / 10))
  const left = 34
  const plotW = Math.max(0, w - left)
  const slot = weeks.length ? plotW / weeks.length : 0
  const barW = Math.max(2, Math.min(24, slot - 2))
  const y = (v: number) => TOP + plotH - (v / max) * plotH
  const shown = active === null ? null : weeks[active]

  const onMove = (e: React.PointerEvent<SVGSVGElement>) => {
    const r = e.currentTarget.getBoundingClientRect()
    const i = Math.floor((e.clientX - r.left - left) / slot)
    setActive(i >= 0 && i < weeks.length ? i : null)
  }
  const onKey = (e: React.KeyboardEvent<SVGSVGElement>) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); setActive((a) => Math.min(weeks.length - 1, (a ?? -1) + 1)) }
    if (e.key === 'ArrowLeft') { e.preventDefault(); setActive((a) => Math.max(0, (a ?? weeks.length) - 1)) }
    if (e.key === 'Escape') setActive(null)
  }

  return (
    <figure className={`li-wk${compact ? ' is-compact' : ''}`}>
      <figcaption className="label li-wk__cap">{caption}</figcaption>
      <div className="li-wk__box" ref={box} style={{ height: TOP + plotH + AXIS_H }}>
        {w > 0 && (
          <svg
            width={w}
            height={TOP + plotH + AXIS_H}
            role="img"
            aria-label={`${caption}. ${weeks.length} weeks, from the week of ${dayMonth(weeks[0]?.start ?? '')}. Use the arrow keys to read each week.`}
            tabIndex={0}
            onPointerMove={onMove}
            onPointerLeave={() => setActive(null)}
            onFocus={() => setActive((a) => a ?? weeks.length - 1)}
            onBlur={() => setActive(null)}
            onKeyDown={onKey}
          >
            {ticks.map((t) => (
              <g key={t}>
                <line x1={left} x2={w} y1={y(t)} y2={y(t)} className="li-wk__grid" />
                <text x={left - 8} y={y(t)} className="li-wk__tick" textAnchor="end" dominantBaseline="middle">{tick(t)}</text>
              </g>
            ))}
            {weeks.map((wk, i) => {
              const h = Math.max(1, (wk.perDay / max) * plotH)
              const x = left + i * slot + (slot - barW) / 2
              const top = TOP + plotH - h
              const r = Math.min(4, barW / 2, h)
              return (
                <path
                  key={wk.start}
                  className={`li-wk__bar${active === i ? ' is-on' : ''}`}
                  d={`M${x},${TOP + plotH} V${top + r} Q${x},${top} ${x + r},${top} H${x + barW - r} Q${x + barW},${top} ${x + barW},${top + r} V${TOP + plotH} Z`}
                />
              )
            })}
            {(() => {
              // A label per month, skipping one that would crowd the last.
              let lastX = -Infinity
              return weeks.map((wk, i) => {
                const prev = weeks[i - 1]
                const x = left + i * slot + 1
                if ((prev && monthOf(prev.start) === monthOf(wk.start)) || x - lastX < 30) return null
                lastX = x
                return (
                  <text key={`m-${wk.start}`} x={x} y={TOP + plotH + 15} className="li-wk__tick">
                    {monthOf(wk.start)}
                  </text>
                )
              })
            })()}
          </svg>
        )}
        {shown && active !== null && w > 0 && (
          <div
            className="li-wk__tip"
            style={{
              left: Math.min(Math.max(left + active * slot + slot / 2, 70), w - 70),
              top: Math.max(0, y(shown.perDay) - 8),
            }}
            aria-live="polite"
          >
            <span className="li-wk__tipv">{amount(shown.perDay)} {unit} per logged day</span>
            <span className="li-wk__tipd">Week of {dayMonth(shown.start)} · {shown.days} {shown.days === 1 ? 'day' : 'days'} logged</span>
          </div>
        )}
      </div>
      <details className="li-wk__table">
        <summary className="label">Week by week</summary>
        <table>
          <thead><tr><th scope="col">Week of</th><th scope="col">{cap(unit)} / logged day</th><th scope="col">Days logged</th><th scope="col">Total {unit}</th></tr></thead>
          <tbody>
            {weeks.map((wk) => (
              <tr key={wk.start}><td>{dayMonth(wk.start)}</td><td>{amount(wk.perDay)}</td><td>{wk.days}</td><td>{amount(wk.total)}</td></tr>
            ))}
          </tbody>
        </table>
      </details>
      <style jsx global>{`
        .li-wk { margin: 0; display: flex; flex-direction: column; gap: var(--space-3); min-width: 0; }
        .li-wk__cap { margin: 0; color: var(--text-muted); }
        .li-wk__box { position: relative; width: 100%; }
        .li-wk svg { display: block; overflow: visible; outline: none; touch-action: pan-y; }
        .li-wk svg:focus-visible { box-shadow: 0 0 0 2px var(--brand-accent); border-radius: var(--radius-1); }
        .li-wk__grid { stroke: var(--border); stroke-width: 1; }
        .li-wk__tick { fill: var(--text-muted); font-family: var(--font-mono); font-size: 10px; letter-spacing: 0.5px; font-variant-numeric: tabular-nums; }
        .li-wk__bar { fill: var(--li-chart); transition: fill var(--dur-fast) var(--ease); }
        .li-wk__bar.is-on { fill: var(--brand-accent); }
        .li-wk__tip {
          position: absolute; transform: translate(-50%, -100%); pointer-events: none;
          display: flex; flex-direction: column; gap: 2px; white-space: nowrap;
          background: var(--bg); border: 1px solid var(--border-strong); border-radius: var(--radius-2);
          padding: 6px 10px; box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
        }
        .li-wk__tipv { font-family: var(--font-sans); font-size: 14px; color: var(--text); }
        .li-wk__tipd { font-family: var(--font-mono); font-size: 10px; letter-spacing: 0.5px; text-transform: uppercase; color: var(--text-muted); }
        .li-wk__table summary { cursor: pointer; color: var(--text-body); list-style: none; }
        .li-wk__table summary::-webkit-details-marker { display: none; }
        .li-wk__table summary::before { content: '+ '; }
        .li-wk__table[open] summary::before { content: '− '; }
        .li-wk__table table { width: 100%; border-collapse: collapse; margin-top: var(--space-3); font-variant-numeric: tabular-nums; }
        .li-wk__table th, .li-wk__table td { text-align: left; padding: 6px 8px 6px 0; border-bottom: 1px solid var(--border); font-size: 13px; color: var(--text-body); }
        .li-wk__table th { font-family: var(--font-mono); font-size: 10px; letter-spacing: 0.5px; text-transform: uppercase; font-weight: 400; color: var(--text-muted); }
        [data-view="agent"] .li-wk__box { display: none; }
      `}</style>
    </figure>
  )
}

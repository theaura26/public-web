'use client'

import { useState } from 'react'
import type { Series } from '@/lib/aura-live/conditions'

/* A small chart, drawn as SVG and nothing else.
 *
 * Two shapes, because two things are being shown. `area` is for a level
 * that persists — soil moisture, soil temperature — where the fill under
 * the line reads as the quantity being held. `bars` is for a thing that
 * arrives and is gone: a day's rain is not a level, and drawing it as a
 * continuous line implies it rained smoothly between Tuesday and Friday.
 *
 * The scale is the series' own, and the baseline is only forced to zero
 * for bars. On soil moisture, whose whole range this month is 0.351 to
 * 0.378, a zero baseline would draw a flat line and hide the only thing
 * there is to see.
 *
 * The caption underneath is the chart talking. At rest it says what the
 * series is; under a pointer it says what that day was. That is the
 * whole reason the paragraph that used to sit here is gone — the shape
 * already showed how often it rains, and the numbers behind it are
 * better asked for than recited.
 *
 * Reachable without a pointer: the chart takes focus and the arrow keys
 * step along it, and a screen reader gets the summary as the label.
 */

type Props = {
  series: Series
  shape?: 'area' | 'bars'
  width?: number
  height?: number
  /** Shown under the chart when nothing is hovered. */
  caption?: string
  /** How a hovered point reads. Gets the day and its value. */
  formatPoint?: (point: { day: string; value: number }) => string
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

function defaultPoint({ day, value }: { day: string; value: number }): string {
  const [, m, d] = day.split('-')
  return `${Number(d)} ${MONTHS[Number(m) - 1]} · ${value.toFixed(1)}`
}

export default function Sparkline({
  series, shape = 'area', width = 240, height = 48, caption, formatPoint = defaultPoint,
}: Props) {
  const [active, setActive] = useState<number | null>(null)
  if (series.length < 2) return null

  const values = series.map((d) => d.value)
  const max = Math.max(...values)
  const min = shape === 'bars' ? 0 : Math.min(...values)
  const span = max - min || 1

  const pad = 2
  const w = width - pad * 2
  const h = height - pad * 2
  const x = (i: number) => pad + (i / (series.length - 1)) * w
  const y = (v: number) => pad + h - ((v - min) / span) * h

  const indexFromEvent = (event: React.PointerEvent<SVGSVGElement>) => {
    const box = event.currentTarget.getBoundingClientRect()
    const ratio = (event.clientX - box.left) / box.width
    return Math.max(0, Math.min(series.length - 1, Math.round(ratio * (series.length - 1))))
  }

  const step = (by: number) => {
    setActive((current) => {
      const next = (current ?? series.length - 1) + by
      return Math.max(0, Math.min(series.length - 1, next))
    })
  }

  const readout = active != null ? formatPoint(series[active]) : caption

  return (
    <div className="wrap">
      <svg
        className="spark"
        viewBox={`0 0 ${width} ${height}`}
        width={width}
        height={height}
        preserveAspectRatio="none"
        role="img"
        aria-label={caption ?? 'chart'}
        tabIndex={0}
        onPointerMove={(e) => setActive(indexFromEvent(e))}
        onPointerLeave={() => setActive(null)}
        onBlur={() => setActive(null)}
        onKeyDown={(e) => {
          if (e.key === 'ArrowRight') { e.preventDefault(); step(1) }
          if (e.key === 'ArrowLeft') { e.preventDefault(); step(-1) }
          if (e.key === 'Escape') setActive(null)
        }}
      >
        {shape === 'bars' ? (
          series.map((d, i) => {
            const barW = Math.max(1.5, w / series.length - 1.5)
            const top = y(d.value)
            const state = active === i ? 'bar on' : i === series.length - 1 && active == null ? 'bar last' : 'bar'
            return (
              <rect
                key={d.day}
                x={x(i) - barW / 2}
                y={top}
                width={barW}
                height={Math.max(0.75, pad + h - top)}
                className={state}
              />
            )
          })
        ) : (
          <>
            <path
              className="fill"
              d={
                `M ${x(0)} ${pad + h} ` +
                series.map((d, i) => `L ${x(i)} ${y(d.value)}`).join(' ') +
                ` L ${x(series.length - 1)} ${pad + h} Z`
              }
            />
            <path className="line" d={`M ` + series.map((d, i) => `${x(i)} ${y(d.value)}`).join(' L ')} />
          </>
        )}

        {active != null && shape === 'area' && (
          <circle className="dot" cx={x(active)} cy={y(values[active])} r={2.5} />
        )}
        {active == null && shape === 'area' && (
          <circle className="dot" cx={x(series.length - 1)} cy={y(values[values.length - 1])} r={2.5} />
        )}

      </svg>

      {readout && (
        <p className="readout label" aria-live="polite">{readout}</p>
      )}

      {/* One styled-jsx block per component — a second one nested inside
          the svg is a build error, not a scoping trick. */}
      <style jsx>{`
        .wrap { display: flex; flex-direction: column; gap: var(--space-3); }

        .spark { display: block; width: 100%; height: auto; overflow: visible; cursor: crosshair; }
        /* A click focuses the chart, and the browser drew its own ring
           for it — a blue box around the whole series, which is the one
           thing on the card that is meant to be read as a shape. The
           pointer already says where it is with the crosshair and the
           readout underneath, so it needs no ring; the keyboard, which
           has neither, keeps ours. */
        .spark:focus { outline: none; }
        .spark:focus-visible { outline: 1px solid rgba(255, 255, 255, 0.5); outline-offset: 4px; }
        .line { fill: none; stroke: rgba(255, 255, 255, 0.72); stroke-width: 1.25; vector-effect: non-scaling-stroke; }
        .fill { fill: rgba(255, 255, 255, 0.09); stroke: none; }
        .dot { fill: #fff; }
        .bar { fill: rgba(255, 255, 255, 0.28); }
        /* Today, told apart from the fortnight behind it. */
        /* Today, in the one colour the page allows itself. It carries
           the same meaning as the dot in the hero — this is current —
           and nothing else on the card competes for it. */
        .bar.last { fill: var(--brand-accent); }
        .bar.on { fill: #fff; }
        .readout {
          margin: 0;
          color: rgba(255, 255, 255, 0.42);
          font-variant-numeric: tabular-nums;
          /* Reserved, so reading along the chart does not shift the tile. */
          min-height: 14px;
        }
      `}</style>
    </div>
  )
}

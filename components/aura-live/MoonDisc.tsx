'use client'

/* The moon's lit fraction, drawn.
 *
 * A circle, and a terminator that is an ellipse — which is what the
 * terminator actually is, seen from here: the great circle dividing lit
 * from unlit, projected onto the disc. Waxing lights the right limb from
 * the northern hemisphere, waning the left.
 *
 * Decorative: the phase and the percentage are written beside it.
 */
export default function MoonDisc({ phase, size = 44 }: { phase: number; size?: number }) {
  const r = size / 2 - 1
  const cx = size / 2
  const cy = size / 2

  /* Half-width of the terminator ellipse: full at the quarters, zero at
     new and full, and negative when the terminator bulges the other way. */
  const k = Math.cos(2 * Math.PI * phase)
  const waxing = phase < 0.5
  /* Rounded, and not for tidiness: this number is interpolated into the
     path, and Node and the browser can print the same double with a
     different number of digits — 15.383279273857486 against
     15.38327927385749 — which React reports as a hydration mismatch on
     every page load. Three decimals is far finer than a 44px disc can
     draw, and it prints identically on both sides. */
  const rx = Math.round(Math.abs(k) * r * 1000) / 1000
  /* The lit side is a half-disc plus or minus the terminator lobe. */
  const sweepOuter = waxing ? 1 : 0
  const sweepInner = k > 0 === waxing ? 0 : 1

  const d =
    `M ${cx} ${cy - r} ` +
    `A ${r} ${r} 0 0 ${sweepOuter} ${cx} ${cy + r} ` +
    `A ${rx} ${r} 0 0 ${sweepInner} ${cx} ${cy - r} Z`

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true" focusable="false">
      <circle cx={cx} cy={cy} r={r} className="dark" />
      <path d={d} className="lit" />
      <circle cx={cx} cy={cy} r={r} className="rim" />
      <style jsx>{`
        .dark { fill: rgba(255, 255, 255, 0.07); }
        .lit { fill: rgba(255, 255, 255, 0.82); }
        .rim { fill: none; stroke: rgba(255, 255, 255, 0.18); stroke-width: 1; }
      `}</style>
    </svg>
  )
}

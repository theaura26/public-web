'use client'

import { useEffect, useRef } from 'react'
import type { Run } from './copy'

/* ── Word-by-word reveal, with the design's accent colour ────────────
   The site's own scroll reveal (ScrollHighlight in components/article)
   brightens each word as it rises through the viewport. It takes a plain
   string, which is why it cannot be used here: this copy carries green
   on particular words — hurried, attention, ready — and flattening it to
   a string would lose them.

   So: the same easing and the same read-then-write discipline, over runs
   instead of a string. Opacity is the only thing animated; the colour is
   set once from the run it came from, so a green word brightens to green
   and a white one to white.

   Read every position, then write every opacity. Interleaved, each write
   invalidates layout and the next read forces the browser to recompute
   it — which is most of what makes a reveal like this feel rough.
─────────────────────────────────────────────────────────────────────── */

type Token = { text: string; green: boolean; br: boolean; space: boolean; idx: number }

/* Runs to words, without inventing spaces.
 *
 * The first version split each run separately and gave every token a
 * trailing space, which put one where the source had none: the design's
 * green "hurried" is followed by a white "." in the next run, and it
 * rendered as "hurried ." A word is not a run — it can be made of two
 * runs in two colours, and the gap between them is not a space.
 *
 * So the runs are flattened into one string with a colour per character
 * first, then split on real whitespace. A word that straddles a colour
 * change keeps the colour it starts in, and a token only carries a
 * trailing space if the source actually had one.
 */
function tokenise(runs: Run[]): Token[] {
  let text = ''
  const green: boolean[] = []
  for (const run of runs) {
    const isGreen = typeof run !== 'string'
    const body = typeof run === 'string' ? run : run.g
    text += body
    for (let i = 0; i < body.length; i++) green.push(isGreen)
  }

  const out: Token[] = []
  let idx = 0
  let i = 0
  while (i < text.length) {
    const ch = text[i]
    if (ch === '\n') {
      out.push({ text: '', green: false, br: true, space: false, idx: -1 })
      i++
      continue
    }
    if (/\s/.test(ch)) { i++; continue }
    const from = i
    while (i < text.length && !/\s/.test(text[i])) i++
    /* A real space follows only if the next character is one, and it is
       not the newline that starts a new block. */
    const space = text[i] === ' ' || text[i] === '\t'
    out.push({ text: text.slice(from, i), green: green[from], br: false, space, idx: idx++ })
  }
  return out
}

export function RipeReveal({
  runs, className, as: As = 'p',
}: { runs: Run[]; className?: string; as?: 'p' | 'h2' }) {
  const spans = useRef<(HTMLSpanElement | null)[]>([])

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      spans.current.forEach((s) => { if (s) s.style.opacity = '1' })
      return
    }
    let raf = 0
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const vh = window.innerHeight
        const startY = vh * 0.86
        const endY = vh * 0.42
        const tops = spans.current.map((s) => (s ? s.getBoundingClientRect().top : null))
        spans.current.forEach((s, i) => {
          const y = tops[i]
          if (!s || y === null) return
          const p = Math.max(0, Math.min(1, (startY - y) / (startY - endY)))
          s.style.opacity = String(0.16 + p * 0.84)
        })
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => { window.removeEventListener('scroll', onScroll); cancelAnimationFrame(raf) }
  }, [runs])

  /* Indices are assigned while tokenising rather than counted during
     render: incrementing a closure variable inside map reassigns it
     after the render completes, which React's lint rightly rejects. */
  const tokens = tokenise(runs)

  return (
    <As className={className}>
      {tokens.map((t, k) =>
        t.br ? (
          <span key={k} className="rv-br" aria-hidden />
        ) : (
          <span
            key={k}
            ref={(el) => { spans.current[t.idx] = el }}
            className={t.green ? 'rv-w is-g' : 'rv-w'}
          >
            {t.space ? `${t.text} ` : t.text}
          </span>
        ))}

      <style jsx>{`
        .rv-w { opacity: 0.16; transition: opacity 90ms linear; }
        .rv-w.is-g { color: var(--ripe-green); }
        /* A paragraph break inside one flowing block. */
        .rv-br { display: block; height: 0.85em; }
      `}</style>
    </As>
  )
}

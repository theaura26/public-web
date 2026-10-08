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

/* br: a break — a new paragraph for \n, or with line, just a new line
   (\u2028, the line separator) inside the same paragraph. */
type Token = { text: string; green: boolean; br: boolean; line?: boolean; space: boolean; idx: number; parts: { text: string; green: boolean }[] }

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
    if (ch === '\n' || ch === '\u2028') {
      out.push({ text: '', green: false, br: true, line: ch === '\u2028', space: false, idx: -1, parts: [] })
      i++
      continue
    }
    if (/\s/.test(ch)) { i++; continue }
    const from = i
    while (i < text.length && !/\s/.test(text[i])) i++
    /* A real space follows only if the next character is one, and it is
       not the newline that starts a new block. */
    const space = text[i] === ' ' || text[i] === '\t'
    /* The word's own colour runs, for the exact mode: "you." is a green
       "you" and a plain "." */
    const parts: { text: string; green: boolean }[] = []
    for (let c = from; c < i; c++) {
      const last = parts[parts.length - 1]
      if (last && last.green === green[c]) last.text += text[c]
      else parts.push({ text: text[c], green: green[c] })
    }
    out.push({ text: text.slice(from, i), green: green[from], br: false, space, idx: idx++, parts })
  }
  return out
}

/** exact: colour exactly the characters a run marks, not whole words.
    By default a word straddling a colour change takes the colour it
    starts in — /ripe's "hurried." is green to its full stop. A page
    that wants only the marked word lifted passes exact. */
export function RipeReveal({
  runs, className, as: As = 'p', exact = false,
}: { runs: Run[]; className?: string; as?: 'p' | 'h2'; exact?: boolean }) {
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
          <span key={k} className={t.line ? 'rv-br rv-br--line' : 'rv-br'} aria-hidden />
        ) : (
          exact && t.parts.length > 1 ? (
            <span
              key={k}
              ref={(el) => { spans.current[t.idx] = el }}
              className="rv-w"
            >
              {t.parts.map((p, j) => (
                <span key={j} className={p.green ? 'is-g' : undefined}>{p.text}</span>
              ))}
              {t.space ? ' ' : ''}
            </span>
          ) : (
            <span
              key={k}
              ref={(el) => { spans.current[t.idx] = el }}
              className={t.green ? 'rv-w is-g' : 'rv-w'}
            >
              {t.space ? `${t.text} ` : t.text}
            </span>
          )
        ))}

      <style jsx>{`
        .rv-w { opacity: 0.16; transition: opacity 90ms linear; }
        .rv-w.is-g,
        .rv-w .is-g { color: var(--ripe-green); }
        /* A paragraph break inside one flowing block. */
        .rv-br { display: block; height: 0.85em; }
        .rv-br--line { height: 0; }
      `}</style>
    </As>
  )
}

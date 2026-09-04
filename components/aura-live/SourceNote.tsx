'use client'

import { useEffect, useId, useRef, useState } from 'react'

/* Where these numbers come from, on request.
 *
 * The line it replaces sat in the header and read "open data, 4.3 km
 * off-estate", which a reader had to decode. Attribution that has to be
 * worked out is attribution that is not doing its job, so it moved in
 * here and got written out in plain words instead.
 *
 * A tooltip nobody can find is the same as no attribution at all, so
 * this is a real button: it opens on hover, on focus and on tap, closes
 * on Escape and on click-away, and carries the text as an accessible
 * description whether it is open or not. A screen reader gets the whole
 * explanation from the button without opening anything.
 */
export default function SourceNote({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  const id = useId()
  const wrap = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    const onDown = (e: PointerEvent) => {
      if (!wrap.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    document.addEventListener('pointerdown', onDown)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('pointerdown', onDown)
    }
  }, [open])

  return (
    <span className="wrap" ref={wrap}>
      <button
        type="button"
        className="dot"
        aria-describedby={id}
        aria-expanded={open}
        aria-label="Where these readings come from"
        onClick={() => setOpen((v) => !v)}
        onPointerEnter={() => setOpen(true)}
        onPointerLeave={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
      >
        i
      </button>

      <span id={id} role="tooltip" className={open ? 'tip on' : 'tip'}>
        {children}
      </span>

      <style jsx>{`
        .wrap { position: relative; display: inline-flex; margin-left: 10px; }

        .dot {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          border: 1px solid rgba(255, 255, 255, 0.28);
          background: transparent;
          color: rgba(255, 255, 255, 0.55);
          font-family: var(--font-mono), monospace;
          font-size: 10px;
          line-height: 1;
          display: grid;
          place-items: center;
          cursor: help;
          padding: 0;
          transition: color var(--dur-base) var(--ease), border-color var(--dur-base) var(--ease);
        }
        .dot:hover, .dot:focus-visible {
          color: #fff;
          border-color: rgba(255, 255, 255, 0.6);
        }
        .dot:focus-visible { outline: 1px solid rgba(255, 255, 255, 0.6); outline-offset: 3px; }

        /* The site's tooltip, which is .aura-term__tip in globals.css:
           the inverted pair off the text and background tokens, a 2px
           corner, 8/12 padding, and a fade with nothing moving. This one
           had grown its own — a hardcoded #23282b, a 4px radius, space-4
           padding and a slide — so two tooltips on one site looked like
           two decisions.

           Two things stay different, and both are the content rather than
           the style. It is set as prose because it is sixty words: the
           label treatment is 10px uppercase mono, which is right for the
           three or four a Term carries and unreadable at this length. And
           it opens downward because the mark sits on the top edge of a
           card, where upward puts the box off the hero. */
        .tip {
          position: absolute;
          top: calc(100% + 8px);
          left: -12px;
          z-index: 30;
          pointer-events: none;
          max-width: min(320px, 60vw);
          width: max-content;
          padding: 8px 12px;
          border-radius: 2px;
          background: var(--text);
          color: var(--bg);
          /* A hairline, which the article tooltip does without.
             There it is a near-black box on a page the colour of paper
             and the edge draws itself. Here it opens over a card already
             at rgb(22,25,27): the ink reads at 18:1 but the box against
             the card measured 1.02:1, so the tooltip had no edge and the
             sentence looked like it had been printed on the card. Taken
             off the background token, so it follows the theme with
             everything else. */
          border: 1px solid color-mix(in srgb, var(--bg) 18%, transparent);
          font-family: var(--font-grotesque), sans-serif;
          font-size: 13px;
          line-height: 1.45;
          letter-spacing: 0;
          text-transform: none;
          text-align: left;
          white-space: normal;
          opacity: 0;
          visibility: hidden;
          transition:
            opacity var(--dur-fast) var(--ease),
            visibility var(--dur-fast) var(--ease);
        }
        .tip.on { opacity: 1; visibility: visible; }

        @media (prefers-reduced-motion: reduce) {
          .dot, .tip { transition: none; }
        }
      `}</style>
    </span>
  )
}

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

        .tip {
          position: absolute;
          top: calc(100% + 10px);
          left: -12px;
          z-index: 3;
          width: max(260px, 34ch);
          padding: var(--space-4) var(--space-5);
          border-radius: var(--radius-1);
          background: #23282b;
          color: rgba(255, 255, 255, 0.82);
          /* Set as prose, not as a label — it is a sentence, and the
             header’s mono tracking makes a paragraph unreadable. */
          font-family: var(--font-grotesque), sans-serif;
          font-size: 14px;
          line-height: 1.5;
          letter-spacing: 0;
          text-transform: none;
          opacity: 0;
          visibility: hidden;
          transform: translateY(-4px);
          transition:
            opacity var(--dur-base) var(--ease),
            transform var(--dur-base) var(--ease),
            visibility var(--dur-base) var(--ease);
        }
        .tip.on { opacity: 1; visibility: visible; transform: none; }

        @media (prefers-reduced-motion: reduce) {
          .dot, .tip { transition: none; }
        }
      `}</style>
    </span>
  )
}

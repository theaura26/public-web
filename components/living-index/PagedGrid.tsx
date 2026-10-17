'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'

/* The plate wall, a screen at a time. The herd is laid out in pages of
 * `perPage`, side by side in one horizontal scroller that snaps a page at a
 * time: swipe on a phone or trackpad, or use the arrows and dots. The page
 * below the wall stays where it is, so the reader can scroll on to the rest
 * of the record without passing every cow first. */

export default function PagedGrid<T>({
  items, perPage = 20, itemKey, renderItem, countLine,
}: {
  items: T[]
  perPage?: number
  itemKey: (item: T) => string
  renderItem: (item: T) => ReactNode
  /** The line under the wall, given the range on screen. */
  countLine: (from: number, to: number, total: number, screens: number) => string
}) {
  const track = useRef<HTMLDivElement>(null)
  const pages: T[][] = []
  for (let i = 0; i < items.length; i += perPage) pages.push(items.slice(i, i + perPage))
  const n = pages.length

  /* A new filter, search or sort starts again at the first screen: the
     page number belongs to one set of items and lapses with it. */
  const resetKey = items.map(itemKey).join('|')
  const [state, setState] = useState({ key: resetKey, page: 0 })
  if (state.key !== resetKey) setState({ key: resetKey, page: 0 })
  const current = state.key === resetKey ? Math.min(state.page, Math.max(0, n - 1)) : 0
  const setPage = (p: number) => setState({ key: resetKey, page: p })
  useEffect(() => {
    track.current?.scrollTo({ left: 0, behavior: 'auto' })
  }, [resetKey])

  const onScroll = () => {
    const el = track.current
    if (!el || !el.clientWidth) return
    const p = Math.round(el.scrollLeft / el.clientWidth)
    if (p !== current) setPage(p)
  }
  const go = (p: number) => {
    const el = track.current
    if (!el) return
    const to = Math.max(0, Math.min(n - 1, p))
    const smooth = !window.matchMedia('(prefers-reduced-motion: reduce)').matches
    el.scrollTo({ left: to * el.clientWidth, behavior: smooth ? 'smooth' : 'auto' })
    setPage(to)
  }

  const from = current * perPage + 1
  const to = Math.min(items.length, (current + 1) * perPage)

  return (
    <div className="li-paged">
      <div
        className="li-pages"
        ref={track}
        onScroll={onScroll}
        role="region"
        aria-roledescription="carousel"
        aria-label={`The herd, ${n} ${n === 1 ? 'screen' : 'screens'}`}
      >
        {pages.map((p, i) => (
          <div
            className="li-page"
            key={i}
            role="group"
            aria-roledescription="screen"
            aria-label={`${i * perPage + 1}–${i * perPage + p.length} of ${items.length}`}
            aria-hidden={i !== current ? true : undefined}
            inert={i !== current ? true : undefined}
          >
            <ul className="li-grid">
              {p.map((item) => <li key={itemKey(item)}>{renderItem(item)}</li>)}
            </ul>
          </div>
        ))}
      </div>

      <div className="li-pager">
        <p className="label li-pager__count" aria-live="polite">
          {countLine(from, to, items.length, n)}
        </p>
        {n > 1 && (
          <div className="li-pager__ctl">
            <button type="button" className="li-pager__btn" onClick={() => go(current - 1)} disabled={current === 0} aria-label="Previous screen">
              <svg viewBox="0 0 24 24" width={11} height={11} fill="none" aria-hidden>
                <path d="M19 12H6M11.5 6L5 12l6.5 6" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <div className="li-pager__dots">
              {pages.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  className={`li-pager__dot${i === current ? ' is-on' : ''}`}
                  onClick={() => go(i)}
                  aria-label={`Screen ${i + 1} of ${n}`}
                  aria-current={i === current ? 'true' : undefined}
                />
              ))}
            </div>
            <button type="button" className="li-pager__btn" onClick={() => go(current + 1)} disabled={current === n - 1} aria-label="Next screen">
              <svg viewBox="0 0 24 24" width={11} height={11} fill="none" aria-hidden>
                <path d="M5 12h13M12.5 6l6.5 6-6.5 6" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        )}
      </div>

      <style jsx global>{`
        .li-paged { display: flex; flex-direction: column; gap: var(--space-6); }
        /* One screen wide, snapping a screen at a time. Each screen carries
           a little padding of its own, and the track gives it back with a
           negative margin, so a screen is exactly one track wide and the
           focus ring and hover underline are never clipped at the edge. */
        .li-pages {
          display: flex; overflow-x: auto; overflow-y: hidden;
          scroll-snap-type: x mandatory; overscroll-behavior-x: contain;
          scrollbar-width: none; margin: 0 -6px;
        }
        .li-pages::-webkit-scrollbar { display: none; }
        .li-page { flex: 0 0 100%; min-width: 0; box-sizing: border-box; padding: 6px; scroll-snap-align: start; scroll-snap-stop: always; }
        .li-pager { display: flex; justify-content: space-between; align-items: center; gap: var(--space-5); flex-wrap: wrap; }
        .li-pager__count { margin: 0; color: var(--text-muted); }
        .li-pager__ctl { display: flex; align-items: center; gap: var(--space-4); }
        .li-pager__btn {
          display: inline-flex; align-items: center; justify-content: center; flex: none;
          width: 32px; height: 32px; padding: 0; border-radius: 50%; cursor: pointer;
          background: transparent; color: var(--text);
          border: 1px solid var(--border-strong);
          transition: border-color var(--dur-base) var(--ease), background var(--dur-base) var(--ease), color var(--dur-base) var(--ease);
        }
        .li-pager__btn:hover:not(:disabled) { background: var(--text); color: var(--bg); border-color: var(--text); text-decoration: none; }
        .li-pager__btn:disabled { color: var(--text-dim); cursor: default; }
        .li-pager__dots { display: flex; gap: 2px; }
        .li-pager__dot {
          width: 22px; height: 22px; padding: 0; border: 0; background: transparent; cursor: pointer;
          display: inline-flex; align-items: center; justify-content: center;
        }
        .li-pager__dot::after {
          content: ''; width: 6px; height: 6px; border-radius: 50%;
          background: var(--border-strong); transition: background var(--dur-base) var(--ease), transform var(--dur-base) var(--ease);
        }
        .li-pager__dot.is-on::after { background: var(--text); transform: scale(1.2); }
        .li-pager__dot:hover::after { background: var(--brand-accent); }
        @media (prefers-reduced-motion: reduce) { .li-pages { scroll-behavior: auto; } }
        /* Agent view: the whole herd, one list after another. */
        [data-view="agent"] .li-pages { display: block !important; overflow: visible !important; margin: 0 !important; padding: 0 !important; }
        [data-view="agent"] .li-page { padding: 0 !important; }
        [data-view="agent"] .li-pager__ctl { display: none !important; }
      `}</style>
    </div>
  )
}

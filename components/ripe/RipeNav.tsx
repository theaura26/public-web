'use client'

import { useEffect, useRef, useState } from 'react'

/* ── RIPE section bar ────────────────────────────────────────────────
   The Remarkable Coffee microsite's header, on this page's palette.
   Same behaviour as components/coffee/Microsite.tsx MicroNav:

     · fixed under the site bar, hidden above the fold
     · it drops into place once the opener is behind the reader
     · the site bar peekaboos — away on the way down, back the moment
       they scroll up — and this bar rides with it, taking the top edge
       itself while the other is gone
     · the links scroll sideways on narrow screens and dissolve under
       the right-hand edge through a mask rather than a painted gradient,
       so the fade holds over any ground

   One departure, and it is the reason the two bars looked like a light
   header with a dark strip hung under it: MicroNav paints itself white
   to match the site bar over white pages. RIPE is black from the opener
   to the last line, so both bars are dark here instead — the site bar is
   forced transparent over the film and solid black past it, and this one
   matches. The point of MicroNav's white is that the two read as one
   header; on this page that means black.
─────────────────────────────────────────────────────────────────────── */

/* Title Case, set in the labels rather than by text-transform: the
   design writes these all-caps, and CSS cannot lowercase and then
   capitalize in one pass — `capitalize` leaves an all-caps run alone.
   Storing the cased strings is also what a screen reader should read. */
const LINKS = [
  { id: 'rhythm',    label: 'The Rhythm' },
  { id: 'prepared',  label: 'Come Prepared' },
  { id: 'gratitude', label: 'Give Gratitude' },
  { id: 'remember',  label: 'Make Memories' },
] as const

export function RipeNav() {
  const [active, setActive] = useState<string>('rhythm')
  const [below, setBelow] = useState(false)
  const [hidden, setHidden] = useState(false)
  const scroller = useRef<HTMLDivElement>(null)

  /* Peekaboo, lifted from MicroNav. Both bars live below the fold; past
     it the header hides on the way down and returns on the way up. */
  useEffect(() => {
    let last = window.scrollY
    let ticking = false
    const read = () => {
      const y = window.scrollY
      const fold = window.innerHeight * 0.85
      setBelow(y > fold)
      const dy = y - last
      /* ignore rubber-banding and sub-pixel jitter */
      if (y > 0 && Math.abs(dy) > 6) {
        setHidden(dy > 0 && y > fold)
        last = y
      } else if (y <= 0) {
        setHidden(false)
        last = y
      }
      ticking = false
    }
    read()
    const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(read) } }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.classList.toggle('rn-below', below)
    document.body.classList.toggle('rn-up', hidden)
    return () => {
      document.body.classList.remove('rn-below')
      document.body.classList.remove('rn-up')
    }
  }, [below, hidden])

  /* The section crossing a thin band under the bars owns the highlight.
     The live set is kept across callbacks rather than read out of each
     one: an observer reports only what changed, so a batch carrying a
     single section leaving says nothing about which is now in the band. */
  useEffect(() => {
    const targets = LINKS.map((l) => document.getElementById(l.id))
      .filter((el): el is HTMLElement => Boolean(el))
    if (!targets.length) return
    const inBand = new Set<string>()
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) inBand.add(e.target.id); else inBand.delete(e.target.id)
        }
        const first = LINKS.find((l) => inBand.has(l.id))
        if (first) setActive(first.id)
      },
      { rootMargin: '-18% 0px -74% 0px', threshold: 0 },
    )
    targets.forEach((t) => io.observe(t))
    return () => io.disconnect()
  }, [])

  /* Land a cold load on the right section. The browser jumps at first
     paint, when the page is a fraction of its real height because every
     section takes its size from a styled-jsx block injected during
     hydration. So the jump is made again once the page is its real size,
     and abandoned the moment the reader does anything themselves. */
  useEffect(() => {
    const id = decodeURIComponent(location.hash.slice(1))
    if (!id) return
    const target = document.getElementById(id)
    if (!target) return
    let cancelled = false
    const settle = () => { if (!cancelled) { target.scrollIntoView({ behavior: 'auto', block: 'start' }); setActive(id) } }
    const stop = () => { cancelled = true }
    const evs = ['wheel', 'touchstart', 'keydown', 'pointerdown'] as const
    for (const ev of evs) window.addEventListener(ev, stop, { passive: true, once: true })
    let raf = 0
    const afterFonts = () => { raf = requestAnimationFrame(() => { raf = requestAnimationFrame(settle) }) }
    if (document.fonts) document.fonts.ready.then(afterFonts).catch(afterFonts)
    else afterFonts()
    const late = window.setTimeout(settle, 700)
    return () => {
      cancelled = true
      if (raf) cancelAnimationFrame(raf)
      clearTimeout(late)
      for (const ev of evs) window.removeEventListener(ev, stop)
    }
  }, [])

  /* Keep the marked link in view inside the scroller. scrollLeft is set
     directly rather than by scrollIntoView, which would be entitled to
     move the page vertically — and the page's position chose this link. */
  useEffect(() => {
    const sc = scroller.current
    if (!sc) return
    const el = sc.querySelector<HTMLElement>(`[data-id="${active}"]`)
    if (!el) return
    const pad = 20
    const left = el.offsetLeft - pad
    const right = el.offsetLeft + el.offsetWidth + pad
    const behavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? ('auto' as const) : ('smooth' as const)
    if (left < sc.scrollLeft) sc.scrollTo({ left, behavior })
    else if (right > sc.scrollLeft + sc.clientWidth) sc.scrollTo({ left: right - sc.clientWidth, behavior })
  }, [active])

  const jump = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    const el = document.getElementById(id)
    if (!el) return
    e.preventDefault()
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' })
    history.replaceState(null, '', `#${id}`)
    setActive(id)
  }

  return (
    <>
      <nav
        className={`rn ${below ? 'is-below' : ''} ${hidden ? 'is-up' : ''}`}
        aria-label="RIPE sections"
        aria-hidden={!below}
      >
        <div className="rn-w rn-in">
          <div className="rn-scroll" ref={scroller}>
            {LINKS.map((l) => (
              <a key={l.id} href={`#${l.id}`} data-id={l.id}
                 className={`p2 rn-l ${active === l.id ? 'is-on' : ''}`}
                 aria-current={active === l.id ? 'true' : undefined}
                 tabIndex={below ? 0 : -1}
                 onClick={(e) => jump(e, l.id)}>
                {l.label}
              </a>
            ))}
            <span className="rn-runoff" aria-hidden />
          </div>
        </div>
      </nav>

      <style jsx global>{`
        /* The site bar, for the length of this page. Above the fold it
           rides transparent on the film; past it, solid black — the page
           is black throughout, so a themed white bar would be the light
           strip this treatment exists to avoid.

           The custom properties are re-declared rather than the painted
           colours overridden: the bar draws its marks from these, and
           resetting one to a keyword makes it invalid and silently
           erases whatever it paints, the hamburger included. */
        .ripe-page ~ * .aura-nav, body:has(.ripe-page) .aura-nav {
          transition: transform var(--dur-base) var(--ease),
                      background var(--dur-base) var(--ease) !important;
          --text: #fff;
          --text-body: rgba(255, 255, 255, 0.8);
          --text-muted: rgba(255, 255, 255, 0.6);
          --border: rgba(255, 255, 255, 0.16);
        }
        body:has(.ripe-page) .aura-nav {
          background: transparent !important;
          box-shadow: none !important;
        }
        body:has(.ripe-page).rn-below .aura-nav {
          background: #000 !important;
        }
        body:has(.ripe-page) .aura-nav .invert-on-light { filter: none !important; }

        /* Peeked away. The site bar carries box-shadow: 0 1px 0 0 var(--bg),
           which with the bar translated off screen lands on y=0 as a
           hairline. Killed while it is hidden. */
        body:has(.ripe-page).rn-below.rn-up .aura-nav {
          transform: translateY(-100%) !important;
          box-shadow: none !important;
        }
      `}</style>

      <style jsx>{`
        .rn {
          /* 39, deliberately: the hamburger backdrop is z-40 and the site
             bar and menu panel are z-50. At 40 this tied with the backdrop,
             won on DOM order, and showed through beside the open menu. */
          position: fixed; left: 0; right: 0; z-index: 39;
          height: 56px; top: var(--nav-h);
          background: #000;
          border-bottom: 1px solid rgba(255, 255, 255, 0.14);
          opacity: 0; pointer-events: none;
          transform: translateY(calc(-1 * var(--nav-h)));
          transition: transform var(--dur-base) var(--ease),
                      opacity var(--dur-base) var(--ease);
        }
        .rn.is-below { opacity: 1; pointer-events: auto; transform: translateY(0); }
        /* Header away — the bar takes the top edge itself. */
        .rn.is-below.is-up { transform: translateY(calc(-1 * var(--nav-h))); }

        /* Lines up with the navbar above it rather than with the content
           column. That bar is a 10vw / 1fr / 10vw grid with the mark
           centred in the left rail and the menu button in the right, so
           the marks sit 5vw from each edge less half their own width.
           Those two widths are the dependency. */
        .rn-w {
          --nav-mark: 32px;
          --nav-burger: 44px;
          width: 100%;
          padding-left: calc(5vw - var(--nav-mark) / 2);
          padding-right: calc(5vw - var(--nav-burger) / 2);
        }
        @media (max-width: 620px) {
          .rn-w { padding-left: var(--gutter, 20px); padding-right: var(--gutter, 20px); }
        }

        .rn-in { position: relative; height: 100%; display: flex; align-items: center; }

        .rn-scroll {
          flex: 1 1 auto; min-width: 0; height: 100%;
          display: flex; align-items: center; justify-content: flex-start;
          gap: clamp(22px, 2.8vw, 40px);
          overflow-x: auto; -webkit-overflow-scrolling: touch;
          scrollbar-width: none;
          /* Links dissolve as they run off the right. A mask rather than
             a painted gradient, so it holds over any ground. */
          -webkit-mask-image: linear-gradient(to right, #000 0, #000 calc(100% - 56px), transparent 100%);
          mask-image: linear-gradient(to right, #000 0, #000 calc(100% - 56px), transparent 100%);
        }
        .rn-scroll::-webkit-scrollbar { display: none; }
        .rn-runoff { flex: 0 0 auto; width: clamp(12px, 3vw, 40px); }

        /* The same rule MicroNav gives .ln-l, on the same .p2 type role
           the links already carry — 13px over the site's body face, not
           a face of this page's own. Only the two colours differ: light
           on black rather than dark on white, and the brand green where
           the coffee microsite uses its clay.

           :global, because styled-jsx cannot put its scope class on
           these — the same reason .ln-l is global in Microsite.tsx. */
        :global(.rn-l) {
          position: relative; flex-shrink: 0;
          display: inline-flex; align-items: center; height: 100%;
          font-size: 13px;
          color: rgba(255, 255, 255, 0.66);
          text-decoration: none; white-space: nowrap;
          transition: color var(--dur-base) var(--ease);
        }
        /* No rule under the active tab — the green is enough to mark
           where you are, which is how the coffee bar reads too. */
        /* The site's own nav colour, as on the coffee microsite's bar: the
           active section and hover read in the brand accent rather than
           the festival green, so the bar stays part of the site's UI. */
        :global(.rn-l):hover { color: var(--brand-accent); }
        :global(.rn-l.is-on) { color: var(--brand-accent); }
      `}</style>
    </>
  )
}

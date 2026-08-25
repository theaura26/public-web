'use client'

import React, { useEffect, useRef, useState } from 'react'

/* ═══════════════════════════════════════════════════════════════════
   THE REMARKABLE CIRCLE — the microsite's masthead.

   Eight disciplines on a slowly turning ring, drawn on white. The ring
   rotates; each glyph counter-rotates at the same rate so it stays
   upright, the way a chairlift seat does.

   The ring is a web, not a picture. Every glyph is a node you can pick
   up and pull; the two strings tied to it stretch to follow, and a
   loose spring throws it back when you let go. Click a glyph and the
   page anchors to that discipline — unless you were dragging, in which
   case it doesn't.

   Hovering anywhere over the circle opens it out ten per cent.
   Hovering the centre also swaps the wordmark for what the circle
   actually is.

   The header is white whatever the site theme is, so it takes the nav
   with it — see the global block below.

   Motion is the whole idea here, so it is honoured — but it stops
   dead for anyone who has asked for reduced motion.
═══════════════════════════════════════════════════════════════════ */

export type Discipline = {
  id: string
  label: string
  glyph: string
}

/** In the order they sit on the ring, clockwise from the top. */
export const DISCIPLINES: Discipline[] = [
  { id: 'biodynamic',   label: 'Biodynamic',            glyph: 'aura-biodynamic-glyph.svg' },
  { id: 'soil',         label: 'Soil',                  glyph: 'aura-soil-glyph.svg' },
  { id: 'microbiome',   label: 'Microbiome',            glyph: 'aura-microbiome-glyph.svg' },
  { id: 'pathology',    label: 'Plant pathology',       glyph: 'aura-pathology-glyph.svg' },
  { id: 'biodiversity', label: 'Biodiversity',          glyph: 'aura-biodiversity-glyph.svg' },
  { id: 'hydrology',    label: 'Hydrology',             glyph: 'aura-hydrology-glyph.svg' },
  { id: 'observation',  label: 'Observation',           glyph: 'aura-observation-glyph.svg' },
  { id: 'vedic',        label: 'Vedic farming',         glyph: 'aura-vedic-glyph.svg' },
  { id: 'intelligence', label: 'Intelligence',          glyph: 'aura-intelligence-glyph.svg' },
]

/* ── geometry, in the SVG's own 0–100 units ────────────────────────
   Nodes sit where the glyphs sit. A quadratic Bézier whose control
   point is at R / cos(half-sweep) traces a circular arc exactly, so
   the eight strings at rest are indistinguishable from one ring. */
const N = DISCIPLINES.length
const RING_R = 40
const CTRL_R = RING_R / Math.cos(Math.PI / N)            // half-sweep is 22.5°

const NODES = DISCIPLINES.map((_, i) => {
  const a = (2 * Math.PI / N) * i
  return { x: 50 + RING_R * Math.sin(a), y: 50 - RING_R * Math.cos(a) }
})
const REST = DISCIPLINES.map((_, i) => {
  const a = (2 * Math.PI / N) * (i + 0.5)
  return { x: 50 + CTRL_R * Math.sin(a), y: 50 - CTRL_R * Math.cos(a) }
})

/* The glyphs carry all the physics. Loose enough to overshoot on the
   way home — that snap is the point. */
const NODE_K = 0.16
const NODE_DAMP = 0.74
/** How far a glyph can be pulled off the ring before it stops giving. */
const MAX_PULL = 34
/** Past this much travel a press stops being a click and becomes a drag. */
const DRAG_SLOP = 4

function pathFor(
  i: number,
  node: { x: number; y: number }[],
  cx: number,
  cy: number,
) {
  const a = node[i]
  const b = node[(i + 1) % N]
  return `M${a.x.toFixed(2)},${a.y.toFixed(2)} Q${cx.toFixed(2)},${cy.toFixed(2)} ${b.x.toFixed(2)},${b.y.toFixed(2)}`
}

/* Living colour — the estate's own palette. Canopy, moss, cherry,
   turmeric, monsoon, jaggery, lichen, clay, blossom. A glyph picks one
   at random every time it is hovered, so no two passes over the ring
   look the same. */
const LIVING = [
  '#4F7A4A', '#7E9B5B', '#C2352B', '#E0A63C', '#3E6B8A',
  '#8B5E34', '#3F8478', '#E37128', '#7C5AA6',
]

/** A colour that is not the one already showing, so a re-hover always reads. */
function pickLiving(current?: string) {
  const pool = LIVING.filter((c) => c !== current)
  return pool[Math.floor(Math.random() * pool.length)]
}

/**
 * The artwork is solid black SVG, so it is painted as a mask rather
 * than an <img> — the element's own colour comes through it, which is
 * what lets a glyph take a colour at all. `currentColor` means it
 * follows whatever its container is set to.
 */
export function GlyphMark({ name, size = 34 }: { name: string; size?: number }) {
  const url = `url(/glyphs/coffee/${name})`
  return (
    <>
      <span
        className="glyph"
        aria-hidden
        style={{
          width: size,
          height: size,
          WebkitMaskImage: url,
          maskImage: url,
        }}
      />
      {/* Global, and deliberately here rather than in globals.css: these
          rules are what make the mask a glyph at all, so they travel with
          the component that draws it. styled-jsx dedupes identical global
          blocks, so the many instances cost one rule. */}
      <style jsx global>{`
        .glyph {
          display: block;
          flex: none;
          background-color: currentColor;
          -webkit-mask-repeat: no-repeat;
                  mask-repeat: no-repeat;
          -webkit-mask-position: center;
                  mask-position: center;
          -webkit-mask-size: contain;
                  mask-size: contain;
        }
      `}</style>
    </>
  )
}

export function RemarkableCircle() {
  const [hover, setHover] = useState(false)
  const ringRef = useRef<HTMLDivElement | null>(null)
  const spinRef = useRef<HTMLDivElement | null>(null)
  const stringRefs = useRef<(SVGPathElement | null)[]>([])
  const slotRefs = useRef<(HTMLDivElement | null)[]>([])
  /** Set while a press is travelling, so pointerup doesn't navigate. */
  const draggedRef = useRef(false)
  /** Index of the glyph under the pointer, or -1. Read by the loop. */
  const grabRef = useRef(-1)

  /* ── the web ───────────────────────────────────────────────────────
     One loop drives everything: eight node springs (the glyphs) and
     eight string springs (the gaps between them).

     All of it happens in the ring's own rotating frame. The pointer is
     un-rotated by the layer's live angle before any distance is
     measured, which is why a string reacts to where the cursor
     actually is — and why a glyph you are holding stays under your
     cursor while the ring keeps turning underneath it. */
  useEffect(() => {
    const spin = spinRef.current
    const ring = ringRef.current
    if (!spin || !ring) return

    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      // No physics. Draw the eight arcs once and leave them alone.
      NODES.forEach((_, i) => {
        stringRefs.current[i]?.setAttribute('d', pathFor(i, NODES, REST[i].x, REST[i].y))
      })
      return
    }

    const node = NODES.map((p) => ({ ...p }))                 // live positions
    const nodeVel = NODES.map(() => ({ x: 0, y: 0 }))
    let pointer: { x: number; y: number } | null = null
    let grabbedAt: { x: number; y: number } | null = null
    let frame = 0

    const onMove = (e: PointerEvent) => {
      const box = ring.getBoundingClientRect()
      pointer = { x: e.clientX - box.left, y: e.clientY - box.top }
      // A press only stops being a click once it has actually travelled.
      if (grabRef.current >= 0 && grabbedAt &&
          Math.hypot(e.clientX - grabbedAt.x, e.clientY - grabbedAt.y) > DRAG_SLOP) {
        draggedRef.current = true
      }
    }
    const onUp = () => { grabRef.current = -1 }
    const onLeave = () => { pointer = null; grabRef.current = -1 }
    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerup', onUp)
    window.addEventListener('pointercancel', onUp)
    window.addEventListener('pointerleave', onLeave)

    /* Capture the pointer on the puck itself. Without it the cursor
       outruns the glyph — which it will, since the glyph is on a spring
       — and the drag dies the moment the two separate. */
    const grabbers = slotRefs.current.map((slot, i) => {
      const el = slot?.querySelector('button')
      if (!el) return null
      /* A different living colour every time the cursor arrives. */
      const enter = () => { el.style.color = pickLiving(el.style.color) }
      const leave = () => { el.style.color = '' }
      el.addEventListener('pointerenter', enter)
      el.addEventListener('pointerleave', leave)

      const down = (e: PointerEvent) => {
        // Deliberately no preventDefault: it suppresses the compatibility
        // mouse events, and with no mousedown/mouseup there is no click —
        // which would cost the glyph its whole reason for being a link.
        // Selection and native image-drag are handled in CSS instead.
        grabRef.current = i
        draggedRef.current = false
        grabbedAt = { x: e.clientX, y: e.clientY }
        try { el.setPointerCapture(e.pointerId) } catch { /* not captureable */ }
      }
      el.addEventListener('pointerdown', down)
      return () => {
        el.removeEventListener('pointerdown', down)
        el.removeEventListener('pointerenter', enter)
        el.removeEventListener('pointerleave', leave)
      }
    })

    const tick = () => {
      const box = ring.getBoundingClientRect()
      // The rect carries the hover scale; offsetWidth does not. One converts
      // the pointer into ring units, the other converts back into CSS pixels.
      const unitScreen = box.width / 100 || 1
      const unitLocal = ring.offsetWidth / 100 || 1

      let local: { x: number; y: number } | null = null
      if (pointer && box.width) {
        const m = new DOMMatrixReadOnly(getComputedStyle(spin).transform)
        const cos = m.a, sin = m.b                     // the layer's live angle
        const dx = pointer.x - box.width / 2
        const dy = pointer.y - box.height / 2
        local = {
          x: 50 + (dx * cos + dy * sin) / unitScreen,
          y: 50 + (-dx * sin + dy * cos) / unitScreen,
        }
      }

      const held = grabRef.current

      // the glyphs
      for (let i = 0; i < N; i++) {
        let tx = NODES[i].x, ty = NODES[i].y
        if (i === held && local) {
          // follow the cursor, but only so far off the ring
          let ox = local.x - NODES[i].x
          let oy = local.y - NODES[i].y
          const d = Math.hypot(ox, oy)
          if (d > MAX_PULL) { ox *= MAX_PULL / d; oy *= MAX_PULL / d }
          tx = NODES[i].x + ox
          ty = NODES[i].y + oy
        }
        nodeVel[i].x = (nodeVel[i].x + (tx - node[i].x) * NODE_K) * NODE_DAMP
        nodeVel[i].y = (nodeVel[i].y + (ty - node[i].y) * NODE_K) * NODE_DAMP
        node[i].x += nodeVel[i].x
        node[i].y += nodeVel[i].y

        const slot = slotRefs.current[i]
        if (slot) {
          slot.style.setProperty('--ox', `${((node[i].x - NODES[i].x) * unitLocal).toFixed(2)}px`)
          slot.style.setProperty('--oy', `${((node[i].y - NODES[i].y) * unitLocal).toFixed(2)}px`)
        }
      }

      /* The strings have no life of their own — they are geometry hung
         between two glyphs. The control point rides along with both
         ends, which keeps each arc's curvature while it stretches. */
      for (let i = 0; i < N; i++) {
        const j = (i + 1) % N
        const cx = REST[i].x + ((node[i].x - NODES[i].x) + (node[j].x - NODES[j].x)) / 2
        const cy = REST[i].y + ((node[i].y - NODES[i].y) + (node[j].y - NODES[j].y)) / 2
        stringRefs.current[i]?.setAttribute('d', pathFor(i, node, cx, cy))
      }

      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
      window.removeEventListener('pointercancel', onUp)
      window.removeEventListener('pointerleave', onLeave)
      grabbers.forEach((off) => off?.())
    }
  }, [])

  const go = (id: string) => {
    if (draggedRef.current) { draggedRef.current = false; return }
    const el = document.getElementById(id)
    if (!el) return
    // Deliberately instant. Some of these sit nine thousand pixels down;
    // a smooth scroll would whip through a dozen scenes to get there.
    el.scrollIntoView({ behavior: 'auto', block: 'start' })
    history.replaceState({}, '', `#${id}`)
  }

  return (
    <header className="rc rc-hero">
      <div className="rc-inner">
        <div className="rc-stage">
          {/* carries the hover expansion, so the turning layer keeps its
              transform to itself */}
          <div className="rc-ring" ref={ringRef}>
            <div className="rc-spin" ref={spinRef}>
              <svg viewBox="0 0 100 100" className="rc-orbit" aria-hidden>
                {DISCIPLINES.map((d, i) => (
                  <path
                    key={d.id}
                    ref={(el) => { stringRefs.current[i] = el }}
                    fill="none"
                    stroke="rgba(19,23,25,0.22)"
                    strokeWidth="0.22"
                    strokeLinecap="round"
                  />
                ))}
              </svg>

              {DISCIPLINES.map((d, i) => {
                const angle = (360 / N) * i
                return (
                  <div
                    key={d.id}
                    className="rc-slot"
                    ref={(el) => { slotRefs.current[i] = el }}
                    style={{ '--a': `${angle}deg` } as React.CSSProperties}
                  >
                    <div className="rc-counter">
                      <button
                        type="button"
                        className="rc-item"
                        onClick={() => go(d.id)}
                        aria-label={`Jump to ${d.label}`}
                      >
                        <span className="rc-puck">
                          <GlyphMark name={d.glyph} size={46} />
                        </span>
                        <span className="rc-label">{d.label}</span>
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* The centre, and the page's H1. The drawn mark is decorative;
              the words underneath it are the real heading, sitting at
              opacity 0 until hover. That keeps one element doing the job
              for everybody — a reader sees the wordmark, a screen reader
              and a crawler get "Regenerative Coffee", and agent view
              (which forces opacity to 1 and paints alt text in place of
              images) gets the heading and nothing else. */}
          <h1
            className={`rc-centre ${hover ? 'is-hover' : ''}`}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            onFocus={() => setHover(true)}
            onBlur={() => setHover(false)}
            tabIndex={0}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="rc-word rc-word-a"
              src="/glyphs/coffee/aura-remarkable-circle.svg"
              alt="" aria-hidden width={191} height={83}
            />
            <span className="rc-word rc-word-b">
              Regenerative<br className="rc-br" />Coffee
            </span>
          </h1>
        </div>
      </div>

      <p className="rc-lede label">Coffee that regenerates the land.</p>

      <style jsx global>{`
        /* The hero is white whatever the theme is, so the bar's marks have
           to go dark above the fold. Keyed off the header's own marker
           rather than a class set on mount, so the bar is right on the
           very first paint. One class more specific than MicroNav's
           force-light rule, which is what makes this win. */
        body:has(.rc-hero):not(.mn-below) .aura-nav {
          --text: #131719;
          --text-body: rgba(19, 23, 25, 0.8);
          --text-muted: rgba(19, 23, 25, 0.6);
          --border: rgba(19, 23, 25, 0.14);
        }
        body:has(.rc-hero):not(.mn-below) .aura-nav .invert-on-light {
          filter: invert(1) !important;
        }
      `}</style>

      <style jsx>{`
        .rc {
          position: relative;
          min-height: 100svh;
          display: flex; align-items: center; justify-content: center;
          background: #fff; color: #131719;
          padding: calc(var(--nav-h) + var(--space-5)) var(--gutter) clamp(72px, 11vh, 148px);
          overflow: hidden;
        }
        .rc-inner { display: flex; justify-content: center; }

        .rc-stage {
          /* one length drives everything — ring, orbit radius, centre */
          --rc-size: min(66vmin, 620px);
          --rc-r: calc(var(--rc-size) * 0.4);
          position: relative;
          width: var(--rc-size);
          aspect-ratio: 1;
        }

        /* The ring opens out on a hover anywhere over the circle — a
           glyph, the centre, the space between them. :hover on the
           stage covers all three, and follows the DOM rather than the
           box, so a puck sitting proud of the stage edge at full
           expansion still counts and the thing cannot flicker.

           Scaling this layer rather than the stage keeps the wordmark
           at its own size — and keeps the physics honest, since this
           element's rect is what the loop measures. */
        .rc-ring {
          position: absolute; inset: 0;
          transform: scale(1);
          transition: transform var(--dur-slow) var(--ease-out);
        }
        .rc-stage:hover .rc-ring { transform: scale(1.1); }

        .rc-spin, .rc-orbit {
          position: absolute; inset: 0;
          width: 100%; height: 100%;
        }
        .rc-orbit { pointer-events: none; overflow: visible; }

        .rc-spin { animation: rc-turn 72s linear infinite; }
        .rc-slot {
          position: absolute; left: 50%; top: 50%;
          width: 0; height: 0;
          display: flex; align-items: center; justify-content: center;
          /* The pull comes first, so it lands in the ring's own frame —
             the same frame the string maths works in. Then out to the
             orbit, then straightened back up. */
          transform: translate(var(--ox, 0px), var(--oy, 0px))
                     rotate(var(--a))
                     translateY(calc(-1 * var(--rc-r)))
                     rotate(calc(-1 * var(--a)));
        }
        /* keeps every glyph upright while the ring turns */
        .rc-counter {
          animation: rc-turn-back 72s linear infinite;
          display: flex; align-items: center; justify-content: center;
        }

        /* The button is exactly the glyph puck, so the orbit line passes
           through the glyph's own centre. The label hangs beneath it,
           out of flow, and never shifts the puck off the ring. */
        .rc-item {
          position: relative;
          display: grid; place-items: center;
          width: 84px; height: 84px;
          border-radius: 50%;
          background: #fff; border: none; padding: 0;
          cursor: grab; touch-action: none;
          user-select: none; -webkit-user-select: none;
          /* the glyph's default ink — the hover handler replaces it */
          color: #131719;
          transition: color var(--dur-base) var(--ease),
                      transform var(--dur-base) var(--ease);
        }
        .rc-item:hover, .rc-item:focus-visible { transform: scale(1.1); }
        .rc-item:active { cursor: grabbing; transform: scale(1.14); }
        .rc-item:focus-visible { outline: none; }
        .rc-puck { display: grid; place-items: center; }

        /* The mask takes the button's colour, so the hover handler above
           only has to set one property. */
        .rc-item :global(.glyph) {
          opacity: 0.82;
          transition: opacity var(--dur-base) var(--ease),
                      background-color var(--dur-base) var(--ease);
          pointer-events: none;
        }
        .rc-item:hover :global(.glyph),
        .rc-item:focus-visible :global(.glyph) { opacity: 1; }

        .rc-label {
          position: absolute; top: 100%; left: 50%;
          transform: translateX(-50%);
          width: 140px; padding-top: 4px;
          font-family: var(--font-mono), monospace;
          font-size: 10px; letter-spacing: 1.4px; text-transform: uppercase;
          line-height: 1.4; text-align: center;
          pointer-events: none;
          /* explicit, so it does not inherit the living colour the hover
             handler sets on the button */
          color: rgba(19, 23, 25, 0.55);
          transition: color var(--dur-base) var(--ease);
        }
        .rc-item:hover .rc-label,
        .rc-item:focus-visible .rc-label { color: #131719; }

        /* ── the centre ── */
        .rc-centre {
          margin: 0; padding: 0;
          position: absolute; left: 50%; top: 50%;
          transform: translate(-50%, -50%);
          display: grid; place-items: center;
          width: min(46%, 300px); aspect-ratio: 1;
          cursor: default;
        }
        .rc-centre:focus-visible { outline: none; }
        .rc-word {
          grid-area: 1 / 1;
          text-align: center;
          color: #131719;
          transition: opacity var(--dur-slow) var(--ease-out),
                      transform var(--dur-slow) var(--ease-out);
        }
        /* the drawn wordmark — black artwork, as supplied */
        .rc-word-a { width: min(82%, 240px); height: auto; }
        .rc-word-b {
          font-family: var(--font-grotesque), sans-serif;
          font-weight: 600;
          font-size: clamp(26px, 4.6vmin, 46px);
          line-height: 1.06; letter-spacing: -0.03em;
          text-transform: uppercase;
          opacity: 0; transform: scale(1.12);
        }
        /* one continuous zoom out: the mark leaving shrinks away, the mark
           arriving settles down into place from slightly larger */
        .rc-centre.is-hover .rc-word-a { opacity: 0; transform: scale(0.88); }
        .rc-centre.is-hover .rc-word-b { opacity: 1; transform: scale(1); }

        /* Sits at the foot of the frame, centred under the ring — banner
           caption type, the .label role carries it. */
        .rc-lede {
          position: absolute;
          left: 50%;
          bottom: clamp(20px, 4vh, 48px);
          transform: translateX(-50%);
          margin: 0; max-width: min(60ch, 80vw);
          text-align: center; white-space: nowrap;
          line-height: 1.5; color: rgba(19, 23, 25, 0.55);
        }
        @media (max-width: 560px) { .rc-lede { white-space: normal; } }

        @keyframes rc-turn      { to { transform: rotate(360deg); } }
        @keyframes rc-turn-back { to { transform: rotate(-360deg); } }

        /* On a phone the ring has to open out, not shrink: the labels
           hang below their pucks and need the radius to clear the
           wordmark in the middle. */
        @media (max-width: 700px) {
          .rc-stage { --rc-size: min(90vmin, 420px); }
          .rc-item { width: 58px; height: 58px; }
          .rc-item :global(.glyph) { width: 32px !important; height: 32px !important; }
          .rc-label { font-size: 8px; letter-spacing: 0.6px; width: 84px; }
          .rc-centre { width: min(44%, 190px); }
          .rc-word-a { width: min(94%, 148px); }
          .rc-word-b { font-size: clamp(15px, 5.4vw, 22px); }
        }

        @media (prefers-reduced-motion: reduce) {
          .rc-spin, .rc-counter { animation: none; }
          .rc-stage:hover .rc-ring { transform: scale(1); }
        }
      `}</style>
    </header>
  )
}

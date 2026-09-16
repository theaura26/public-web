'use client'

import { useEffect, useSyncExternalStore, type RefObject } from 'react'

/* ── The page's ground ───────────────────────────────────────────────
   One fixed layer behind the whole page, not a background per section.

   The difference matters: a section that paints its own ground is a
   block the reader scrolls past, with an edge top and bottom. What the
   design does instead is change what the page *is* made of — the ground
   becomes the dawn, then the indigo print, then the forest green, then
   black again — and the words carry on over it. Same idea as the coffee
   microsite's ChapterBackdrop.

   Every ground is stacked here and one is visible; the change is a
   dissolve, so the reader never sees an edge arrive or leave. Sections
   claim a ground with useGround() while they are on screen.
─────────────────────────────────────────────────────────────────────── */

export type Ground = 'ink' | 'dawn' | 'indigo' | 'forest' | 'film'

/* dim is how much black each ground carries over it. A photograph brings
   its own light, and white type over the dawn gradient or the indigo
   print at full strength is a contrast failure rather than a mood. The
   indigo is the strongest of the three because it is a cream ground with
   dark ink on it, so the type has no help from the picture at all. The
   flat forest green needs none. */
/* The two photographic grounds are 1920px exports (aura-dawn-1920.jpg,
   aura-indigo-1920.jpg) of the 2400px originals, which are not shipped. They
   sit behind a dimming layer and fill the viewport, so the extra width was
   3.9MB nobody could see — 2.9MB of it the indigo print alone. */
/* Phones take the portrait cuts: the film and its poster at native
   pixels, cropped to the part of the frame a tall screen shows. */
const PHONE = '(max-width: 899px)'
const isPhone = () => window.matchMedia(PHONE).matches

const GROUNDS: {
  id: Ground; image?: string; imagePhone?: string; colour?: string
  video?: string; videoPhone?: string; dim?: number
}[] = [
  /* The estate from the air, held in its valley. Its sky is pale haze,
     so it carries more black than the dawn gradient it replaced. */
  {
    id: 'dawn', dim: 0.5,
    video: '/RIPE/aura-ripe-estate.mp4', videoPhone: '/RIPE/aura-ripe-estate-mobile.mp4',
    image: '/RIPE/aura-ripe-estate.jpg', imagePhone: '/RIPE/aura-ripe-estate-mobile.jpg',
  },
  { id: 'indigo', image: '/RIPE/aura-indigo-1920.jpg', dim: 0.56 },
  { id: 'forest', colour: '#052B14' },
  /* The harvest's own footage behind the page's last section, dimmed
     further than the other grounds: it is busier and brighter than the
     cherry film, and the heading, list and CTA sit straight on it. */
  { id: 'film', video: '/RIPE/aura-ripe-harvest.mp4', image: '/RIPE/aura-ripe-harvest.jpg', dim: 0.62 },
]

/* A tiny store rather than context: the claims come from several
   sections and the backdrop is a sibling of all of them. */
let current: Ground = 'ink'
const claims = new Map<string, Ground>()
const listeners = new Set<() => void>()

function recompute() {
  /* Last claim wins — sections claim in document order as they arrive,
     and the newest is the one the reader is in. */
  const next = [...claims.values()].pop() ?? 'ink'
  if (next === current) return
  current = next
  listeners.forEach((l) => l())
}

function subscribe(l: () => void) {
  listeners.add(l)
  return () => { listeners.delete(l) }
}

/** Claim a ground while `ref` is on screen. */
export function useGround(id: Ground, ref: RefObject<HTMLElement | null>, key: string) {
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) claims.set(key, id)
        else claims.delete(key)
        recompute()
      },
      /* The band is the middle of the screen, so a ground changes when
         its section owns the view rather than when it first peeks in.
         Wide rather than narrow: at 35% a ground was handed back in the
         gap between two claiming sections, and the page blinked to black
         between them. */
      { rootMargin: '-20% 0px -20% 0px', threshold: 0 },
    )
    io.observe(el)
    return () => { io.disconnect(); claims.delete(key); recompute() }
  }, [id, ref, key])
}

export function RipeBackdrop() {
  const active = useSyncExternalStore(subscribe, () => current, () => 'ink' as Ground)

  return (
    <div className="ripe-bg" aria-hidden>
      {GROUNDS.map((g) => (
        <div
          key={g.id}
          className={`ripe-bg__layer ${active === g.id ? 'is-on' : ''}`}
          style={g.colour ? { background: g.colour } : undefined}
        >
          {g.video ? (
            /* Only decoded while it is the ground: a film running behind
               every other section would cost a decode a frame for the
               whole page. */
            /* The poster too: a poster attribute downloads at once even
               on a hidden layer, so it is only set on the ground in use.
               The server always renders the ink ground, so isPhone() is
               never reached during hydration. */
            <video muted loop playsInline preload="none"
                   poster={active === g.id ? (g.imagePhone && isPhone() ? g.imagePhone : g.image) : undefined}
                   ref={(el) => {
                     if (!el) return
                     if (active === g.id) el.play().catch(() => {})
                     else el.pause()
                   }}>
              {g.videoPhone && <source media={PHONE} src={g.videoPhone} type="video/mp4" />}
              <source src={g.video} type="video/mp4" />
            </video>
          ) : g.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={g.image} alt="" loading="lazy" decoding="async" />
          ) : null}
          {g.dim ? <i className="ripe-bg__dim" style={{ opacity: g.dim }} /> : null}
        </div>
      ))}

      <style jsx>{`
        .ripe-bg {
          position: fixed; inset: 0; z-index: 0;
          pointer-events: none; background: var(--ripe-ink);
        }
        /* Through black rather than across. The layer leaving starts
           going at once and the layer arriving waits for most of that,
           so between the two the reader sees the page's own black — the
           new ground fades up out of it instead of dissolving through
           the old one, which crossfaded two photographs into a third
           picture that was neither. */
        .ripe-bg__layer {
          position: absolute; inset: 0;
          opacity: 0;
          transition: opacity 620ms var(--ease-out);
        }
        .ripe-bg__layer.is-on {
          opacity: 1;
          transition: opacity 900ms var(--ease-out) 420ms;
        }
        .ripe-bg__dim { position: absolute; inset: 0; background: #000; }
        .ripe-bg__layer img,
        .ripe-bg__layer video {
          width: 100%; height: 100%; object-fit: cover; display: block;
        }
        @media (prefers-reduced-motion: reduce) {
          .ripe-bg__layer { transition: none; }
        }
      `}</style>
    </div>
  )
}

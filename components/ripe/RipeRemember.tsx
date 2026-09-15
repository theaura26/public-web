'use client'

import { useEffect } from 'react'
import { useReveal } from './useReveal'
import { useGround } from './RipeBackdrop'
import { REMEMBER } from './copy'

/* ── Remember ────────────────────────────────────────────────────────
   The evening question, the memory form, and the two polaroids.

   The form sends nothing anywhere, and that is the design's own
   instruction rather than an omission: the line beneath it reads
   "Memories added here stay with this page for now — nothing is sent
   anywhere yet." So entries are kept in this browser and nowhere else.

   That also means this page needs no contact endpoint, no mail provider
   and no environment variable. When it does get a destination, the shape
   below is the payload it should send.
─────────────────────────────────────────────────────────────────────── */

type Memory = { id: string; text: string; name: string; tree: string; photo: string; at: string }

const KEY = 'aura:ripe:memories'

/* A tiny store rather than a read into state inside an effect.
 *
 * Reading localStorage in useEffect and calling setState works, but it is
 * a synchronous setState in an effect body: it renders twice on mount and
 * React's own lint says so. A store subscription renders once and answers
 * with an empty list on the server, where there is no localStorage.
 *
 * The parsed value is cached because getSnapshot has to return a stable
 * reference — parsing afresh on every call hands React a new array each
 * time and it re-renders for ever.
 */
let cache: Memory[] | null = null
const listeners = new Set<() => void>()
/* Exported with subscribe() below: together they are what
   useSyncExternalStore needs, and the parked form is the only thing that
   was reading them. Kept as the module's API rather than deleted, so the
   form comes back as markup alone. */
export const EMPTY: Memory[] = []

export function readStore(): Memory[] {
  if (cache) return cache
  try {
    const raw = window.localStorage.getItem(KEY)
    cache = raw ? (JSON.parse(raw) as Memory[]) : []
  } catch {
    /* Private windows, cleared site data, browsers set to block storage.
       An empty list is the correct reading of all of them. */
    cache = []
  }
  return cache
}

function writeStore(next: Memory[]) {
  cache = next
  try { window.localStorage.setItem(KEY, JSON.stringify(next)) } catch { /* kept for this visit only */ }
  listeners.forEach((l) => l())
}

export function subscribe(l: () => void) {
  listeners.add(l)
  return () => { listeners.delete(l) }
}

/* Adding a memory. Kept here while the form itself is parked, because
   it is the only part that was worth working out: the entry shape, and
   writing through the store so every mounted copy of the section sees
   the new list at once. The fields that called it are commented in the
   markup below. */
export function addMemory(fields: { text: string; name?: string; tree?: string; photo?: string }) {
  const text = fields.text.trim()
  if (!text) return false
  const entry: Memory = {
    id: String(Date.now()),
    text,
    name: (fields.name ?? '').trim(),
    tree: (fields.tree ?? '').trim(),
    photo: fields.photo ?? '',
    at: new Date().toISOString(),
  }
  writeStore([entry, ...readStore()])
  return true
}

/* The prints are laid down by the scroll, one at a time. Each slides in
   from its own side, tilted further than it rests, and settles as it rises
   through the lower part of the screen. The first sits higher, so it has
   landed before the second starts — the reader takes in one photograph and
   its caption, then the next. Read on the scroll event, not an animation
   frame, for the same reason as the spine in RipeDays. */
const SHOT_START = 0.95
const SHOT_SPAN = 0.4
/* Each later print waits this much more of the screen before it starts,
   so side by side on a desktop they still arrive in turn. */
const SHOT_STAGGER = 0.2

export function RipeRemember() {
  const ref = useReveal<HTMLElement>()
  /* Forest green from here, running on into the tree registry, so the two
     sections about what the gathering leaves behind share one ground. */
  useGround('forest', ref, 'remember')

  useEffect(() => {
    const shots = Array.from(document.querySelectorAll<HTMLElement>('.rem .shot'))
    if (!shots.length) return
    const rest = [-4, 5]
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      shots.forEach((el, i) => { el.style.opacity = '1'; el.style.transform = `rotate(${rest[i] ?? 0}deg)` })
      return
    }
    shots.forEach((el) => { el.style.transition = 'none' })
    const update = () => {
      const vh = window.innerHeight
      const tops = shots.map((el) => el.getBoundingClientRect().top)
      shots.forEach((el, i) => {
        const p = Math.min(Math.max((vh * (SHOT_START - i * SHOT_STAGGER) - tops[i]) / (vh * SHOT_SPAN), 0), 1)
        const e = 1 - Math.pow(1 - p, 3)
        const dir = i % 2 === 0 ? -1 : 1
        el.style.opacity = e.toFixed(3)
        el.style.transform =
          `translate3d(${((1 - e) * dir * 70).toFixed(1)}px, ${((1 - e) * 40).toFixed(1)}px, 0) ` +
          `rotate(${((rest[i] ?? 0) + (1 - e) * dir * 12).toFixed(2)}deg)`
      })
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [])

  return (
    <section ref={ref} id="remember" className="rem">
      <div className="section-w rem__in">
        <div className="rem__left">
          <h2 className="rem__h">{REMEMBER.title}</h2>
          <p className="rem__b">{REMEMBER.body.join(' ')}</p>

          {/* The memory form is parked for now, at your request.
              Nothing else was removed: copy.ts still carries its labels
              under REMEMBER.form, the localStorage store above is intact,
              and addMemory() is exported ready for it. Putting it back is
              re-rendering the fields, not rebuilding the feature. */}
        </div>

        <div className="rem__shots">
          {REMEMBER.shots.map((s, i) => (
            /* No figcaption: the handwritten line is printed on the
               polaroid itself, so rendering it again put the same words
               on the page twice. It stays in copy.ts as the alt text's
               source and as the record of what each shot says. */
            <figure key={s.src} className={`shot shot--${i + 1}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={s.src} alt={`${s.alt} — captioned “${s.caption}”`}
                   width={s.w} height={s.h} loading="lazy" decoding="async" />
            </figure>
          ))}
        </div>
      </div>

      <style jsx>{`
        .rem { padding: var(--ripe-section-gap) 0; }
        .rem__in {
          display: grid; gap: clamp(48px, 7vw, 96px);
          grid-template-columns: 1fr; align-items: start;
        }
        /* Side by side from 1200, in two near-equal halves. The old 40ch
           column was sized for body text; with the heading at the large h2
           it held three words a line and ran to six lines at 1024. */
        @media (min-width: 1200px) { .rem__in { grid-template-columns: minmax(0, 1fr) minmax(0, 0.9fr); } }

        .rem__h {
          font-family: var(--font-grotesque), sans-serif; font-weight: 400;
          letter-spacing: var(--t-track); color: #fff; margin: 0 0 var(--space-6);
          max-width: 16ch;
        }
        .rem__b {
          font-size: var(--t-p1-size); line-height: var(--t-p1-lh);
          letter-spacing: var(--t-track); color: rgba(255,255,255,0.88);
          margin: 0 0 0.8em; text-wrap: pretty;
        }
        .rem__form {
          margin: var(--sp-cluster) 0 0; max-width: 560px;
          opacity: 0; transform: translateY(16px);
          transition: opacity .9s var(--ease-out), transform .9s var(--ease-out);
        }
        .rem.is-in .rem__form { opacity: 1; transform: translateY(0); }

        .rem__legend {
          display: block;
          font-size: 17px; line-height: 1.2; letter-spacing: -0.03em;
          text-transform: uppercase; color: rgba(255,255,255,0.7);
          margin: 0 0 8px;
        }
        .rem__pair { display: grid; gap: var(--space-4); grid-template-columns: 1fr; margin: var(--space-5) 0 0; }
        @media (min-width: 560px) { .rem__pair { grid-template-columns: repeat(2, minmax(0,1fr)); } }
        .rem__field { display: block; margin: var(--space-5) 0 0; }
        .rem__pair .rem__field { margin: 0; }

        .rem__err {
          font-size: 15px; color: var(--error, #e5484d); margin: 8px 0 0;
        }
        .rem__send {
          display: inline-block; margin: var(--space-6) 0 0;
          padding: 9px 20px; min-width: 126px;
          font-family: var(--font-grotesque), sans-serif;
          font-size: 17px; letter-spacing: -0.03em; text-transform: uppercase;
          color: var(--ripe-ink); background: var(--ripe-field);
          border: none; border-radius: 2px; cursor: pointer;
          transition: background var(--dur-base) var(--ease);
        }
        .rem__send:hover { background: #fff; }
        .rem__note {
          font-size: 17px; line-height: 1.2; letter-spacing: -0.03em;
          color: rgba(255,255,255,0.55); margin: var(--space-5) 0 0;
        }

        .rem__list { list-style: none; margin: var(--space-6) 0 0; padding: 0; }
        .rem__list li {
          border-top: 1px solid rgba(255,255,255,0.2);
          padding: var(--space-4) 0; display: flex; flex-direction: column; gap: 4px;
        }
        .rem__list-t { font-size: 17px; line-height: 1.35; color: #fff; }
        .rem__list-m {
          font-size: 15px; color: rgba(255,255,255,0.5);
          text-transform: uppercase; letter-spacing: 0.02em;
        }

        /* nowrap, and they overlap. These are two prints dropped on a
           table, one over the corner of the other — wrapping put them in
           a column, which is two photographs on a page instead. The
           width is small enough that the pair fits its column at every
           size the section has, so the arrangement never breaks apart.

           They shuffle in: each starts further round and further out
           than it lands, and the second is a beat behind the first, so
           the pair settles rather than appearing. The transform carries
           both the arrival and the resting angle, which is why it is on
           the figure and not the image. */
        .rem__shots {
          display: flex; flex-wrap: nowrap; gap: 0;
          justify-content: center; align-items: flex-start;
        }
        .shot {
          margin: 0; width: clamp(150px, 21vw, 310px);
          opacity: 0;
          transition: opacity .8s var(--ease-out), transform 1.1s var(--ease-out);
        }
        .shot img {
          display: block; width: 100%; height: auto; aspect-ratio: 512 / 546;
          object-fit: contain;
        }
        .shot--1 { z-index: 1; transform: rotate(-15deg) translate(-9%, 7%); }
        .shot--2 {
          z-index: 2; transform: rotate(17deg) translate(9%, 7%);
          margin-left: -13%; margin-top: clamp(28px, 6vw, 80px);
        }
        .rem.is-in .shot { opacity: 1; }
        .rem.is-in .shot--1 { transform: rotate(-4deg) translate(0, 0); }
        .rem.is-in .shot--2 {
          transform: rotate(5deg) translate(0, 0);
          transition-delay: .16s;
        }
        /* Narrow screens: bigger, and staggered down the column rather
           than side by side. At 150px each the prints were too small to
           read the faces or the handwriting. Side by side at that size
           was the only way they fitted — so on a single column they drop
           one under the other instead, the second overlapping the first
           print's lower corner from the right, each as large as the
           column allows up to three times the old width. Still two
           prints on a table, still tilted, still overlapping. */
        @media (max-width: 1199px) {
          /* Stacked, the photographs come first and the question follows. */
          .rem__shots { order: -1; flex-direction: column; align-items: center; }
          .shot { width: min(270px, 47%); }
          /* A loose pile in the middle: the second print only catches the
             bottom corner of the first, so the first photograph and its
             caption stay readable. A margin percentage is measured against
             the container's width, the same base as the print's own width,
             so the overlap holds at every size. */
          .shot--1 { align-self: center; margin-right: 14%; }
          .shot--2 { align-self: center; margin-left: 14%; margin-top: calc(min(270px, 47%) * -0.3); }
        }
        @media (prefers-reduced-motion: reduce) {
          .shot { transition: none; }
        }
      `}</style>

      <style jsx global>{`
        .rem__area, .rem__input {
          display: block; width: 100%;
          font-family: var(--font-grotesque), sans-serif;
          font-size: 17px; line-height: 1.3; letter-spacing: -0.03em;
          color: var(--ripe-ink); background: var(--ripe-field);
          border: none; border-radius: 2px; outline: none;
          padding: 10px 12px; resize: vertical;
        }
        .rem__area { min-height: 157px; }
        .rem__input { height: 40px; }
        .rem__input--short { max-width: 269px; }
        .rem__area::placeholder, .rem__input::placeholder { color: rgba(7,16,11,0.45); }
        .rem__area:focus, .rem__input:focus { box-shadow: 0 0 0 2px var(--ripe-green); }
      `}</style>
    </section>
  )
}

'use client'

import Link from 'next/link'
import { CATEGORIES, notesIn, type NoteEntry } from '@/lib/field-notes'
/* The shape lives with the data that defines it, and is re-exported so
   a caller can type its own lanes without reaching past this file. */
import { FROM_AURA, type Lane } from '@/lib/from-aura'
export type { Lane }

/* ── Lanes ────────────────────────────────────────────────────────
   A section’s whole contents, one lane per group, each scrolling
   sideways off the right edge. Everything is visible in a handful of
   gestures rather than one long column, and a reader who only wants one
   group never scrolls past the others.

   Two sections are built this way — Field Notes and From Aura — so the
   layout lives here once and each supplies its own lanes. An item can
   legitimately appear in more than one lane; in Field Notes a
   cross-listed note does exactly that.
*/



function Card({ note }: { note: NoteEntry }) {
  const inner = (
    <>
      <span className="lane-plate" data-noimg={note.img ? undefined : 'true'} aria-hidden>
        {note.img ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={note.img} alt="" loading="lazy" decoding="async" />
        ) : null}
      </span>
      <span className="lane-t">{note.title}</span>
      {note.from && <span className="lane-from">In {note.from}</span>}
    </>
  )

  return note.status === 'soon' ? (
    <span className="lane-card is-soon" aria-disabled>{inner}</span>
  ) : (
    <Link href={note.href} className="lane-card">{inner}</Link>
  )
}


/* The lane's styles, so both the index pages and a single strip on a
   product page can render a lane without either owning the CSS. */
function LaneStyles() {
  return (
      <style jsx global>{`
        /* Global, not scoped: styled-jsx cannot put its scope class on a
           <Link>, and the cards are Links. Every selector is therefore
           nested under .sw by hand so nothing escapes this page. */
        /* A single lane at the foot of another page carries none of the
           index page’s own framing. */
        .sw.is-strip {
          min-height: 0;
          padding: var(--section-gap) 0 var(--space-8);
        }
        /* The lane already pads under its card titles, and the strip pads
           under the lane, and the footer pads above itself. Three paddings
           stacked read as an empty screen, so the innermost one stands
           down inside a strip. */
        .sw.is-strip .lane-scroll { padding-bottom: 0; }
        @media (max-width: 768px) {
          .sw.is-strip { padding: var(--space-9) 0 var(--space-7); }
        }
        .sw {
          background: var(--bg); color: var(--text);
          padding: calc(var(--nav-h) + var(--head-top)) 0 var(--section-gap);
          min-height: 100svh;
          display: flex; flex-direction: column;
          gap: var(--head-bottom);
        }
        .sw .sw-head { align-items: center; text-align: center; display: flex; flex-direction: column; gap: var(--space-5); }
        /* The banner title spec, unchanged — same size, weight, tracking
           and measure as every journal hero. This page had drifted to a
           smaller size and much tighter tracking, which read as a
           different family of page. */
        .sw .sw-h {
          margin: 0 auto;
          font-family: var(--font-grotesque), sans-serif;
          font-weight: 600;
          font-size: clamp(48px, 7.2vw, 106px);
          line-height: 1;
          letter-spacing: -0.03em;
          text-transform: uppercase;
          color: var(--text);
          max-width: min(90vw, 7.5em);
          text-wrap: balance;
          text-align: center;
        }

        /* ── one lane ── */
        .sw .lane { display: flex; flex-direction: column; gap: var(--space-3); }
        /* The heading and the rule beneath it. It was a two-item flex
           row until the 'all N' link came out; with one child the
           space-between and the gap had nothing left to do. */
        /* Centred under a centred title and set in mono: this line
           states what the page is rather than starting an argument, so
           it takes the label role. */
        .sw .sw-lede {
          font-family: var(--font-mono), monospace;
          font-size: 11px; letter-spacing: 1px; text-transform: uppercase;
          line-height: normal;
          /* Page ink, like the homepage's opening lines. Muted put a
             sentence that carries the whole section into the same weight
             as a caption. */
          color: var(--text);
          margin: 0; max-width: 46ch;
        }

        .sw .lane-bar { padding-bottom: 0; }
        /* The lane heading stays h3. The cards beneath it stepped down
           to p1 so a card title no longer competes with the name of the
           lane it sits in. */
        /* One line under the lane heading saying what is in it. The p1
           class carries the type; this only places it. */
        .sw .lane-lede {
          margin: 6px 0 0; max-width: 56ch;
          color: var(--text-body);
        }
        .sw .lane-h {
          font-family: var(--font-grotesque), sans-serif; font-weight: 400;
          font-size: clamp(24px, 3vw, 32px); line-height: 1.15; letter-spacing: -0.03em;
          margin: 0;
        }
        .sw .lane-lede {
          font-family: var(--font-sans); font-size: 16px; line-height: 1.55; letter-spacing: normal; color: var(--text-body);
          margin: 0; max-width: 60ch;
        }

        /* The rail bleeds past the gutter so it reads as continuing
           beyond the viewport rather than stopping at the margin. */
        .sw .lane-bleed {
          /* The lane's own gap is now the heading-to-lede pairing, so the
             cards restore their own distance rather than inheriting it. */
          margin-top: var(--space-4);
          position: relative;
          width: 100vw;
          margin-left: calc(50% - 50vw);
        }
        /* The row dissolves off the right rather than hard-cropping.
           A blur, ramped in by a mask so there is no edge where it
           starts. An earlier version flickered as the lane scrolled: the
           blur is its own promoted layer, and a layer whose bounds change
           every frame gets re-rasterised against a moving backdrop. The
           two lines that fix it are transform: translateZ(0), which
           promotes it once and keeps it promoted, and will-change, which
           tells the compositor the same thing before the first frame
           rather than after it. (No backticks in here: this is inside a
           template literal and one would end it.)

           No wash of the page ground behind it. A gradient to white is
           what this used to be, and it read as the row being covered up
           rather than running on past the edge. The mask does that job:
           the blur ramps from nothing to full across the strip, so the
           last card goes soft rather than going pale. */
        /* The mask has to sit on a wrapper, not on the blurred element.
           A backdrop-filter is composited from what is behind the element
           rather than painted as its content, so a mask on the same
           element does not attenuate it — the blur came out as a hard
           rectangle with a visible vertical seam down its left edge,
           which is the opposite of a fade. Masking the parent clips the
           child's composited result, so the blur ramps in properly. */
        .sw .lane-fade {
          position: absolute;
          top: 0; bottom: 0; right: 0;
          width: clamp(64px, 12vw, 200px);
          pointer-events: none;
          z-index: 2;
          mask-image: linear-gradient(to right, transparent 0%, #000 62%);
          -webkit-mask-image: linear-gradient(to right, transparent 0%, #000 62%);
        }
        .sw .lane-fade__blur {
          position: absolute;
          inset: 0;
          transform: translateZ(0);
          will-change: transform;
        }
        .sw .lane-scroll {
          overflow-x: auto;
          /* No scroll-snap. Snapping pulls the first card flush to the
             container edge, which scrolls straight past the track’s rail
             padding and lands it at x=0 instead of on the heading. */
          padding: var(--space-4) 0 var(--space-7);
          scrollbar-width: none; -ms-overflow-style: none;
        }
        .sw .lane-scroll::-webkit-scrollbar { display: none; height: 0; }
        .sw .lane-track {
          display: flex; gap: clamp(16px, 2.2vw, 32px);
          width: max-content;
          /* Reproduces the rail so the first card lines up with the lane
             heading above it, and the last runs past the right edge. */
          padding-left: max(var(--gutter), calc(50vw - var(--max-w) / 2 + var(--gutter)));
          /* The blurred fade sits over the last card at the end of the
             scroll, so the track has to be able to travel past it —
             a gutter alone left the final card permanently half-dissolved
             with nowhere further to scroll. */
          padding-right: calc(clamp(64px, 12vw, 200px) + var(--gutter));
        }

        .sw .lane-card {
          flex: none;
          /* One column of the two-column index grid, so a card is the
             same object in both places rather than two sizes of it. */
          width: calc(
            (min(var(--max-w), 100vw) - 2 * var(--gutter) - clamp(28px, 4vw, 56px)) / 2
          );
          display: flex; flex-direction: column; gap: var(--space-3);
          text-decoration: none; color: inherit;
        }
        /* Announced, not open. Dimmed and inert, and unlabelled — the
           same treatment the menu gives Munduk and Punakha. The stamp
           said in words what the grey already says. */
        /* Unreleased, not unreadable. The card is no longer dimmed as a
             whole — that multiplied against the plate's own dimming and
             took a photograph down to about a tenth of its opacity. The
             muted label and the flat plate carry the meaning instead. */
        .sw .lane-card.is-soon { cursor: default; }

        .sw .lane-plate {
          position: relative; display: block;
          aspect-ratio: var(--lane-ratio, 16 / 9); overflow: hidden;
          border-radius: var(--radius-1);
          background: var(--bg-card);
        }
        .sw .lane-plate img {
          width: 100%; height: 100%; object-fit: cover; display: block;
          transition: transform var(--dur-slow) var(--ease-out);
        }


        /* An unwritten note has no photograph — a flat plate, not an
           empty box. */
        .sw .lane-plate[data-noimg='true'] { background: var(--text-muted); opacity: 0.16; }
        /* Only the empty plate is dimmed. A plate holding a picture keeps
           it; the photograph is the whole reason the card is worth
           showing before the product is released. */
        .sw .lane-card.is-soon .lane-plate[data-noimg='true'] {
          background: var(--text-muted); opacity: 0.18;
        }

        /* p1, the body role. Set here rather than by adding the class to
           the span, because the lane also animates its colour. */
        .sw .lane-t {
          font-family: var(--font-sans); font-size: 16px; line-height: 1.55;
          letter-spacing: normal; font-weight: 400;
          transition: color var(--dur-base) var(--ease);
          color: var(--text);
        }
        .sw .lane-card.is-soon .lane-t { color: var(--text-muted); }
        .sw .lane-from {
          font-family: var(--font-mono), monospace; font-size: 11px; letter-spacing: 1px; text-transform: uppercase; line-height: normal;
          color: var(--text-muted);
        }

        @media (prefers-reduced-motion: reduce) {
          .sw .lane-plate img { transition: none; }
        }
      
        /* Mobile. A lane still scrolls sideways — that gesture is the
           point and works better on a phone than on a mouse — but a
           461px card on a 375px screen leaves no room to see there is
           another one behind it. */
        @media (max-width: 768px) {
          .sw { gap: clamp(44px, 6vh, 64px); }
          .sw .lane-card { width: min(78vw, 320px); }
          /* The overhang has to come along. Overriding the width alone
             left the fade positioned 32px off-screen at right:-32px with
             only 8px of itself visible — a hard sliver of blur instead of
             a gradient. */
          .sw .lane-fade { width: clamp(40px, 10vw, 72px); }
          .sw .lane { gap: var(--space-3); }
          /* Only the lane lede fills — it is body prose. The centred
             mono line keeps its measure at every width; letting it run
             the full width of a phone was what made it a four-line
             uppercase block. */
          .sw .lane-lede { max-width: 100%; }
        }
      `}</style>
  )
}

export function Swimlanes({
  title, lede, lanes, ratio = '16 / 9',
}: { title: string; lede: string; lanes: Lane[]; ratio?: string }) {
  return (
    <main className="sw" style={{ ['--lane-ratio' as string]: ratio }}>
      <div className="section-w sw-head">
        <h1 className="sw-h">{title}</h1>
        <p className="sw-lede">{lede}</p>
      </div>

      {lanes.map((cat) => {
        const notes = cat.items
        if (!notes.length) return null
        return (
          <section className="lane" key={cat.id} aria-labelledby={`lane-${cat.id}`}>
            <div className="section-w lane-bar">
              <h2 className="lane-h" id={`lane-${cat.id}`}>{cat.label}</h2>
            </div>
            {/* The rail belongs to the wrapper. A narrow max-width on
                the same element that carries section-w’s padding fights
                it, and the lede lands 40px left of every other line. */}
            <div className="section-w">
              <p className="lane-lede">{cat.lede}</p>
            </div>

            {/* Full-bleed, so the row runs off the right edge instead of
                stopping at the rail. The track’s own padding reproduces
                the rail on the left so the first card still starts on
                the heading’s line. */}
            <div className="lane-bleed">
              <div className="lane-scroll">
                <div className="lane-track">
                  {notes.map((n) => <Card key={`${cat.id}-${n.href}`} note={n} />)}
                </div>
              </div>
              {/* A gradient to the page ground, not a backdrop blur. The
                  blur composited as a hard-edged rectangle over the
                  cards — its own layer, promoted and rasterised
                  separately, so its edge never met the mask cleanly and
                  it flickered while the lane scrolled. */}
              {/* backdrop-filter inline: styled-jsx drops it from emitted rules
              on this build. */}
          <div className="lane-fade" aria-hidden>
            <div
              className="lane-fade__blur"
              style={{ backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)' }}
            />
          </div>
            </div>
          </section>
        )
      })}

      <LaneStyles />
    </main>
  )
}

/**
 * One lane on its own, for the foot of a page that is not an index —
 * a product page showing more of the store. Same markup and same styles
 * as a lane inside Swimlanes, wrapped in .sw so those styles apply.
 */
export function RelatedLane({
  label, lede, items, ratio = '16 / 9',
}: { label: string; lede?: string; items: NoteEntry[]; ratio?: string }) {
  if (!items.length) return null
  return (
    <section className="sw is-strip" style={{ ['--lane-ratio' as string]: ratio }}>
      <div className="lane">
        <div className="section-w lane-bar">
          <h2 className="lane-h">{label}</h2>
        </div>
        {lede && (
          <div className="section-w"><p className="lane-lede">{lede}</p></div>
        )}
        <div className="lane-bleed">
          <div className="lane-scroll">
            <div className="lane-track">
              {items.map((n) => <Card key={n.href} note={n} />)}
            </div>
          </div>
          {/* backdrop-filter inline: styled-jsx drops it from emitted rules
              on this build. */}
          <div className="lane-fade" aria-hidden>
            <div
              className="lane-fade__blur"
              style={{ backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)' }}
            />
          </div>
        </div>
      </div>
      <LaneStyles />
    </section>
  )
}

/** Field Notes: one lane per category, in taxonomy order. */
export function NoteSwimlanes() {
  const lanes: Lane[] = CATEGORIES
    .map((c) => ({ id: c.id, label: c.label, lede: c.lede, items: notesIn(c.id) }))
    .filter((l) => l.items.length)
  return (
    <Swimlanes
      title="Field Notes"
      lede="What the estate has learned, sorted by the discipline that learned it. Some notes sit in more than one lane, which is usually a sign they matter."
      lanes={lanes}
    />
  )
}

/** From Aura: the land, the atelier, and the trade desk. */
export function FromAuraSwimlanes() {
  return (
    <Swimlanes
      title="From Aura"
      lede="What the estate grows, what its studios make, and the days it opens to people from outside it. Every line here is arranged with the estate directly — write to us and tell us what you are after."
      lanes={FROM_AURA}
      ratio="4 / 5"
    />
  )
}
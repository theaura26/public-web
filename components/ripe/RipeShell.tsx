'use client'

import type { ReactNode } from 'react'
import { RipeBackdrop } from './RipeBackdrop'
import { useScrollAppear } from './useScrollAppear'

/* ── RIPE shell ──────────────────────────────────────────────────────
   Everything global to this page and nothing beyond it: the three brand
   values, the anchor offsets, and the agent-view flattening.

   It lives here rather than in app/globals.css on purpose. The styles
   exist only while /ripe is rendering, so deleting components/ripe takes
   the whole festival with it and leaves the shared stylesheet untouched.

   The brand green is #23FF88, read from the fill of the supplied
   artwork (public/RIPE/aura-the-rhythm.svg) rather than sampled off the
   banner photograph, where JPEG compression shifts it.
─────────────────────────────────────────────────────────────────────── */

export function RipeShell({ children }: { children: ReactNode }) {
  useScrollAppear()
  return (
    <div className="ripe-page">
      <RipeBackdrop />
      <div className="ripe-page__flow">{children}</div>

      {/* The timeline's depth-of-field. Fixed to the viewport, blurring
          what passes behind them; RipeDays turns them on while the run
          is on screen. They carry no colour, so nothing under them
          shifts hue — only sharpness. */}
      <div className="ripe-timeline-fade ripe-timeline-fade--top" aria-hidden />
      <div className="ripe-timeline-fade ripe-timeline-fade--bottom" aria-hidden />

      <style jsx global>{`
        /* The five values the design actually uses, read from the file:
           the frame's own fill, the brand green from the artwork, the one
           periwinkle on the 23 September line, and the grey of the form
           fields. There is no paper ground in this design — it is black
           from the opener to the last line. */
        .ripe-page {
          --ripe-ink: #000000;
          --ripe-green: #23FF88;
          --ripe-indigo: #8CA7FE;
          --ripe-field: #D9D9D9;
          --ripe-paper: #E3DCCE;

          /* The page's vertical rhythm, in two values so it stays
             consistent rather than each section inventing its own.
             A card is one beat of the timeline; a section is a chapter. */
          /* Four steps, deliberately far apart so the clustering reads.
             The previous two values — 120-340 and 150-420 — were close
             enough that a card break and a section break looked the same,
             which is what made the page feel undifferentiated.

               group    a heading to the thing it names
               cluster  one chunk to the next inside a section
               card     one beat of the timeline to the next
               section  one section to the next

             Each step is roughly double the one before it. */
          --sp-group: clamp(20px, 3vh, 44px);
          --sp-cluster: clamp(64px, 10vh, 150px);
          --ripe-card-gap: clamp(110px, 20vh, 280px);
          --ripe-section-gap: clamp(190px, 36vh, 480px);

          /* ── Type ──
             Seven roles, down from the eighteen the file carries. The
             merges, and why each is safe:

               display   60/100 and 60/110 and 60/112 were the same role
                         at three leadings — one of them used 17 times and
                         the others once each. Merged at 105, which reads
                         for both a three-word title and a four-line
                         statement.
               body      20/120 and 20/150 likewise, 8 uses against 1.
                         Merged at 140.
               label     20/700 and 20/800 are a bold and an extra-bold
                         doing one job. Merged at 800.

             Tracking is one value because the file uses one: -3% on
             everything except the hand captions, which set 0. */
          --t-track: -0.03em;

          --t-display-size: clamp(27px, 3.125vw, 60px);
          --t-display-lh: 1.05;

          --t-tagline-size: clamp(28px, 4.6vw, 75px);
          --t-tagline-lh: 1.05;

          /* Two paragraph roles, named after the site's own. P1 carries
             a section: the opening intro, the note under a display
             heading. P2 is the quieter one, inside a card or a programme
             column. --t-lead-* and --t-body-* stay as the names the rules
             already use, pointed at the two roles, so a change to either
             lands everywhere at once. */
          --t-p1-size: clamp(17px, 1.5vw, 24px);
          --t-p1-lh: 1.5;
          --t-p2-size: clamp(13px, 1.05vw, 20px);
          --t-p2-lh: 1.4;

          --t-lead-size: var(--t-p1-size);
          --t-lead-lh: var(--t-p1-lh);

          --t-cardhead-size: clamp(16px, 1.5vw, 22px);
          --t-cardhead-lh: 1.2;

          --t-body-size: var(--t-p2-size);
          --t-body-lh: var(--t-p2-lh);

          --t-label-lh: 1.2;

          /* The hand.

             The design sets these in Arvind at 30 and 27.2. Mynerve
             stands in for it and runs optically smaller at the same
             point size — its x-height is lower and its strokes lighter,
             so a 30px Mynerve quote reads noticeably quieter than the
             30px Arvind it replaces.

             So the role carries a multiplier rather than hard-coded
             sizes: --t-hand-scale is the single value to tune if the
             quotes want to sit heavier or lighter against the
             photographs, and it disappears (set it to 1) the day Arvind
             itself is licensed and loaded. */
          --t-hand-scale: 1.05;
          --t-hand-size: calc(clamp(18px, 1.7vw, 30px) * var(--t-hand-scale));
          --t-hand-lh: 1.2;
          background: var(--ripe-ink);
          color: #fff;
          position: relative;
        }
        /* Above the fixed ground. */
        .ripe-page__flow { position: relative; z-index: 1; }

        /* One left edge for the whole page.
           The timeline sets its titles at 9% + 30px, which is the
           design's own measure, and every other block sat on the site's
           article rail — 38px to the right of it at 1512. Two left edges
           down one page read as a mistake rather than a rhythm, so the
           rail is pulled onto the timeline's edge: it is the leftmost of
           the two, and the one the file measures from.

           Desktop only. Below 900 the timeline stacks and 9% of a phone
           is not a gutter, so the site's own rail is the right one. */
        @media (min-width: 900px) {
          .ripe-page .section-w {
            max-width: none; margin: 0;
            padding-inline: calc(9% + 30px);
          }
        }

        /* Phones. 36vh between sections is a chapter break on a monitor
           and most of a screen of black on a phone, so both of the larger
           steps come down. Running text also stops short of the right
           gutter by a tenth, so a paragraph reads as a column rather than
           a slab edge to edge. The class is doubled only to outrank the
           scoped measures the sections set for desktop. */
        @media (max-width: 899px) {
          .ripe-page {
            --ripe-section-gap: clamp(88px, 13vh, 128px);
            --sp-cluster: clamp(44px, 7vh, 72px);
          }
          .ripe-page.ripe-page main :is(
            .open__intro, .arcs__note, .prep__lead,
            .prep__grid:not(.prep__grid--bring),
            .grat__col, .rem__left, .reg__b,
            .harv__from, .harv__b
          ) { max-width: 90%; }
        }

        /* Anchor targets clear both bars — the site's own and the RIPE
           one parked under it. */
        .ripe-page [id] { scroll-margin-top: calc(var(--nav-h) + 52px); }
        /* The per-beat markers inside the held run are the exception.
           They sit at the exact scroll offset of their beat, so any
           margin lands the reader part-way through a dissolve. The copy
           in the run is bottom-anchored and the bars overlay the top of
           the stage, so nothing is hidden by landing flush. */
        .ripe-page .ripe-days__anchor { scroll-margin-top: 0; }

        /* ── the site bar, over the opener ──
           Transparent with light marks while the film is on screen, then
           back to its own themed self. The custom properties are
           re-declared rather than the painted colours overridden: the bar
           draws its marks from these, and resetting one to a keyword
           would make it invalid and silently erase what it paints. */
        body.ripe-over-hero .aura-nav {
          background: transparent !important;
          box-shadow: none !important;
          --text: #fff;
          --text-body: rgba(255, 255, 255, 0.8);
          --text-muted: rgba(255, 255, 255, 0.6);
          --border: rgba(255, 255, 255, 0.16);
        }
        body.ripe-over-hero .aura-nav .invert-on-light { filter: none !important; }

        /* ── agent view ──
           globals.css already forces everything in main back to static and
           hides every img and video, which flattens this page on its own.
           What it does not know about are the wrappers that declare their
           own height, and the scrims and scatters that are empty coloured
           boxes once their pictures are gone. */
        [data-view='agent'] main .ripe-page .hero,
        [data-view='agent'] main .ripe-page .days__in,
        [data-view='agent'] main .ripe-page .beat__fig {
          height: auto !important;
          min-height: 0 !important;
        }
        /* Every scroll reveal on this page leaves the blocks it has not
           reached yet at visibility: hidden, opacity 0 and a lift — inline,
           so the global flattening does not reach them — and agent view
           has no scroll to reach them. The journeys and every day's
           programme were missing. Shown as they are, all at once. */
        [data-view='agent'] main .ripe-page * {
          visibility: visible !important;
          opacity: 1 !important;
          transform: none !important;
          translate: none !important;
          /* The full-bleed sections are 100vw wide. Agent view sets main as
             a centred text column, so at 1440 they started 408px in and ran
             408px off the right — a sideways scroll on this page alone. */
          max-width: 100% !important;
        }
        [data-view='agent'] main .ripe-page .hero__media,
        [data-view='agent'] main .ripe-page .hero__scrim,
        [data-view='agent'] main .ripe-page .days__spine,
        [data-view='agent'] main .ripe-page .close__scatter {
          display: none !important;
        }
        /* The name, revealed. The global rules put this span back in the
           flow but leave it a one-pixel clipped box. Same flip as
           h1.atelier-title in globals.css. */
        [data-view='agent'] main .ripe-page .hero__name {
          width: auto !important; height: auto !important;
          margin: 0 !important; overflow: visible !important;
          clip: auto !important; white-space: normal !important;
        }
      `}</style>
    </div>
  )
}

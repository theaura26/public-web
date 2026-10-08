'use client'

/* ── A Season of RIPE, on white ──────────────────────────────────────
   /ripe runs black from its opener to its last line. This page keeps
   the opener as it is — a film, with the name and tagline over it — and
   sets everything after it on white.

   Everything the story draws takes its colour from a handful of values
   with the dark page as their default, so the change is made here, once,
   and /ripe is untouched:

     --ripe-ink        RIPE's ground, behind the page and the fixed
                       backdrop. White here.
     --story-ink       the words: the opening line, each day's number
                       and line. Black.
     --story-muted     the captions under the pictures.
     --rings-*         the tree's rings behind the story, in ink rather
                       than paper, as faint on white as they were on black.

   The coral accent is set beside these, on the page's own wrapper.

   And no drop shadows anywhere on the page: not on the opener's mark,
   tagline or meta line (RipeHero, shared with /ripe, which keeps them),
   nor under the floating Ask Aura button.
─────────────────────────────────────────────────────────────────────── */

export function RipePaper() {
  return (
    <style jsx global>{`
      .ripe-page.ripe-page--paper {
        --ripe-ink: #fff;
        background: #fff;
        color: #000;

        --story-ink: #000;
        --story-muted: rgba(0, 0, 0, 0.62);

        --rings-ink: #000;
        --rings-opacity: 0.1;
        --rings-crack-opacity: 0.08;
      }
      /* The opener stays a dark film: its own ground is black behind the
         video until the first frame is up, not a white flash. */
      .ripe-page.ripe-page--paper .hero { background: #000; }

      .ripe-page.ripe-page--paper .hero__mark img { filter: none !important; }
      .ripe-page.ripe-page--paper .hero__tag,
      .ripe-page.ripe-page--paper .hero__tag span,
      .ripe-page.ripe-page--paper .hero__meta { text-shadow: none !important; }
      body:has(.ripe-page--paper) .aa-launch { box-shadow: none !important; }
    `}</style>
  )
}

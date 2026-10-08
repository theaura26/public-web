import type { Metadata } from 'next'
import { RipeShell } from '@/components/ripe/RipeShell'
import { RipeHero } from '@/components/ripe/RipeHero'
import { BRAND } from '@/components/ripe/copy'
import { RipeStoryIntro, RipeStatement } from '@/components/ripe-10-days/RipeStoryIntro'
import { RipeStoryDays } from '@/components/ripe-10-days/RipeStoryDays'
import { RipePaper } from '@/components/ripe-10-days/RipePaper'
import { RipeDayNav } from '@/components/ripe-10-days/RipeDayNav'
import { BANNER, CODA, CORAL, DAYS, TAGLINE } from '@/components/ripe-10-days/copy'
import { RipeBanner, ArrowLinkStyles } from '@/components/coffee/Microsite'

/* ═══════════════════════════════════════════════════════════════════
   10 Days of RIPE. A sister page to /ripe, telling the festival back
   as it happened, in eight chapters.

   Built on /ripe itself: the same shell, the same header (RipeHero,
   unchanged), the same type and colour. After the header, the opening
   line, then the days — each day's words held on white while its
   photographs float past them, then fading into the next day's.

   The story is the supplied document; see components/ripe-10-days/copy.ts.
   A day appears once it has pictures. Kept out of search and out of the
   sitemap until all ten are in.
═══════════════════════════════════════════════════════════════════ */

/* Its own description and share picture: left out, the page took /ripe's
   (the festival's dates and line-up) from app/ripe/layout.tsx. */
const DESCRIPTION =
  'A season to remember. Ten days of RIPE at Aura, Mudigere, told in eight chapters: the paths, the people and the work of a coffee estate in the Western Ghats.'
const IMAGE = { url: '/RIPE/10-days/ripe-10-days-og.jpg', width: 1200, height: 630, alt: 'A stone Buddha garlanded with pink flowers among the ferns at Aura' }

export const metadata: Metadata = {
  title: '10 Days of RIPE',
  description: DESCRIPTION,
  robots: { index: false, follow: false },
  alternates: { canonical: '/ripe/10-days' },
  /* As on /ripe: a page's openGraph replaces the root one rather than
     merging into it, so the site name and locale are restated. */
  openGraph: {
    type: 'website',
    siteName: 'Aura',
    locale: 'en_US',
    url: '/ripe/10-days',
    title: '10 Days of RIPE — Aura',
    description: DESCRIPTION,
    images: [IMAGE],
  },
  twitter: {
    card: 'summary_large_image',
    title: '10 Days of RIPE — Aura',
    description: DESCRIPTION,
    images: [IMAGE.url],
  },
}

const ACCENT = CORAL

/* A chapter appears once it has pictures. */
const STORY = DAYS.filter((d) => d.shots.length > 0)

export default function RipeTenDaysPage() {
  return (
    <RipeShell className="ripe-page--paper">
      {/* On white after the opener, where /ripe is black: the ground and
          the story's ink are set in RipePaper. */}
      <RipePaper />
      {/* This page's accent is coral, not /ripe's green. Every green on
          the page is drawn from --ripe-green, so it is redefined here for
          everything inside; /ripe keeps its own. The logotype is artwork
          with its colour in the file, so it takes a coral copy. */}
      <div style={{ ['--ripe-green' as string]: ACCENT }}>
        {/* Its own banner film; /ripe's until the grading script has made one. */}
        {/* The way back: hovering the coral mark or tagline sweeps
            /ripe's green in from the right and its tagline with it; a
            click opens /ripe. */}
        <RipeHero
          mark="/RIPE/10-days/aura-ripe-coral.svg" tagline={TAGLINE}
          link={{
            href: '/ripe',
            hover: '#23FF88',
            markHover: '/RIPE/aura-ripe.svg',
            taglineHover: BRAND.tagline,
            label: 'A season to remember — back to RIPE',
            from: 'right',
          }}
          {...(BANNER ? { film: BANNER } : {})}
        />
        {/* A small centred bar of the days, under the site bar once the
            opener is passed — /ripe's section bar, made quieter. */}
        <RipeDayNav days={STORY} />
        <RipeStoryIntro />
        {/* The closing follows the last chapter's pictures, over its
            background: centred, a size down from the opening. */}
        <RipeStoryDays days={STORY} coda={<RipeStatement runs={CODA} quiet />} />
        {/* The way back to RIPE itself: the banner the coffee pages carry,
            as it is there — the festival's own green, its tagline, and
            Discover RIPE to /ripe. */}
        <RipeBanner />
        {/* The banner's Discover link takes its look from these, as it
            does on the coffee pages. */}
        <ArrowLinkStyles />
      </div>
    </RipeShell>
  )
}

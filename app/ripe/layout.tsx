import type { Metadata } from 'next'

const TITLE = 'RIPE Festival, Mudigere'
const DESCRIPTION =
  'RIPE at Mudigere, 20–27 September 2026. A week on a working coffee estate in the Western Ghats as it turns towards harvest, in good company with Boojee and BESST.'
const IMAGE = { url: '/RIPE/aura-ripe-og.jpg', width: 1200, height: 630, alt: 'RIPE — Right time made visible. Coffee cherries ripening at Mudigere.' }

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: '/ripe' },
  keywords: ['RIPE Festival', 'Mudigere', 'coffee harvest', 'regenerative coffee', 'Western Ghats', 'Boojee', 'BESST', 'Aura'],
  /* A page's openGraph replaces the root one rather than merging into
     it, so the site name and locale are restated here. */
  openGraph: {
    type: 'website',
    siteName: 'Aura',
    locale: 'en_US',
    url: '/ripe',
    title: `${TITLE} — Aura`,
    description: DESCRIPTION,
    images: [IMAGE],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${TITLE} — Aura`,
    description: DESCRIPTION,
    images: [IMAGE.url],
  },
}

/* The festival as a schema.org Event, so search can show the dates and
   the place rather than only the page title. Same pattern as the
   Organization block in app/layout.tsx. */
const eventJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Event',
  name: 'RIPE Festival',
  description: DESCRIPTION,
  startDate: '2026-09-20',
  endDate: '2026-09-27',
  eventStatus: 'https://schema.org/EventScheduled',
  eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
  url: 'https://theaura.life/ripe',
  image: ['https://theaura.life/RIPE/aura-ripe-og.jpg'],
  location: {
    '@type': 'Place',
    name: 'Aura Estate',
    address: { '@type': 'PostalAddress', addressLocality: 'Mudigere', addressRegion: 'Karnataka', addressCountry: 'IN' },
  },
  organizer: { '@type': 'Organization', name: 'Aura', url: 'https://theaura.life' },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(eventJsonLd) }}
      />
      {children}
    </>
  )
}

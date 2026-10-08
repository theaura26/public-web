import type { Metadata } from 'next'

const TITLE = 'A Season of RIPE'
const DESCRIPTION =
  'Ten days at Mudigere, 20–27 September 2026, as they were lived: arriving, looking closer, finding a way in, making a mark, and what was left behind to grow. The record of RIPE, in pictures.'
const IMAGE = {
  url: '/RIPE/10-days/banner/ripe-banner-first.jpg',
  width: 1920,
  height: 1080,
  alt: 'A Season of RIPE — the canopy over the estate at Mudigere',
}

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: '/ripe/after' },
  keywords: ['RIPE', 'A Season of RIPE', 'Mudigere', 'Aura', 'coffee harvest', 'Western Ghats', 'Friends of Aura', 'In Good Company'],
  openGraph: {
    type: 'article',
    title: `${TITLE} — Aura`,
    description: DESCRIPTION,
    url: '/ripe/after',
    images: [IMAGE],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${TITLE} — Aura`,
    description: DESCRIPTION,
    images: [IMAGE.url],
  },
}

/* The season as a photo essay about the event, tied to the event's own
   page so search reads the two as one thing rather than two. */
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'A Season of RIPE',
  description: DESCRIPTION,
  url: 'https://theaura.life/ripe/after',
  image: ['https://theaura.life/RIPE/10-days/banner/ripe-banner-first.jpg'],
  datePublished: '2026-10-08',
  about: { '@type': 'Event', name: 'RIPE', url: 'https://theaura.life/ripe' },
  publisher: { '@type': 'Organization', name: 'Aura', url: 'https://theaura.life' },
}

export default function SeasonLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  )
}

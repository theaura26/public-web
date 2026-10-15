import type { Metadata } from 'next'
import { SEASON_SHARE_IMAGE } from '@/components/ripe/after-copy'

const TITLE = 'A Season of RIPE'
const DESCRIPTION =
  'Ten days at Mudigere, 20–27 September 2026, as they were lived: stepping into Aura, a world revealed, making a mark, finding a rhythm, and what was left behind to grow. The record of RIPE, in pictures.'
const IMAGE = {
  url: SEASON_SHARE_IMAGE,
  width: 1200,
  height: 630,
  alt: 'A Season of RIPE — the pink RIPE wordmark over the roots of an old tree at Mudigere',
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
  image: [`https://theaura.life${SEASON_SHARE_IMAGE}`],
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

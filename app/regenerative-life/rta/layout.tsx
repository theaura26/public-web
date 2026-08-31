import type { Metadata } from 'next'
import type { ReactNode } from 'react'

export const metadata: Metadata = {
  title: 'Ṛta',
  description:
    'Right time, right action. The Vedic principle behind every decision on the estate: when to spray, when to seal a tank, when to wait for the land.',
  alternates: { canonical: '/regenerative-life/rta' },
  openGraph: {
    type: 'article',
    title: 'Ṛta — Aura',
    description:
      'Intelligence is alignment with timing. The philosophy made technical.',
    images: ['/journals/rta/aura-rta.jpg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ṛta — Aura',
    description:
      'Intelligence is alignment with timing. The philosophy made technical.',
    images: ['/journals/rta/aura-rta.jpg'],
  },
}

export default function RtaLayout({ children }: { children: ReactNode }) {
  return children
}

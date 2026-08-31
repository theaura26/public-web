import type { Metadata } from 'next'
import type { ReactNode } from 'react'

export const metadata: Metadata = {
  title: 'The Land Decides the Hour',
  description:
    'Waiting for the window rather than the calendar — right time, right action, and the buffer days a plan carries because of it.',
  alternates: { canonical: '/rta' },
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

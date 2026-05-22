import type { Metadata } from 'next'
import type { ReactNode } from 'react'

export const metadata: Metadata = {
  title: 'Monastic Polymaths',
  description:
    'An artist residency for natural intelligence. Embedded, invitation-based — across Mudigere (Vedic) and Ohara (Zen). Write to residency@theaura.life.',
  alternates: { canonical: '/residency' },
  openGraph: {
    type: 'article',
    title: 'Monastic Polymaths — Aura',
    description:
      'The friction between disciplines is the point. That is where the work no one else can make gets made.',
    images: ['/journals/residency/aura-monastic-polymath.jpg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Monastic Polymaths — Aura',
    description:
      'The friction between disciplines is the point. That is where the work no one else can make gets made.',
    images: ['/journals/residency/aura-monastic-polymath.jpg'],
  },
}

export default function ResidencyLayout({ children }: { children: ReactNode }) {
  return children
}

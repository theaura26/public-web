import type { Metadata } from 'next'
import type { ReactNode } from 'react'

export const metadata: Metadata = {
  title: 'Spaces & Studios — Aura',
  description:
    'Place, not programme. Asa, Niwa, Ki no Ie, Kaze no Ma in Ohara. The Twelve Worlds in Mudigere. Studios, wellbeing, craft partners, Shu–Ha–Ri.',
  openGraph: {
    title: 'Spaces & Studios — Aura',
    description:
      'Four spaces in Ohara. Twelve cabins in Mudigere. Studios for makers. Rhythm, not routine.',
    type: 'article',
  },
}

export default function SpacesLayout({ children }: { children: ReactNode }) {
  return children
}

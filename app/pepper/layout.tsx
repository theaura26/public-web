import type { Metadata } from 'next'
import type { ReactNode } from 'react'

export const metadata: Metadata = {
  title: 'Pepper — Malabar Black Gold — Aura',
  description:
    'Single-estate Malabar black pepper climbing the areca. Black, white, and green — water-retted and experimentally anaerobic. Grown in the Western Ghats biosphere.',
  openGraph: {
    title: 'Pepper — Malabar Black Gold',
    description:
      'Three processing styles, one appellation. The vine remembers every year.',
    type: 'article',
  },
}

export default function PepperLayout({ children }: { children: ReactNode }) {
  return children
}

import type { Metadata } from 'next'
import type { ReactNode } from 'react'

export const metadata: Metadata = {
  title: 'Regenerative Plantation — Aura',
  description:
    'One hundred acres of specialty coffee grown under native canopy in the Western Ghats. Biodynamic, Vedic, and experimental fermentation — regeneration as the standard, not the claim.',
  openGraph: {
    title: 'Regenerative Plantation — Aura',
    description:
      'Coffee, pepper, and areca grown as one organism. Biodynamic practice, Vedic lineage, and wine-technique fermentation on 150 acres in Mudigere, Karnataka.',
    type: 'article',
  },
}

export default function PlantationLayout({ children }: { children: ReactNode }) {
  return children
}

import type { Metadata } from 'next'
import type { ReactNode } from 'react'

export const metadata: Metadata = {
  title: 'Fermentation — Three Disciplines, One Precision — Aura',
  description:
    'Coffee, pepper, cow dung. Six specialty coffee lots. Lot 005 Solera carry-forward. Water-retted and anaerobic pepper. BD 500 horn burial. Bridged to Ohara, where an 800-year fermentation lineage lives in the valley.',
  openGraph: {
    title: 'Fermentation — Three disciplines, one precision.',
    description:
      'Controlled microbial work across coffee, pepper, and cow dung. Time, temperature, pH as instruments.',
    type: 'article',
  },
}

export default function FermentationLayout({ children }: { children: ReactNode }) {
  return children
}

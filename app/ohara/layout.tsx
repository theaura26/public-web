import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Ohara — Asa · Niwa — Aura',
  description:
    'Aura Ohara — a valley north of Kyoto. Asa, the morning of light and renewal. Niwa, the garden of calm and reflection. A restored teahouse, a 30-year garden, a rich and mindful life.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}

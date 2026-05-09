import type { Metadata } from 'next'
import type { ReactNode } from 'react'

export const metadata: Metadata = {
  title: 'Labs & Hardware — Aura',
  description:
    'Earth up. Not top down. Native world models grown from sensor data and ancestral practice. Compute, Workbench, Canvas — the Aura product OS.',
  openGraph: {
    title: 'Labs & Hardware — Aura',
    description:
      'Blockchain, live sensors, persistent AI memory. Five verticals: agriculture, food, hospitality, insurance, financial services.',
    type: 'article',
  },
}

export default function LabsLayout({ children }: { children: ReactNode }) {
  return children
}

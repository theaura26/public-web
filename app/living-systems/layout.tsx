import type { Metadata } from 'next'
import type { ReactNode } from 'react'

export const metadata: Metadata = {
  title: 'Living Systems — Aura',
  description:
    'The herd, the hive, the canopy. Malnad Gidda cattle, native bees, working flocks, and a five-layer forest architecture — the biodynamic engine of a regenerative farm.',
  openGraph: {
    title: 'Living Systems — Aura',
    description:
      'Forty-three indigenous cattle, native apiaries, working chickens, five canopy layers. The organism that makes the farm a farm.',
    type: 'article',
  },
}

export default function LivingSystemsLayout({ children }: { children: ReactNode }) {
  return children
}

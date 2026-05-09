import type { Metadata } from 'next'
import type { ReactNode } from 'react'

export const metadata: Metadata = {
  title: 'Biodynamic Practice — The Farm as Organism — Aura',
  description:
    'BD 500 to 508 and the Cow Pat Pit, made on site. Horn-manure stirred at dusk and sprayed before dew. 43 Malnad Gidda cattle at the heart of the closed loop. Steiner discipline under the Western Ghats canopy.',
  openGraph: {
    title: 'Biodynamic Practice — The Farm as Organism',
    description:
      'Nine preparations, one lunar calendar, one indigenous herd. How Aura practises biodynamics in Mudigere.',
    type: 'article',
  },
}

export default function BiodynamicLayout({ children }: { children: ReactNode }) {
  return children
}

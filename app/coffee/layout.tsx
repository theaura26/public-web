import type { Metadata } from 'next'
import type { ReactNode } from 'react'

export const metadata: Metadata = {
  title: 'Coffee — Six Lots, One Appellation — Aura',
  description:
    'One hundred acres of specialty Arabica at 3,600 ft under native shade. Sln.9 and Sln.795, six wine-technique lots — Anaerobic, Appassimento, Red Honey, Banana Wash, Solera Maceration, Solera Wash. Coffee Board certified, Boojee exclusive.',
  openGraph: {
    title: 'Coffee — Six Lots, One Appellation',
    description:
      'Mudigere specialty coffee. 83.5 cupping score on the Appassimento flagship. Where precision meets patience.',
    type: 'article',
  },
}

export default function CoffeeLayout({ children }: { children: ReactNode }) {
  return children
}

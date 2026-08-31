import type { Metadata } from 'next'
import type { ReactNode } from 'react'

export const metadata: Metadata = {
  title: 'Aura Live',
  description:
    'What is happening on the land at Mudigere, taken from the estate record. Every entry carries its date, its place and its evidence.',
  alternates: { canonical: '/now' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Aura Live',
    description: 'What is happening on the land at Mudigere, taken from the estate record.',
    url: '/now',
  },
}

export default function LiveLayout({ children }: { children: ReactNode }) {
  return <>{children}</>
}

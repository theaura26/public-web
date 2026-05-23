import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Our Brand',
  description: 'Four intelligences — Natural, Ancient, Human, and Machine — converge to create a regenerative future.',
  alternates: { canonical: '/brand' },
  openGraph: {
    type: 'article',
    title: 'Our Brand — Aura',
    description: 'Rhythm over speed, depth and width. Four intelligences — Natural, Ancient, Human, Machine — shape the Aura brand.',
    images: [{ url: '/aura-depth.jpg', width: 1600, height: 900, alt: 'Aura brand — rhythm, depth and breadth of practice' }],
  },
  twitter: { card: 'summary_large_image', images: ['/aura-depth.jpg'] },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}

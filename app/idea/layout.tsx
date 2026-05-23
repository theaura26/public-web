import type { Metadata } from 'next'
import { comingSoonMetadata, guardComingSoon } from '@/lib/coming-soon'

export const metadata: Metadata = {
  title: 'The 1000 Year Idea',
  description:
    'A standard, not a timeline. Seven decision filters and a commitment frame by which every choice at Aura is measured.',
  alternates: { canonical: '/idea' },
  openGraph: {
    type: 'article',
    title: 'The 1000 Year Idea — Aura',
    description: 'A standard, not a timeline. Seven decision filters by which Aura measures every choice.',
    images: [{ url: '/aura-idea.jpg', width: 1600, height: 900, alt: 'Aura — the 1000-year idea, generational regenerative practice' }],
  },
  twitter: { card: 'summary_large_image', images: ['/aura-idea.jpg'] },
  ...comingSoonMetadata,
}

export default function Layout({ children }: { children: React.ReactNode }) {
  guardComingSoon()
  return children
}

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'The 1000 Year Idea',
  description:
    'A thousand years is the standard every choice at Aura is measured against. Seven decision filters and a commitment frame.',
  alternates: { canonical: '/idea' },
  openGraph: {
    type: 'article',
    title: 'The 1000 Year Idea — Aura',
    description: 'A thousand years is the standard. Seven decision filters by which Aura measures every choice.',
    images: [{ url: '/aura-idea.jpg', width: 1600, height: 900, alt: 'Aura — the 1000-year idea, generational regenerative practice' }],
  },
  twitter: { card: 'summary_large_image', images: ['/aura-idea.jpg'] },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}

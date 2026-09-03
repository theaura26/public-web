import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Bug Hotels',
  description: 'A plantation can be full of plants and short of homes. Drilled logs, no insects introduced, and a way to see who turns up.',
  alternates: { canonical: '/bug-hotels' },
  openGraph: {
    type: 'article',
    title: 'Bug Hotels — Aura',
    description: 'A plantation can be full of plants and short of homes. Drilled logs, no insects introduced, and a way to see who turns up.',
    images: [{ url: '/aura-placeholder.svg', width: 1600, height: 900, alt: 'Bug Hotels — Aura' }],
  },
  twitter: { card: 'summary_large_image', images: ['/aura-placeholder.svg'] },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}

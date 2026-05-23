import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'The Reason',
  description: 'The story behind Aura — why we chose the regenerative path, thinking in generations instead of quarters.',
  alternates: { canonical: '/reason' },
  openGraph: {
    type: 'article',
    title: 'The Reason — Aura',
    description: 'The story behind Aura. Why we chose the regenerative path, thinking in generations instead of quarters.',
    images: [{ url: '/aura-arvind.jpg', width: 1600, height: 900, alt: 'Arvind on the Mudigere plantation — the founder behind Aura' }],
  },
  twitter: { card: 'summary_large_image', images: ['/aura-arvind.jpg'] },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}

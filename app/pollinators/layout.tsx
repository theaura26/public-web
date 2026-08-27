import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Pollinators',
  description: 'Six invasive plants are taking the flowering understorey. What is being done about it, and what has not been counted.',
  alternates: { canonical: '/pollinators' },
  openGraph: {
    type: 'article',
    title: 'Pollinators — Aura',
    description: 'Six invasive plants are taking the flowering understorey. What is being done about it, and what has not been counted.',
    images: [{ url: '/aura-placeholder.svg', width: 1600, height: 900, alt: 'Pollinators — Aura' }],
  },
  twitter: { card: 'summary_large_image', images: ['/aura-placeholder.svg'] },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}

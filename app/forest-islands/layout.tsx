import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Forest Islands',
  description: 'Small ecological nuclei built inside a working plantation — four metres of dung and green cuttings, then left alone.',
  alternates: { canonical: '/forest-islands' },
  openGraph: {
    type: 'article',
    title: 'Forest Islands — Aura',
    description: 'Small ecological nuclei built inside a working plantation — four metres of dung and green cuttings, then left alone.',
    images: [{ url: '/aura-placeholder.svg', width: 1600, height: 900, alt: 'Forest Islands — Aura' }],
  },
  twitter: { card: 'summary_large_image', images: ['/aura-placeholder.svg'] },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Land, Spirit, Soul',
  description: 'The lamp at the Gau Angan is lit with ghee from the herd it is lit for. The closed loop, said in one gesture.',
  alternates: { canonical: '/land-spirit-soul' },
  openGraph: {
    type: 'article',
    title: 'Land, Spirit, Soul — Aura',
    description: 'The lamp at the Gau Angan is lit with ghee from the herd it is lit for. The closed loop, said in one gesture.',
    images: [{ url: '/aura-placeholder.svg', width: 1600, height: 900, alt: 'Land, Spirit, Soul — Aura' }],
  },
  twitter: { card: 'summary_large_image', images: ['/aura-placeholder.svg'] },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}

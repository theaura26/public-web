import type { Metadata } from 'next'
import type { ReactNode } from 'react'

/* Page title is "Moral Spine"; route slug is /wisdom for legacy reasons.
   Metadata follows the page, not the slug. */
export const metadata: Metadata = {
  title: 'Moral Spine',
  description:
    'The things we will not do. Attention as a moral choice and restraint as intelligence: the fourfold self-check, seven decision filters, six refusals.',
  alternates: { canonical: '/wisdom' },
  openGraph: {
    type: 'article',
    title: 'Moral Spine — Aura',
    description:
      'Every organisation has values on a wall. Aura has a spine.',
    images: ['/journals/wisdom/aura-moral-spine.jpg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Moral Spine — Aura',
    description:
      'Every organisation has values on a wall. Aura has a spine.',
    images: ['/journals/wisdom/aura-moral-spine.jpg'],
  },
}

export default function WisdomLayout({ children }: { children: ReactNode }) {
  return children
}

import type { Metadata } from 'next'
import { guardComingSoon } from '@/lib/coming-soon'

/* Written, and not released. The menu carries it as coming-soon and the
   field-note index lists it under "soon", but it was the one page in that
   state still saying index, follow — while every page on the site links
   it from the menu markup. Its crawl status matches its stated status now.
   Drop this block when it goes out. */
export const metadata: Metadata = {
  robots: { index: false, follow: true, googleBot: { index: false, follow: true } },
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
  /* Unpublished. 404s in every deployed environment — production and
     Vercel preview — while staying reachable under `next dev`, so the page
     can keep being worked on. Delete this call to publish it. */
  guardComingSoon()

  return children
}

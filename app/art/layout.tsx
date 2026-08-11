import type { Metadata } from 'next'
import type { ReactNode } from 'react'

/* /art is an internal shader sandbox, not a public marketing page. Without
   its own metadata it inherited the root layout's `alternates.canonical: '/'`
   — declaring the homepage as this route's canonical — and the default
   title. Give it its own canonical and keep it out of the index. */
export const metadata: Metadata = {
  title: 'Art',
  alternates: { canonical: 'https://theaura.life/art' },
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
}

export default function ArtLayout({ children }: { children: ReactNode }) {
  return children
}

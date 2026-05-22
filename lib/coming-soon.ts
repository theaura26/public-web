import { notFound } from 'next/navigation'

/* Coming-soon page gate.
   Call from a layout.tsx (server component) at the top of the
   exported layout function. Pages stay reachable under `next dev`
   (NODE_ENV === 'development') so the team can keep authoring them
   against the live design system, but every deployed environment —
   Vercel preview AND production — returns 404.

   Pair with `comingSoonMetadata` below to also tell crawlers to skip
   these URLs if a search engine has cached them. */
export function guardComingSoon() {
  if (process.env.NODE_ENV === 'production') notFound()
}

/* Shared robots fragment for coming-soon page metadata. Spread into
   each layout's `metadata` export:

     export const metadata: Metadata = {
       title: '…',
       description: '…',
       ...comingSoonMetadata,
     }
*/
export const comingSoonMetadata = {
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
    },
  },
}

import { permanentRedirect } from 'next/navigation'
import { comingSoonMetadata } from '@/lib/coming-soon'

/* The Aura Festival page, retired in favour of RIPE and kept in the
   codebase rather than deleted. It still renders under `next dev` for
   reference; every built deployment answers with a permanent (308)
   redirect to /ripe, so old links and anything search has indexed land
   on the festival that replaced it. noindex in case a crawler reaches it
   by another way. It is out of the sitemap, the nav and Field Notes. */
export const metadata = { ...comingSoonMetadata }

export default function Layout({ children }: { children: React.ReactNode }) {
  if (process.env.NODE_ENV === 'production') permanentRedirect('/ripe')
  return children
}

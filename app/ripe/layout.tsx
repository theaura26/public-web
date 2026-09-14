import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { comingSoonMetadata } from '@/lib/coming-soon'

export const metadata: Metadata = {
  title: 'RIPE — Right time made visible',
  description:
    'RIPE at Mudigere. Five days on a working coffee estate in the Western Ghats, timed to the harvest. Aura × Boojee × Besst.',
  alternates: { canonical: '/ripe' },
  ...comingSoonMetadata,
}

export default function Layout({ children }: { children: React.ReactNode }) {
  /* Visible for review, not yet published. RIPE renders under `next dev`
     and on every Vercel deployment that is not production — the staging
     branch at staging.theaura.life and PR previews — and 404s on
     theaura.life itself. VERCEL_ENV is set by the platform ('production',
     'preview', 'development') and cannot be set by a visitor. The shared
     guardComingSoon() keys on NODE_ENV, which is 'production' in every
     deployed build, so it would hide the page from staging as well.

     Still noindex (comingSoonMetadata), and still absent from
     app/sitemap.ts. Deleting this check is what publishes the page. */
  if (process.env.VERCEL_ENV === 'production') notFound()

  return children
}

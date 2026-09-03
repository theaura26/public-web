import type { Metadata } from 'next'
import type { ReactNode } from 'react'

export const metadata: Metadata = {
  title: 'Privacy',
  description:
    'What this site collects, what leaves it, and what Aura keeps. Written to be read rather than agreed to.',
  alternates: { canonical: '/privacy' },
  robots: { index: true, follow: true },
}

export default function PrivacyLayout({ children }: { children: ReactNode }) {
  return <>{children}</>
}

import type { Metadata } from 'next'
import { comingSoonMetadata, guardComingSoon } from '@/lib/coming-soon'

export const metadata: Metadata = {
  title: 'The 1000 Year Idea',
  description:
    'A standard, not a timeline. Seven decision filters and a commitment frame by which every choice at Aura is measured.',
  ...comingSoonMetadata,
}

export default function Layout({ children }: { children: React.ReactNode }) {
  guardComingSoon()
  return children
}

import { Metadata } from 'next'
import { comingSoonMetadata, guardComingSoon } from '@/lib/coming-soon'

export const metadata: Metadata = {
  title: 'Provenance',
  description: 'Cherry to cup, on chain. Aura replaces legacy certification with live, sensor-fed, blockchain-verified provenance from the Mudigere estate.',
  ...comingSoonMetadata,
}

export default function Layout({ children }: { children: React.ReactNode }) {
  guardComingSoon()
  return children
}

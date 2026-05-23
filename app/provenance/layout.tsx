import { Metadata } from 'next'
import { comingSoonMetadata, guardComingSoon } from '@/lib/coming-soon'

export const metadata: Metadata = {
  title: 'Provenance',
  description: 'Cherry to cup, on chain. Aura replaces legacy certification with live, sensor-fed, blockchain-verified provenance from the Mudigere estate.',
  alternates: { canonical: '/provenance' },
  openGraph: {
    type: 'article',
    title: 'Provenance — Aura',
    description: 'Cherry to cup, on chain. Live sensor data and blockchain-verified provenance.',
    images: [{ url: '/aura-provenance.jpg', width: 1600, height: 900, alt: 'Aura Provenance — cherry-to-cup verification from the Mudigere estate' }],
  },
  twitter: { card: 'summary_large_image', images: ['/aura-provenance.jpg'] },
  ...comingSoonMetadata,
}

export default function Layout({ children }: { children: React.ReactNode }) {
  guardComingSoon()
  return children
}

import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Provenance',
  description: 'Cherry to cup, written down. Aura replaces legacy certification with a live, sensor-fed, signed record. Blockchain-verified provenance from the Mudigere estate.',
  alternates: { canonical: '/provenance' },
  openGraph: {
    type: 'article',
    title: 'Provenance — Aura',
    description: 'Cherry to cup, written down. Live sensor data and a signed record in plain formats.',
    images: [{ url: '/aura-provenance.jpg', width: 1600, height: 900, alt: 'Aura Provenance — cherry-to-cup verification from the Mudigere estate' }],
  },
  twitter: { card: 'summary_large_image', images: ['/aura-provenance.jpg'] },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}

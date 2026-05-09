import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Provenance',
  description: 'Cherry to cup, on chain. Aura replaces legacy certification with live, sensor-fed, blockchain-verified provenance from the Mudigere estate.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}

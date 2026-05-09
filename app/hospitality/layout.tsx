import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Hospitality — Aura',
  description:
    'Luxury spaces for retreat and reconnection — architect-led sanctuaries, slow living experiences, workshops, and residencies designed around nature and clarity.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}

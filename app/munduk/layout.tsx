import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Munduk — Aura',
  description:
    'Munduk — the third Aura sanctuary, in the volcanic highlands of north Bali. In planning. A valley being read, not yet built.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sanctuary — Aura',
  description:
    'Aura Sanctuary — the land in rhythm. A 1000-year regenerative ecosystem across Mudigere, Ohara, and coming valleys in Munduk and Daylesford.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}

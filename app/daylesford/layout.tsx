import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Daylesford — Aura',
  description:
    'Daylesford — a future expression of Aura in Victoria, Australia. The southern counterweight. Still forming.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}

import type { Metadata } from 'next'
import type { ReactNode } from 'react'

export const metadata: Metadata = {
  title: 'Journal — Aura',
  description:
    'Every day, verified. A live, blockchain-signed field feed from Mudigere, Ohara, and Munduk. Field reports, fermentation logs, garden notes, weather.',
  openGraph: {
    title: 'Journal — Aura',
    description:
      'The log is the truth. A blockchain-signed daily field feed across three properties.',
    type: 'article',
  },
}

export default function JournalLayout({ children }: { children: ReactNode }) {
  return children
}

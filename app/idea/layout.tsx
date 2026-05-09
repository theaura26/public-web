import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'The 1000 Year Idea',
  description:
    'A standard, not a timeline. Seven decision filters and a commitment frame by which every choice at Aura is measured.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}

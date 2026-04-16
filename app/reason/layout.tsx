import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'The Reason',
  description: 'The story behind Aura — why we chose the regenerative path, thinking in generations instead of quarters.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}

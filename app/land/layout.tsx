import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'The Land',
  description: 'Aura Estate in Mudigere, Karnataka — where forest and energy merge across 280 acres of biodiverse land.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}

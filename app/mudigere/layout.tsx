import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Mudigere — Bhoomi · Aaranya — Aura',
  description:
    'Aura Mudigere — 150 acres of biodynamic plantation and native forest in the Western Ghats of Karnataka. Bhoomi, the body of patience. Aaranya, the soul of renewal.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'RTA — Right Time, Right Action',
  description:
    'The Sanskrit principle of natural order. Timing as a material. Alignment over force, across farm, kitchen, and studio.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}

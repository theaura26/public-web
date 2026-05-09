import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Ancient Wisdom',
  description:
    'The oldest dataset. Three intelligences — natural, human, artificial — and the hundred human capacities we have quietly lost.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}

import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Our Brand',
  description: 'Four intelligences — Natural, Ancient, Human, and Machine — converge to create a regenerative future.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}

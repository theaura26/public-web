import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch with Aura. Inquiries about our regenerative coffee, partnerships, and estate visits.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}

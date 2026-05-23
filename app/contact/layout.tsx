import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch with Aura. Inquiries about our regenerative coffee, partnerships, and estate visits.',
  alternates: { canonical: '/contact' },
  openGraph: {
    type: 'website',
    title: 'Contact — Aura',
    description: 'Get in touch with Aura. Inquiries about regenerative coffee, partnerships, and estate visits.',
    images: [{ url: '/aura-contact.jpg', width: 1600, height: 900, alt: 'Aura — people behind the sanctuary' }],
  },
  twitter: { card: 'summary_large_image', images: ['/aura-contact.jpg'] },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}

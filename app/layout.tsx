import type { Metadata } from 'next'
import { Instrument_Serif, DM_Sans, DM_Mono } from 'next/font/google'
import './globals.css'
import ClientLayout from './client-layout'

const instrumentSerif = Instrument_Serif({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

const dmMono = DM_Mono({
  weight: ['300', '400', '500'],
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://theaura.life'),
  title: {
    template: '%s | Aura',
    default: 'Aura.Life — The 1000-Year Idea',
  },
  description: 'A regenerative platform for generational impact.',
  openGraph: {
    title: 'Aura.Life — The 1000-Year Idea',
    description: 'A regenerative platform for generational impact.',
    siteName: 'Aura',
    type: 'website',
    url: 'https://theaura.life',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Aura.Life — The 1000-Year Idea',
    description: 'A regenerative platform for generational impact.',
  },
  robots: {
    index: true,
    follow: true,
  },
  keywords: ['regenerative agriculture', 'specialty coffee', 'monastic polymath', 'Aura', 'ancestral intelligence', 'Mudigere', 'India'],
  other: {
    'geo.region': 'IN-KA',
    'geo.placename': 'Mudigere',
    'geo.position': '13.1167;75.6333',
    'ICBM': '13.1167, 75.6333',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${instrumentSerif.variable} ${dmSans.variable} ${dmMono.variable}`}>
      <body>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  )
}

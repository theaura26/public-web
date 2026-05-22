import type { Metadata } from 'next'
import { Bricolage_Grotesque, Instrument_Serif, DM_Sans, DM_Mono, Pixelify_Sans } from 'next/font/google'
import './globals.css'
import ClientLayout from './client-layout'

const bricolage = Bricolage_Grotesque({
  subsets: ['latin'],
  variable: '--font-grotesque',
  display: 'swap',
})

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

/* Reserved for the "Machine" word in the Brand page intelligence cycle. */
const pixelifySans = Pixelify_Sans({
  subsets: ['latin'],
  variable: '--font-pixel',
  display: 'swap',
})

/* metadataBase makes every page's relative OG/Twitter image URL resolve to
   the canonical production origin. Without it Next logs warnings AND
   generates broken OG image URLs in preview deploys. */
export const metadata: Metadata = {
  metadataBase: new URL('https://theaura.life'),
  title: {
    default: 'Aura — The 1000-Year Idea',
    template: '%s — Aura',
  },
  description:
    'A regenerative ecosystem for monastic polymaths where ancestral intelligence meets creative capital. 150 acres in the Western Ghats; an East-East axis to Ohara, Kyoto.',
  applicationName: 'Aura',
  authors: [{ name: 'Aura', url: 'https://theaura.life' }],
  keywords: [
    'Aura',
    'regenerative agriculture',
    'biodynamic',
    'Western Ghats',
    'Mudigere',
    'Ohara',
    'specialty coffee',
    'artist residency',
    'natural intelligence',
  ],
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'Aura',
    title: 'Aura — The 1000-Year Idea',
    description:
      'A regenerative ecosystem for monastic polymaths where ancestral intelligence meets creative capital.',
    images: ['/og-hello.jpg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Aura — The 1000-Year Idea',
    description:
      'A regenerative ecosystem for monastic polymaths where ancestral intelligence meets creative capital.',
    images: ['/og-hello.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
  formatDetection: { telephone: false },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${bricolage.variable} ${instrumentSerif.variable} ${dmSans.variable} ${dmMono.variable} ${pixelifySans.variable}`}>
      <body>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  )
}

import type { Metadata } from 'next'
import { Bricolage_Grotesque, Instrument_Serif, DM_Mono, Pixelify_Sans, Mynerve } from 'next/font/google'
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

/* Handwritten narration voice — used by /the-reason. */
const mynerve = Mynerve({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-hand',
  display: 'swap',
})

/* metadataBase makes every page's relative OG/Twitter image URL resolve to
   the canonical production origin. Without it Next logs warnings AND
   generates broken OG image URLs in preview deploys. */
export const metadata: Metadata = {
  metadataBase: new URL('https://theaura.life'),
  title: {
    default: 'Aura — Natural Intelligence Company.',
    template: '%s — Aura',
  },
  description:
    'We are a team of Monastic Polymaths who combine ancestral wisdom with creative capital to make what the future cannot automate.',
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
    title: 'Aura — Natural Intelligence Company.',
    description:
      'We are a team of Monastic Polymaths who combine ancestral wisdom with creative capital to make what the future cannot automate.',
    images: ['/og-hello.jpg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Aura — Natural Intelligence Company.',
    description:
      'We are a team of Monastic Polymaths who combine ancestral wisdom with creative capital to make what the future cannot automate.',
    images: ['/og-hello.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
  formatDetection: { telephone: false },
}

/* Organization + WebSite structured data — one JSON-LD graph on every page.
   Gives search + AI crawlers a stable entity for Aura (name, logo, socials)
   and the site itself, improving knowledge-panel / rich-result eligibility. */
const orgJsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': 'https://theaura.life/#organization',
      name: 'Aura',
      url: 'https://theaura.life',
      logo: 'https://theaura.life/icon.png',
      description:
        'We are a team of Monastic Polymaths who combine ancestral wisdom with creative capital to make what the future cannot automate.',
      sameAs: ['https://www.instagram.com/theaura.life/'],
    },
    {
      '@type': 'WebSite',
      '@id': 'https://theaura.life/#website',
      name: 'Aura',
      url: 'https://theaura.life',
      publisher: { '@id': 'https://theaura.life/#organization' },
    },
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${bricolage.variable} ${instrumentSerif.variable} ${dmMono.variable} ${pixelifySans.variable} ${mynerve.variable}`}>
      <head>
        {/* Two lines, before first paint, and both are about the page
            being readable rather than pretty.

            `js` gates the reveal-on-scroll styling. .reveal starts at
            opacity 0, so without this every page is blank until React
            hydrates — and permanently blank if scripts fail or are
            blocked. Gated, a no-JS reader gets the whole page
            immediately, unanimated.

            The timer covers the other failure: scripts load but
            hydration never finishes, so nothing is ever revealed. It
            fires only if, after two and a half seconds, not one reveal
            has been shown — which on a working page is impossible,
            since anything in view is shown within about thirty
            milliseconds of mount. So a healthy page keeps its
            scroll animation untouched, and a broken one shows its
            content unanimated rather than staying blank. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "document.documentElement.classList.add('js');" +
              "setTimeout(function(){" +
              "var all=document.querySelectorAll('.reveal');if(!all.length)return;" +
              "if(document.querySelector('.reveal.visible'))return;" +
              "for(var i=0;i<all.length;i++)all[i].classList.add('visible')},2500)",
          }}
        />
      </head>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  )
}

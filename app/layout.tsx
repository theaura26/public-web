import type { Metadata } from 'next'
import { Bricolage_Grotesque, Instrument_Serif, DM_Sans, DM_Mono } from 'next/font/google'
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

export const metadata: Metadata = {
  title: 'Aura — The 1000-Year Idea',
  description: 'A regenerative ecosystem for monastic polymaths where ancestral intelligence meets creative capital.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${bricolage.variable} ${instrumentSerif.variable} ${dmSans.variable} ${dmMono.variable}`}>
      <body>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  )
}

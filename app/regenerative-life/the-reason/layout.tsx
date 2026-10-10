import { Metadata } from 'next'

export const metadata: Metadata = {
  /* A default plus a template, not a bare string: a bare title here
     leaves /reason/[slug] resolving to 'Agroculture — The Reason' with
     no brand on the end, while every other section keeps it. */
  title: { default: 'The Reason', template: '%s — Aura' },
  description: 'What kind of world are they inheriting? Aura began with that question — a working coffee and tea estate in the Western Ghats and a sanctuary in Kyoto, built to be carried on.',
  alternates: { canonical: '/regenerative-life/the-reason' },
  openGraph: {
    type: 'article',
    title: 'Why Aura? — The Reason — Aura',
    description: 'What kind of world are they inheriting? Aura began with that question.',
    images: [{ url: '/the-reason/why-aura/aura-reason-og.jpg', width: 1200, height: 630, alt: 'A father and son on a ridge above the Western Ghats, looking out over the valley' }],
  },
  twitter: { card: 'summary_large_image', images: ['/the-reason/why-aura/aura-reason-og.jpg'] },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}

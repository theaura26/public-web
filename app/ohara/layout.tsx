import type { Metadata } from 'next'
import type { ReactNode } from 'react'

/* Public sanctuary page, sibling to /mudigere — but indexed. Where
   /mudigere is a noindex private architect briefing, /ohara is the
   flagship public story: reached from the homepage sanctuary panel
   and meant to be found. */
export const metadata: Metadata = {
  title: 'Ohara',
  description:
    'A sanctuary for the senses, where nature teaches us how to live. A seventy-year-old home and a thirty-year garden, restored rather than rebuilt.',
  alternates: { canonical: 'https://theaura.life/ohara' },
  openGraph: {
    type: 'article',
    title: 'Ohara — Aura',
    description:
      'A sanctuary for the senses, where nature teaches us how to live. Ohara, north of Kyoto.',
    images: ['/aura-ohara.jpg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ohara — Aura',
    description:
      'A sanctuary for the senses, where nature teaches us how to live. Ohara, north of Kyoto.',
    images: ['/aura-ohara.jpg'],
  },
}

export default function OharaLayout({ children }: { children: ReactNode }) {
  return children
}

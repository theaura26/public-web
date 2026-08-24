import type { Metadata } from 'next'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
  title: 'The Experience — Regenerative Coffee',
  description:
    'Three windows a year at Sampigekhan Estate, Mudigere — September, November or December. Small groups, by arrangement.',
  alternates: { canonical: '/regenerative-coffee/experience' },
}

/**
 * The clean marketing URL. theaura.life/regenerative-coffee/experience
 * lands on the hub with the form already open — one link for a
 * campaign, an email footer, or a printed card.
 */
export default function ExperiencePage() {
  redirect('/regenerative-coffee?experience')
}

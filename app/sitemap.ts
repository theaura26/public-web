import type { MetadataRoute } from 'next'
import { ACTIVE_JOURNALS } from '@/lib/journals'

/* Sitemap is derived from the same source of truth that drives the
   slide-out menu and Continue cards — lib/journals.ts. Adding a new
   journal to ACTIVE_JOURNALS automatically registers it for search
   engines and the AI crawlers we care about. */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://theaura.life'
  const now = new Date()
  const journals = ACTIVE_JOURNALS.map(j => ({
    url: `${base}${j.href}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))
  return [
    {
      url: `${base}/`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    ...journals,
  ]
}

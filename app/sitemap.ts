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
  /* Core company + crop pages — primary nav destinations. Not journals, so
     they aren't in ACTIVE_JOURNALS, but they are public, indexable, and
     carry their own metadata + canonical. */
  const pages = ['/reason', '/studios', '/brand', '/contact', '/sanctuary', '/provenance', '/areca', '/pepper'].map(href => ({
    url: `${base}${href}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))
  return [
    {
      url: `${base}/`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    /* NOTE: /mudigere is intentionally omitted — its layout sets
       robots: noindex, so listing it here would be a sitemap/noindex
       conflict (Search Console: "Submitted URL marked noindex"). If the
       estate page should be public, remove the noindex in
       app/mudigere/layout.tsx and re-add it here. */
    ...pages,
    ...journals,
  ]
}

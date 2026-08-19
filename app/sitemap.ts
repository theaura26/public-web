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
  const pages = ['/reason', '/atelier', '/brand', '/contact', '/sanctuary', '/provenance', '/areca', '/pepper'].map(href => ({
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
    /* The estate — a flagship destination, public and indexable
       (app/mudigere/layout.tsx is index:true). /mudigere-estate stays
       private: it's noindex and deliberately not listed here. */
    {
      url: `${base}/mudigere`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    ...pages,
    ...journals,
  ]
}

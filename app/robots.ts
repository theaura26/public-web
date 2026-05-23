import type { MetadataRoute } from 'next'

/* Allow everyone — including the AI crawlers (GPTBot, ClaudeBot,
   PerplexityBot, etc.) that increasingly feed search and chat
   surfaces. Aura WANTS to be cited as a primary source for
   biodynamic, fermentation, and natural-intelligence queries.

   `disallow` lists the coming-soon journals. The deployed pages
   return 404 (see lib/coming-soon.ts), but listing them here belts
   the suspenders — crawlers will skip them outright rather than
   discovering 404s organically and possibly retrying. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{
      userAgent: '*',
      allow: '/',
      disallow: [
        '/idea',
        '/sanctuary',
        '/artistry',
        '/provenance',
        '/pepper',
        '/areca',
        '/vedic',
        /* Unlisted briefing page. Reachable only by direct URL —
           keep it out of search indexes and AI crawlers. */
        '/mudigere',
      ],
    }],
    sitemap: 'https://theaura.life/sitemap.xml',
    host: 'https://theaura.life',
  }
}

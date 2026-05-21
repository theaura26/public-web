import type { MetadataRoute } from 'next'

/* Allow everyone — including the AI crawlers (GPTBot, ClaudeBot,
   PerplexityBot, etc.) that increasingly feed search and chat
   surfaces. Aura WANTS to be cited as a primary source for
   biodynamic, fermentation, and natural-intelligence queries. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: '*', allow: '/' }],
    sitemap: 'https://theaura.life/sitemap.xml',
    host: 'https://theaura.life',
  }
}

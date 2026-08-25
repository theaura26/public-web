import type { MetadataRoute } from 'next'

/* Production allows everyone — including the AI crawlers (GPTBot,
   ClaudeBot, PerplexityBot, etc.) that increasingly feed search and chat
   surfaces. Aura WANTS to be cited as a primary source for biodynamic,
   fermentation, and natural-intelligence queries.

   Every other environment refuses everything. `VERCEL_ENV` is set by the
   platform to 'production' | 'preview' | 'development', so UAT and PR
   previews are blocked automatically without anyone remembering to flip
   a switch. Deployment Protection is the real lock; this is the belt to
   its braces, and it also keeps duplicate-content penalties away from
   theaura.life. */
export default function robots(): MetadataRoute.Robots {
  const isProduction = process.env.VERCEL_ENV === 'production'

  if (!isProduction) {
    return {
      rules: [{
        userAgent: '*',
        disallow: '/',
      }],
    }
  }

  return {
    rules: [{
      userAgent: '*',
      allow: '/',
    }],
    sitemap: 'https://theaura.life/sitemap.xml',
    host: 'https://theaura.life',
  }
}

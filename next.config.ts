import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Note: previous versions pinned `turbopack: { root: path.resolve(__dirname) }`
     to silence a workspace-root warning during local `next dev`. But
     `__dirname` is a CommonJS global — undefined in Vercel's ESM
     module loader — and `path.resolve(undefined)` throws, which is
     exactly what's been failing every prod deploy since PR #16. The
     fix lives in PR #13 (and is being re-applied here). If the
     workspace-root warning returns and starts mattering, swap to
     ESM-safe `path.dirname(fileURLToPath(import.meta.url))`. */
  /* Hide the floating "N" dev indicator that Next.js renders in the
     bottom-left during `next dev`. It overlaps the navbar/back link and
     adds a backdrop blur that distorts the corner of the layout while
     designing. Production builds never render it. */
  devIndicators: false,
  /* Next 16 only honours qualities declared here — anything else is
     ignored with a warning at request time. /brand's slide deck asks for
     78, so declare it alongside the 75 default rather than let ~90 images
     silently fall back. */
  images: { qualities: [75, 78] },
  /* PostHog reverse proxy — events + assets are served from our own
     origin under /ingest, so first-party requests dodge ad-blockers
     (which drop ~a third of third-party analytics traffic). EU endpoints
     for data residency. The catch-all must sit after the /static rule.
     `skipTrailingSlashRedirect` stops Next 308-redirecting /ingest paths. */
  skipTrailingSlashRedirect: true,
  async rewrites() {
    return [
      { source: '/ingest/static/:path*', destination: 'https://eu-assets.i.posthog.com/static/:path*' },
      { source: '/ingest/:path*', destination: 'https://eu.i.posthog.com/:path*' },
    ]
  },
  /* /studios was renamed to /atelier. A permanent redirect keeps the old
     URL alive for anything already indexed or linked, and passes the
     ranking signals across rather than serving a 404. */
  async redirects() {
    return [
      { source: '/studios', destination: '/atelier', permanent: true },
    ]
  },
  /* No redirect from /mudigere-estate → /mudigere: they are intentionally
     separate pages for different audiences. /mudigere is the public flagship
     (indexed, in the sitemap); /mudigere-estate is the architect's briefing,
     reached by direct URL only (noindex, not in the sitemap). */
  /* Belt-and-braces on the noindex meta the signature page already carries:
     an X-Robots-Tag header, so crawlers are told noindex at the HTTP level
     too. The path is deliberately NOT disallowed in robots.txt — a blocked
     crawler can't read the noindex, which is what actually keeps it out. */
  async headers() {
    const isPreview = process.env.VERCEL_ENV === 'preview';
    return [
      { source: '/signature/:path*', headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow, noarchive' }] },
      /* Staging / PR preview deployments are for internal review only.
         Apply noindex site-wide so they never appear in search results. */
      ...(isPreview ? [{ source: '/(.*)', headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }] }] : []),
    ]
  },
};

export default nextConfig;

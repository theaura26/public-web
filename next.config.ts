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
  /* PostHog reverse proxy — events + assets are served from our own
     origin under /ingest, so first-party requests dodge ad-blockers
     (which drop ~a third of third-party analytics traffic) and keep the
     data flowing. EU endpoints for data residency. The catch-all must
     sit after the more specific /static rule. `skipTrailingSlashRedirect`
     stops Next from 308-redirecting the /ingest paths PostHog appends. */
  skipTrailingSlashRedirect: true,
  async rewrites() {
    return [
      { source: '/ingest/static/:path*', destination: 'https://eu-assets.i.posthog.com/static/:path*' },
      { source: '/ingest/:path*', destination: 'https://eu.i.posthog.com/:path*' },
    ]
  },
  /* /mudigere-estate was the original architect's-briefing page;
     /mudigere superseded it with a richer treatment. One canonical
     page now — redirect the old URL so any existing links don't 404. */
  async redirects() {
    return [
      { source: '/mudigere-estate', destination: '/mudigere', permanent: false },
    ]
  },
};

export default nextConfig;

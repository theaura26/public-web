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
};

export default nextConfig;

import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  /* Pin Turbopack to this project's directory. Without this, Next infers
     the workspace root from the nearest lockfile and picks the wrong one
     (~/package-lock.json), throwing a warning on every dev start and
     potentially confusing the file watcher. */
  turbopack: {
    root: path.resolve(__dirname),
  },
  /* Hide the floating "N" dev indicator that Next.js renders in the
     bottom-left during `next dev`. It overlaps the navbar/back link and
     adds a backdrop blur that distorts the corner of the layout while
     designing. Production builds never render it. */
  devIndicators: false,
};

export default nextConfig;

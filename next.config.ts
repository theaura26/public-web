import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Hide the floating "N" dev indicator that Next.js renders in the
     bottom-left during `next dev`. It overlaps the navbar/back link and
     adds a backdrop blur that distorts the corner of the layout while
     designing. Production builds never render it. */
  devIndicators: false,
};

export default nextConfig;

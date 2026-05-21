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
};

export default nextConfig;

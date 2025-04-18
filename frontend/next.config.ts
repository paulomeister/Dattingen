import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    turbo: {
      resolveAlias: {
        canvas: "./empty-module.ts",
      },
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "1000marcas.net",
      },
    ],
  },
};

export default nextConfig;

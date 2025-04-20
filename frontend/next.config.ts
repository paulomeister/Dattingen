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
  webpack: (config, { isServer }) => {
    // Configuración para habilitar el polling en entornos de desarrollo
    if (!isServer) {
      config.watchOptions = {
        poll: 1000, // Comprueba cambios cada 1000ms (1 segundo)
        aggregateTimeout: 300, // Espera 300ms después del último cambio antes de reconstruir
      };
    }

    return config;
  },
};

export default nextConfig;

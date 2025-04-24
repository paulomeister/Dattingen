import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    turbo: {
      resolveAlias: {
        canvas: "./empty-module.ts",
      },
    },
  },
  // Habilitar la opción para mejorar el tiempo de compilación
  poweredByHeader: false,
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "1000marcas.net",
      },
    ],
  },
  webpack: (config, { isServer }) => {
    // Optimizaciones para el tiempo de compilación
    if (!isServer) {
      // Ajustar la configuración de watchOptions para mejorar el rendimiento
      config.watchOptions = {
        aggregateTimeout: 400, // Espera entre cambios para reducir compilaciones excesivas
        ignored: ['**/node_modules', '**/.next'],
      };
    }

    // Añadir caché para acelerar las compilaciones
    config.cache = true;

    return config;
  },
};

export default nextConfig;

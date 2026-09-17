import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  
  webpack: (config, { isServer }) => {
    return config;
  },

    typescript: {
    ignoreBuildErrors: true,
  },

  turbopack: {
    resolveAlias: {
      "@/*": ["./src/*"],
    },
  },

  env: {
    NEXT_PUBLIC_ENABLE_ANIMATIONS: 'true',
  },

  async headers() {
    return [
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
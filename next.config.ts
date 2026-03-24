import type { NextConfig } from "next";

const STRAPI_BASE_URL = process.env.STRAPI_BASE_URL ?? "";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
  ...(STRAPI_BASE_URL && {
    async rewrites() {
      return [
        {
          source: "/strapi-media/:path*",
          destination: `${STRAPI_BASE_URL}/uploads/:path*`,
        },
      ];
    },
  }),
};

export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/tools/offer-guard",
        destination: "/tools/offer-guard.html",
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.btbon.cn',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;

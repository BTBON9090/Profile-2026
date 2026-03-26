import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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

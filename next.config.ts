import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["cos-nodejs-sdk-v5"],
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

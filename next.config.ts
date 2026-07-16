import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ['lucide-react'],
  experimental: {
    optimizePackageImports: [],
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'www.apple.com' },
      { protocol: 'https', hostname: 'images.samsung.com' },
      { protocol: 'https', hostname: 'store.storeimages.cdn-apple.com' },
      { protocol: 'https', hostname: 'i01.appmifile.com' }
    ]
  }
};

export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  images: {
    // This array tells Next.js which external domains are safe to load optimized images from.
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com', // Whitelisting the Cloudinary domain
        port: '',
        pathname: '/dal65p2pp/image/upload/**', // Recommended: specify the Cloudinary path structure if possible
      },
      {
        protocol: 'https',
        hostname: 'cdn.waifu.im', // For waifu.im API images (based on your sample)
        port: '',
        pathname: '/**', // Allow all paths under cdn.waifu.im
      },
      {
        protocol: 'https',
        hostname: 'w.wallhaven.cc', // For wallhaven.cc API images (based on your sample)
        port: '',
        pathname: '/**', // Allow all paths under w.wallhaven.cc
      },
    ],
  },
};

export default nextConfig;
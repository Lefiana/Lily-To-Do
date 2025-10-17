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
    ],
  },
};

export default nextConfig;

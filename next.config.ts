import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // All images are now local in /public folder
  // No remote patterns needed
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
    ]
  }  
  
};

export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol:'https',
        hostname:'res.cloudinary.com',
        port:'',
        pathname:'/**'
      }
    ]
  } ,
  experimental: {
    serverActions: {
      bodySizeLimit: '5mb',
    },
  }, 
  
};

export default nextConfig;

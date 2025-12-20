import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        pathname: '/**',
        hostname: 't4.ftcdn.net',
        port: '',
      },
      {
        pathname: '/**',
        hostname: '*.googleusercontent.com',
        protocol: 'https',
      },
      {
        pathname: '/**',
        hostname: '**',
        protocol: 'https',
      },
      {
        pathname: '/**',
        hostname: '**',
        protocol: 'http',
      },
    ],
    unoptimized: true,
  },
};

export default nextConfig;

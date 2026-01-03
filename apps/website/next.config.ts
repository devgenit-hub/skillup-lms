import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactCompiler: true,
  transpilePackages: ['@repo/shared'],
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
        hostname: 'lh3.googleusercontent.com',
        protocol: 'https',
      },
      {
        pathname: '/**',
        hostname: 'mwmjxqubxaribfvqdjmn.supabase.co',
        protocol: 'https',
      },
      {
        pathname: '/**',
        hostname: '*.supabase.co',
        protocol: 'https',
      },
    ],
    unoptimized: true,
  },
};

export default nextConfig;

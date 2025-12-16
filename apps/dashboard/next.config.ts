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
    ],
  },
};

export default nextConfig;

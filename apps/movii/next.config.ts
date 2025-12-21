import bundleAnalyzer from '@next/bundle-analyzer';

import type { NextConfig } from 'next';

/**
 * The Next Bundle Analyzer is not compatible with Turbopack builds yet, no report will be generated.
 */
const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig: NextConfig = {
  output: 'export',
  reactStrictMode: true,
  reactCompiler: true,
  experimental: {
    scrollRestoration: true,
    externalDir: true, // monorepo 내 패키지 참조 허용
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'image.tmdb.org',
        port: '',
        pathname: '/t/p/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'an2-mars.amz.wtchn.net',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

const getNextConfig = () => {
  const plugins = [withBundleAnalyzer];

  return plugins.reduce((config, plugin) => plugin(config), nextConfig);
};

export default getNextConfig();

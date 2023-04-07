/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  transpilePackages: ['@doesithaveafeed/shared'],
};

module.exports = nextConfig;

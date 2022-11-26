/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    serverComponentsExternalPackages: ['kuroshiro-analyzer-kuromoji'],
  },
}

module.exports = nextConfig

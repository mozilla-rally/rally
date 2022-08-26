/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    // Since we run eslint separately, we need not run it from next
    ignoreDuringBuilds: true,
  }
}

module.exports = nextConfig

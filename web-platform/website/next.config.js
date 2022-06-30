/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  i18n: {
    locales: ["en"],
    defaultLocale: "en",
  },
  eslint: {
    // Since we run eslint separately, we need not run it from next
    ignoreDuringBuilds: true,
  }
}

module.exports = nextConfig

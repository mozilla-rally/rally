/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    // Since we run eslint separately, we need not run it from next
    ignoreDuringBuilds: true,
  },
  async redirects() {
    return [
      {
        source: "/studies",
        destination: "/",
        permanent: true
      },
      {
        source: "/signup",
        destination: "/login",
        permanent: true
      }
    ]
  }
}

module.exports = nextConfig

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // We keep ESLint for dev, but don't block builds in MVP.
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  experimental: {
    instrumentationHook: true,
  },
  // added since it was in the MUI next js example. Probably better to have in
  // general
  reactStrictMode: true,
};

module.exports = nextConfig;

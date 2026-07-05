/** @type {import('next').NextConfig} */
const nextConfig = {
  // Use webpack bundler — required on this platform (native SWC/Turbopack
  // binaries are unavailable in the current Node environment)
  bundlePagesRouterDependencies: true,

  // Proxy /api/* to the Express backend in development
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:5000/api/:path*',
      },
    ];
  },
};

export default nextConfig;

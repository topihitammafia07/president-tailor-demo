import type { NextConfig } from "next";

const API_DESTINATION =
  process.env.INTERNAL_API_URL ||
  (process.env.NODE_ENV === 'production'
    ? 'https://president-tailor-demo-production.up.railway.app'
    : 'http://127.0.0.1:8000');

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api-backend/:path*',
        destination: `${API_DESTINATION}/:path*`,
      },
    ];
  },
};

export default nextConfig;

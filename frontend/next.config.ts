import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/admin/:path*",
        destination: "http://localhost:8082/admin/api/:path*",
      },
    ];
  },
};

export default nextConfig;

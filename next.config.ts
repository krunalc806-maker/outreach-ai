import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  async redirects() {
    return [
      {
        source: "/sequences",
        destination: "/sequence",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;


import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "mindspring.t3.storage.dev",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  experimental: {
    optimizePackageImports: [
      "@react-three/drei",
      "@react-three/fiber",
      "three",
    ],
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatar.viverse.com",
      },
    ],
  },
};

export default nextConfig;

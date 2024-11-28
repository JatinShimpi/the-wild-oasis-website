import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "himcbaynxhchayjtxokj.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/cabim-images/**",
      },
    ],
  },
  /* config options here */
};

export default nextConfig;

import type { NextConfig } from "next";
import { vitNodeNextConfig } from "vitnode/config/next.config";

const nextConfig: NextConfig = {
  ...vitNodeNextConfig({})
};

export default nextConfig;

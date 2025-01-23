import type { NextConfig } from "next";
import { vitNodeNextConfig } from "vitnode/config/next.config";
import * as dotenv from "dotenv";
import { join } from "path";

dotenv.config({
  path: join(process.cwd(), "..", "..", ".env")
});

const nextConfig: NextConfig = {
  ...vitNodeNextConfig({})
};

export default nextConfig;

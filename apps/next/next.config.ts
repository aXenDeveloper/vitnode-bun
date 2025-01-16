import type { NextConfig } from "next";
import * as dotenv from "dotenv";
import { join } from "path";

dotenv.config({
  path: join(process.cwd(), "..", "..", ".env")
});

const nextConfig: NextConfig = {
  env: {
    LOGIN_TOKEN_SECRET: process.env.LOGIN_TOKEN_SECRET
  }
};

export default nextConfig;

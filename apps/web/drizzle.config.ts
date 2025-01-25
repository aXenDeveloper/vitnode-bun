import "dotenv/config";
import { defineConfig } from "drizzle-kit";
import { DATABASE_ENVS } from "vitnode/api/database/client";

export default defineConfig({
  out: "./src/plugins/core/database/migrations/",
  schema: "./src/plugins/**/database/schema/*.ts",
  dialect: "postgresql",
  dbCredentials: DATABASE_ENVS
});

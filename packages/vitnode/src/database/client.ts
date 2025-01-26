import { drizzle } from "drizzle-orm/postgres-js";
import schema from "./schema";

export const DATABASE_ENVS = {
  host: process.env.DB_HOST ?? "localhost",
  port: process.env.DB_PORT ? +process.env.DB_PORT : 5432,
  user: process.env.DB_USER ?? "root",
  password: process.env.DB_PASSWORD ?? "root",
  database: process.env.DB_DATABASE ?? "vitnode",
  ssl: process.env.DB_SSL ? process.env.DB_SSL === "true" : false
};

export const clientDb = drizzle({
  schema,
  connection: {
    host: DATABASE_ENVS.host,
    port: DATABASE_ENVS.port,
    user: DATABASE_ENVS.user,
    password: DATABASE_ENVS.password,
    database: DATABASE_ENVS.database,
    ssl: DATABASE_ENVS.ssl
  }
});

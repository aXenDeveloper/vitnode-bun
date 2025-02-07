// import * as dotenv from 'dotenv';
import { drizzle } from 'drizzle-orm/postgres-js';
import { join } from 'path';

// dotenv.config({
//   path: join(process.cwd(), '..', '..', '.env'),
// });

export const DATABASE_ENVS = {
  host: process.env.DB_HOST ?? 'localhost',
  port: process.env.DB_PORT ? +process.env.DB_PORT : 5432,
  user: process.env.DB_USER ?? 'root',
  password: process.env.DB_PASSWORD ?? 'root',
  database: process.env.DB_DATABASE ?? 'vitnode',
  ssl: process.env.DB_SSL ? process.env.DB_SSL === 'true' : false,
};

export const clientDb = drizzle({
  connection: DATABASE_ENVS,
});

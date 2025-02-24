// import * as dotenv from 'dotenv';
import { drizzle } from 'drizzle-orm/postgres-js';

// dotenv.config({
//   path: join(process.cwd(), '..', '..', '.env'),
// });

export const POSTGRES_ENVS = {
  host: process.env.POSTGRES_HOST ?? 'localhost',
  port: process.env.POSTGRES_PORT ? +process.env.POSTGRES_PORT : 5432,
  user: process.env.POSTGRES_USER ?? 'root',
  password: process.env.POSTGRES_PASSWORD ?? 'root',
  database: process.env.POSTGRES_NAME ?? 'vitnode',
  ssl: process.env.POSTGRES_SSL ? process.env.POSTGRES_SSL === 'true' : false,
};

export const dbClient = drizzle({
  connection: POSTGRES_ENVS,
});

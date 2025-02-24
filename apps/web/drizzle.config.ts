import { POSTGRES_ENVS } from '@/database/client';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  out: './src/database/migrations/',
  // schema: ['./src/plugins/**/database/schema/*'],
  schema: ['./src/database/schema/*'],
  dialect: 'postgresql',
  dbCredentials: POSTGRES_ENVS,
});

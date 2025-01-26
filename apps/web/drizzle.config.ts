import { DATABASE_ENVS } from '@/plugins/core/database/client';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  out: './src/plugins/core/database/migrations/',
  schema: './src/plugins/**/database/schema/*',
  dialect: 'postgresql',
  dbCredentials: DATABASE_ENVS,
});

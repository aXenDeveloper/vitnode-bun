import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';
import * as dotenv from 'dotenv';
import { join } from 'path';

const withNextIntl = createNextIntlPlugin('./src/i18n.ts');

dotenv.config({
  path: join(process.cwd(), '..', '..', '.env'),
});

export const vitNodeNextConfig = (config: NextConfig): NextConfig =>
  withNextIntl({
    ...config,
    env: {
      ...config.env,
      DB_HOST: process.env.DB_HOST ?? 'localhost',
      DB_PORT: process.env.DB_PORT ? process.env.DB_PORT : '5432',
      DB_USER: process.env.DB_USER ?? 'root',
      DB_PASSWORD: process.env.DB_PASSWORD ?? 'root',
      DB_DATABASE: process.env.DB_DATABASE ?? 'vitnode',
      DB_SSL: process.env.DB_SSL === 'true' ? 'true' : 'false',
    },
  });

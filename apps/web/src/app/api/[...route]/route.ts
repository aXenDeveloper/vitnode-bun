import { OpenAPIHono } from '@hono/zod-openapi';
import { handle } from 'hono/vercel';
import { VitNodeAPIInit } from 'vitnode/api/config';
import corePlugin from 'vitnode/api/plugin';

const app = new OpenAPIHono().basePath('/api');
VitNodeAPIInit({
  app,
  plugins: [corePlugin],
});

export const GET = handle(app);
export const POST = handle(app);

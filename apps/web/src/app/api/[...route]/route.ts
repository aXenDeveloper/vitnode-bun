import { OpenAPIHono } from '@hono/zod-openapi';
import { handle } from 'hono/vercel';
import { VitNodeAPI } from 'vitnode/api/config';
import corePlugin from 'vitnode/api/plugin';

const app = new OpenAPIHono().basePath('/api');
VitNodeAPI({
  app,
  plugins: [corePlugin],
  authorization: {},
});

export const GET = handle(app);
export const POST = handle(app);
export const PUT = handle(app);
export const DELETE = handle(app);

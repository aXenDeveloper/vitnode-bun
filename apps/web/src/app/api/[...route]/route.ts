import { OpenAPIHono } from '@hono/zod-openapi';
import { handle } from 'hono/vercel';
import { honoConfig } from 'vitnode/api/config';

import { plugins } from './plugins';

const app = new OpenAPIHono().basePath('/api');
honoConfig({ app });
app.route('/', plugins);

app.get('/hello', c => {
  return c.json({
    message: 'welcome',
  });
});

export const GET = handle(app);
export const POST = handle(app);

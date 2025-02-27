import { createApiRoute } from '@/api/lib/route';
import { OpenAPIHono } from '@hono/zod-openapi';
import { z } from 'zod';

const route = createApiRoute({
  method: 'get',
  plugin: 'core',
  description: 'Middleware route with user authentication',
  path: '/',
  responses: {
    200: {
      content: {
        'application/json': {
          schema: z.object({
            id: z.string(),
          }),
        },
      },
      description: 'Middleware route',
    },
  },
});

export const middlewareRoute = new OpenAPIHono().openapi(route, c => {
  return c.json({ id: 'ffasf' });
});

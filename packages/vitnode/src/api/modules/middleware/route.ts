import { createApiRoute } from '@/api/utils/route';
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
  // eslint-disable-next-line no-console
  console.log('Middleware route');

  return c.json({ id: 'test' });
});

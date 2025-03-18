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
            sso: z.array(z.object({ id: z.string(), name: z.string() })),
          }),
        },
      },
      description: 'Middleware route',
    },
  },
});

export const middlewareRoute = new OpenAPIHono().openapi(route, c => {
  const sso = c.get('core').authorization.ssoPlugins;

  return c.json({ sso: sso.map(s => ({ id: s.id, name: s.name })) });
});

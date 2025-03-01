import { createApiRoute } from '@/api/lib/route';
import { SessionModel } from '@/api/models/session';
import { OpenAPIHono } from '@hono/zod-openapi';

const route = createApiRoute({
  method: 'delete',
  description: 'Sign out the current user',
  plugin: 'core',
  path: '/',
  responses: {
    200: {
      description: 'User signed out',
    },
    403: {
      description: 'Access Denied',
    },
  },
});

export const signOutRoute = new OpenAPIHono().openapi(route, async c => {
  await new SessionModel(c).deleteSession();

  return c.json({});
});

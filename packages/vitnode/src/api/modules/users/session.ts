import { createApiRoute } from '@/api/lib/route';
import { SessionModel } from '@/api/models/session';
import { OpenAPIHono } from '@hono/zod-openapi';
import { z } from 'zod';

const route = createApiRoute({
  method: 'get',
  description: 'Verify session',
  plugin: 'core',
  path: '/session',
  responses: {
    200: {
      content: {
        'application/json': {
          schema: z.object({
            user: z
              .object({
                id: z.string(),
                email: z.string(),
                name: z.string(),
                name_seo: z.string(),
                joined_at: z.date(),
                newsletter: z.boolean(),
                avatar_color: z.string(),
                email_verified: z.boolean(),
                group_id: z.string(),
                birthday: z.date().nullable(),
              })
              .nullable(),
          }),
        },
      },
      description: 'User',
    },
  },
});

export const sessionRoute = new OpenAPIHono().openapi(route, async c => {
  const user = await SessionModel.verifySession(c);

  return c.json({
    user,
  });
});

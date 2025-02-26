import { createApiRoute } from '@/api/lib/route';
import { SessionModel } from '@/api/models/session/session';
import { UserModel } from '@/api/models/user/user';
import { OpenAPIHono } from '@hono/zod-openapi';
import { z } from 'zod';

const route = createApiRoute({
  method: 'post',
  description: 'Sign in with email and password',
  plugin: 'core',
  path: '/sign_in',
  request: {
    body: {
      required: true,
      content: {
        'application/json': {
          schema: z.object({
            email: z.string().email().toLowerCase().openapi({
              example: 'test@test.com',
            }),
            password: z.string().min(8).openapi({
              example: 'Test123!',
            }),
          }),
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: z.object({
            id: z.string(),
            token: z.string(),
          }),
        },
      },
      description: 'User signed in',
    },
    403: {
      description: 'Access Denied',
    },
  },
});

export const signInRoute = new OpenAPIHono().openapi(route, async c => {
  const data = await UserModel.signInWithPassword(c.req.valid('json'));
  const token = await SessionModel.createSession(
    {
      userId: data.id,
    },
    c,
  );

  return c.json({ id: data.id, token });
});

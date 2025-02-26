import { createApiRoute } from '@/api/lib/route';
import { UserModel } from '@/api/models/user/user';
import { OpenAPIHono } from '@hono/zod-openapi';
import { z } from 'zod';

const nameRegex = /^(?!.* {2})[\p{L}\p{N}._@ -]*$/u;

const route = createApiRoute({
  method: 'post',
  description: 'Create a new user',
  plugin: 'core',
  path: '/sign_up',
  request: {
    body: {
      required: true,
      content: {
        'application/json': {
          schema: z.object({
            email: z.string().email().toLowerCase().openapi({
              example: 'test@test.com',
            }),
            name: z
              .string()
              .openapi({ example: 'test' })
              .min(3)
              .refine(val => nameRegex.test(val), {
                message: 'Invalid name',
              }),
            password: z.string().min(8).openapi({
              example: 'Test123!',
            }),
            newsletter: z.boolean().default(false).optional(),
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
          }),
        },
      },
      description: 'User created',
    },
  },
});

export const signUpRoute = new OpenAPIHono().openapi(route, async c => {
  const data = await UserModel.signUp(c.req.valid('json'), c.req);

  return c.json({ id: data.id });
});

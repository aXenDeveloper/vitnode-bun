import { createModuleApi } from '@/api/helpers/module';
import { createApiRoute } from '@/api/helpers/route';
import { UserModel } from '@/api/models/user/user';
import { OpenAPIHono, z } from '@hono/zod-openapi';

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

const route2 = createApiRoute({
  method: 'get',
  description: 'Create a new user',
  plugin: 'core',
  path: '/sign_up2',
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

const route3 = createApiRoute({
  method: 'delete',
  description: 'Create a new user',
  plugin: 'core',
  path: '/sign_up',
  responses: {
    200: {
      content: {
        'application/json': {
          schema: z.object({
            test123: z.string(),
          }),
        },
      },
      description: 'User created',
    },
  },
});

export const usersModule = createModuleApi({
  name: 'users',
  plugin: 'core',
  routes: new OpenAPIHono()
    .openapi(route, async c => {
      const data = await UserModel.signUp(c.req.valid('json'), c.req);

      return c.json({ id: data.id });
    })
    .openapi(route2, c => {
      return c.json({ id: '123' });
    })
    .openapi(route3, c => {
      return c.json({ test123: '123' });
    }),
});

export type UsersTypes = typeof usersModule;

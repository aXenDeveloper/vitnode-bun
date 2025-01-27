import { clientDb } from '@/database/client';
import { core_users } from '@/database/schema/users';
import { removeSpecialCharacters } from '@/functions/special-characters';
import { createRoute, OpenAPIHono, z } from '@hono/zod-openapi';
import { and, eq } from 'drizzle-orm';
import { HTTPException } from 'hono/http-exception';

import { passwordModel } from './models/password';

export const users = new OpenAPIHono();
const nameRegex = /^(?!.* {2})[\p{L}\p{N}._@ -]*$/u;

users.openapi(
  createRoute({
    method: 'post',
    description: 'Create a new user',
    tags: ['Core'],
    path: '/sign_up',
    request: {
      body: {
        required: true,
        content: {
          'application/json': {
            schema: z.object({
              email: z.string().email().toLowerCase(),
              name: z
                .string()
                .min(3)
                .refine(val => nameRegex.test(val), {
                  message: 'Invalid name',
                }),
              password: z.string().min(8),
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
  }),
  async c => {
    const {
      email,
      name: nameFromBody,
      newsletter,
      password,
    } = c.req.valid('json');
    const name = removeSpecialCharacters(nameFromBody);
    const encryptPassword = await passwordModel.encryptPassword(password);

    const checkIfUserExist = await clientDb
      .select({
        email: core_users.email,
        name: core_users.name,
      })
      .from(core_users)
      .where(and(eq(core_users.email, email), eq(core_users.name, name)));

    const findEmail = checkIfUserExist.find(user => user.email === email);
    if (findEmail) {
      throw new HTTPException(400, {
        message: 'Email already exists',
      });
    }
    const findName = checkIfUserExist.find(user => user.name === name);
    if (findName) {
      throw new HTTPException(400, {
        message: 'Name already exists',
      });
    }

    return c.json({ id: email });
  },
);

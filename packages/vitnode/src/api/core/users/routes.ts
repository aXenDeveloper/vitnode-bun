import { getUserIp } from '@/api/helpers/get-user-ip';
import { createApiRoute } from '@/api/helpers/route';
import { clientDb } from '@/database/client';
import { core_groups } from '@/database/schema/groups';
import { core_users } from '@/database/schema/users';
import { removeSpecialCharacters } from '@/functions/special-characters';
import { OpenAPIHono, z } from '@hono/zod-openapi';
import { and, count, eq } from 'drizzle-orm';
import { HTTPException } from 'hono/http-exception';

import { passwordModel } from './models/password';
import { generateAvatarColor } from './utils/avatar-color';

export const users = new OpenAPIHono();
const nameRegex = /^(?!.* {2})[\p{L}\p{N}._@ -]*$/u;

const route = createApiRoute({
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

const getDefaultData = async (): Promise<{
  email_verified: boolean;
  group_id: string;
}> => {
  const [countUsers] = await clientDb
    .select({ count: count() })
    .from(core_users);

  // If no users, return root group
  if (countUsers.count === 0) {
    const [defaultGroup] = await clientDb
      .select({
        id: core_groups.id,
      })
      .from(core_groups)
      .where(and(eq(core_groups.default, false), eq(core_groups.root, true)))
      .limit(1);

    if (!defaultGroup) {
      throw new HTTPException(400, {
        message: 'Default group not found.',
      });
    }

    return {
      group_id: defaultGroup.id,
      email_verified: true,
    };
  }

  const [defaultGroup] = await clientDb
    .select({
      id: core_groups.id,
    })
    .from(core_groups)
    .where(and(eq(core_groups.default, true), eq(core_groups.root, false)))
    .limit(1);

  if (!defaultGroup) {
    throw new HTTPException(400, {
      message: 'Default group not found.',
    });
  }

  return {
    group_id: defaultGroup.id,
    email_verified: false,
  };
};

users.openapi(route, async c => {
  const { email, name, newsletter, password } = c.req.valid('json');
  const convertToNameSEO = removeSpecialCharacters(name);
  const encryptPassword = await passwordModel.encryptPassword(password);

  const checkIfUserExist = await clientDb
    .select({
      email: core_users.email,
      name_seo: core_users.name_seo,
    })
    .from(core_users)
    .where(
      and(
        eq(core_users.email, email),
        eq(core_users.name_seo, convertToNameSEO),
      ),
    );

  const findEmail = checkIfUserExist.find(user => user.email === email);
  if (findEmail) {
    throw new HTTPException(400, {
      message: 'Email already exists',
    });
  }
  const findName = checkIfUserExist.find(
    user => user.name_seo === convertToNameSEO,
  );
  if (findName) {
    throw new HTTPException(400, {
      message: 'Name already exists',
    });
  }

  const { group_id, email_verified } = await getDefaultData();

  const [data] = await clientDb
    .insert(core_users)
    .values({
      email,
      name,
      name_seo: convertToNameSEO,
      // TODO: Handle newsletter only if email is allowed
      newsletter,
      password: encryptPassword,
      avatar_color: generateAvatarColor(name),
      group_id,
      // TODO: Handle email verification
      email_verified: true,
      ip_address: getUserIp(c.req),
      // TODO: Handle language
      // language: await this.getLanguage(req),
    })
    .returning();

  return c.json({ id: data.id });
});

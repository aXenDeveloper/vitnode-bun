import { generateAvatarColor } from '@/api/core/users/utils/avatar-color';
import { getUserIp } from '@/api/helpers/get-user-ip';
import { dbClient } from '@/database/client';
import { core_groups } from '@/database/schema/groups';
import { core_users } from '@/database/schema/users';
import { removeSpecialCharacters } from '@/functions/special-characters';
import { and, count, eq } from 'drizzle-orm';
import { HonoRequest } from 'hono';
import { HTTPException } from 'hono/http-exception';

import { PasswordModel } from '../password';

const getDefaultData = async (): Promise<{
  email_verified: boolean;
  group_id: string;
}> => {
  const [countUsers] = await dbClient
    .select({ count: count() })
    .from(core_users);

  // If no users, return root group
  if (countUsers.count === 0) {
    const [defaultGroup] = await dbClient
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

  const [defaultGroup] = await dbClient
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
    // TODO: Handle email verification
    email_verified: false,
  };
};

export const signUp = async (
  {
    email,
    name,
    newsletter,
    password,
  }: {
    email: string;
    name: string;
    newsletter?: boolean;
    password: string;
  },
  req: HonoRequest,
) => {
  const convertToNameSEO = removeSpecialCharacters(name);
  const checkIfUserExist = await dbClient
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

  const [{ group_id, email_verified }, encryptPassword] = await Promise.all([
    getDefaultData(),
    PasswordModel.encryptPassword(password),
  ]);
  const [data] = await dbClient
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
      email_verified,
      ip_address: getUserIp(req),
      // TODO: Handle language
      // language: await this.getLanguage(req),
    })
    .returning();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password: _, ...user } = data;

  return user;
};

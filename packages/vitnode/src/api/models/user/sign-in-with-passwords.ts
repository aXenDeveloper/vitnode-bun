import { dbClient } from '@/database/client';
import { core_users } from '@/database/schema/users';
import { eq } from 'drizzle-orm';
import { HonoRequest } from 'hono';
import { HTTPException } from 'hono/http-exception';

import { PasswordModel } from '../password';
import { signJWT } from '@/api/utils/jwt';
import { decodeJwt, jwtDecrypt, jwtVerify } from 'jose';

export const signInWithPassword = async (
  {
    email,
    password,
  }: {
    email: string;
    password: string;
  },
  req: HonoRequest,
) => {
  const [user] = await dbClient
    .select({
      id: core_users.id,
      email: core_users.email,
      password: core_users.password,
    })
    .from(core_users)
    .where(eq(core_users.email, email))
    .limit(1);

  if (!user?.password) {
    throw new HTTPException(403);
  }

  const validPassword = await PasswordModel.verifyPassword(
    password,
    user.password,
  );

  if (!validPassword) {
    throw new HTTPException(403);
  }

  return { id: user.id, email: user.email };
};

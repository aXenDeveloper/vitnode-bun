import { createApiRoute } from '@/api/lib/route';
import { SessionModel } from '@/api/models/session';
import { SSOModel } from '@/api/models/sso';
import { UserModel } from '@/api/models/user';
import { dbClient } from '@/database/client';
import { core_users_sso } from '@/database/schema/users';
import { OpenAPIHono } from '@hono/zod-openapi';
import { z } from 'zod';

const route = createApiRoute({
  method: 'post',
  description: 'Sign up with SSO if user does not exist',
  plugin: 'core',
  path: '/{providerId}/sign_up',
  request: {
    params: z.object({
      providerId: z.string(),
    }),
    body: {
      required: true,
      content: {
        'application/json': {
          schema: z.object({
            access_token: z.string(),
            token_type: z.string(),
            name: z.string(),
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
      description: 'URL',
    },
  },
});

export const signUpSSORoute = new OpenAPIHono().openapi(route, async c => {
  const { providerId } = c.req.valid('param');
  const { access_token, token_type, name } = c.req.valid('json');
  const userFromSSO = await new SSOModel(c).fetchUser({
    access_token,
    token_type,
    providerId,
  });

  const data = await new UserModel().signUp(
    {
      email: userFromSSO.email,
      name,
      newsletter: false,
      hashedPassword: undefined,
    },
    c.req,
  );
  await dbClient.insert(core_users_sso).values({
    user_id: data.id,
    provider_id: providerId,
    provider_account_id: userFromSSO.id,
  });

  const { token } = await new SessionModel(c).createSessionByUserId(data.id);

  return c.json({ id: data.id, token });
});

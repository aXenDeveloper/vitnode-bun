import { createApiRoute } from '@/api/lib/route';
import { SessionModel } from '@/api/models/session';
import { SSOModel } from '@/api/models/sso';
import { dbClient } from '@/database/client';
import { core_users, core_users_sso } from '@/database/schema/users';
import { OpenAPIHono } from '@hono/zod-openapi';
import { and, eq } from 'drizzle-orm';
import { z } from 'zod';

const route = createApiRoute({
  method: 'get',
  description: 'SSO Callback',
  plugin: 'core',
  path: '/{providerId}/callback',
  request: {
    params: z.object({
      providerId: z.string(),
    }),
    query: z.object({
      code: z.string(),
    }),
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: z.object({
            user: z
              .object({
                id: z.string(),
                token: z.string(),
              })
              .optional(),
            access_token: z.string(),
            token_type: z.string(),
            email: z.string(),
            username: z.string().optional(),
          }),
        },
      },
      description: 'URL',
    },
  },
});

export const callbackRoute = new OpenAPIHono().openapi(route, async c => {
  const { providerId } = c.req.valid('param');
  const { code } = c.req.valid('query');
  const sso = new SSOModel(c);
  const ssoToken = await sso.fetchToken({ code, providerId });
  const userFromSSO = await sso.fetchUser({ ...ssoToken, providerId });

  return await dbClient.transaction(async tx => {
    const [dataSSOFromDb] = await tx
      .select({
        user_id: core_users_sso.user_id,
      })
      .from(core_users_sso)
      .leftJoin(core_users, eq(core_users.id, core_users_sso.user_id))
      .where(
        and(
          eq(core_users_sso.provider_id, providerId),
          eq(core_users_sso.provider_account_id, userFromSSO.id),
        ),
      )
      .limit(1);

    if (!dataSSOFromDb) {
      const [userWithEmail] = await tx
        .select({
          id: core_users.id,
          email: core_users.email,
        })
        .from(core_users)
        .where(eq(core_users.email, userFromSSO.email))
        .limit(1);

      if (!userWithEmail) {
        return c.json({
          ...ssoToken,
          email: userFromSSO.email,
          username: userFromSSO.username,
        });
      }

      // If email exists, register SSO
      await tx.insert(core_users_sso).values({
        provider_id: providerId,
        provider_account_id: userFromSSO.id,
        user_id: userWithEmail.id,
      });
      const { token } = await new SessionModel(c).createSessionByUserId(
        userWithEmail.id,
      );

      return c.json({
        ...ssoToken,
        user: { id: userWithEmail.id, token },
        email: userFromSSO.email,
        username: userFromSSO.username,
      });
    }

    const { token } = await new SessionModel(c).createSessionByUserId(
      dataSSOFromDb.user_id,
    );

    return c.json({
      ...ssoToken,
      user: { id: dataSSOFromDb.user_id, token },
      email: userFromSSO.email,
      username: userFromSSO.username,
    });
  });
});

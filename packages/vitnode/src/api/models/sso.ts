import { dbClient } from '@/database/client';
import { core_users, core_users_sso } from '@/database/schema/users';
import { removeSpecialCharacters } from '@/lib/special-characters';
import { and, eq } from 'drizzle-orm';
import { Context, Env, Input } from 'hono';
import { HTTPException } from 'hono/http-exception';

import { SSOModelPlugin } from '../plugins/sso/plugin';
import { UserModel } from './user';

export interface SSOApiPlugin {
  fetchToken: (
    code: string,
  ) => Promise<{ access_token: string; token_type: string }>;
  fetchUser: (args: {
    access_token: string;
    token_type: string;
  }) => Promise<{ email: string; id: string; username: string }>;
  getUrl: () => string;
  id: string;
}

export class SSOModel extends SSOModelPlugin {
  constructor(c: Context<Env, '/', Input>) {
    super();
    this.c = c;
    this.plugins = c.get('core').authorization.ssoPlugins;
  }

  private readonly c: Context<Env, '/', Input>;
  private readonly plugins: SSOApiPlugin[];

  private readonly signUpUser = async ({
    providerId,
    user,
    c,
  }: {
    c: Context<Env, '/', Input>;
    providerId: string;
    user: {
      email: string;
      id: string;
      username: string;
    };
  }) => {
    const data = await new UserModel().signUp(
      {
        email: user.email,
        name: removeSpecialCharacters(user.username, false),
        newsletter: false,
        hashedPassword: undefined,
      },
      c.req,
    );
    await dbClient.insert(core_users_sso).values({
      user_id: data.id,
      provider_id: providerId,
      provider_account_id: user.id,
    });

    return { userId: data.id };
  };

  private async fetchToken({
    code,
    providerId,
  }: {
    code: string;
    providerId: string;
  }) {
    const provider = this.plugins.find(p => p.id === providerId);
    if (!provider) {
      throw new HTTPException(404);
    }

    return provider.fetchToken(code);
  }

  private async fetchUser({
    access_token,
    token_type,
    providerId,
  }: {
    access_token: string;
    providerId: string;
    token_type: string;
  }) {
    const provider = this.plugins.find(p => p.id === providerId);
    if (!provider) {
      throw new HTTPException(404);
    }

    return provider.fetchUser({ access_token, token_type });
  }

  async callback({
    code,
    providerId,
  }: {
    code: string;
    providerId: string;
  }): Promise<{
    userId: string;
  }> {
    const ssoToken = await this.fetchToken({ code, providerId });
    const userFromSSO = await this.fetchUser({ ...ssoToken, providerId });

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
          const signUpUser = await this.signUpUser({
            providerId,
            user: userFromSSO,
            c: this.c,
          });

          return signUpUser;
        }

        // If email exists, register SSO
        await tx.insert(core_users_sso).values({
          provider_id: providerId,
          provider_account_id: userFromSSO.id,
          user_id: userWithEmail.id,
        });

        return {
          userId: userWithEmail.id,
        };
      }

      return {
        userId: dataSSOFromDb.user_id,
      };
    });
  }

  getUrl(providerId: string) {
    const provider = this.plugins.find(p => p.id === providerId);
    if (!provider) {
      throw new HTTPException(404);
    }

    return provider.getUrl();
  }
}

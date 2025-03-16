import { dbClient } from '@/database/client';
import { core_users, core_users_sso } from '@/database/schema/users';
import { CONFIG } from '@/lib/config';
import { removeSpecialCharacters } from '@/lib/special-characters';
import crypto from 'crypto';
import { and, eq } from 'drizzle-orm';
import { Context, Env, Input } from 'hono';
import { deleteCookie, getCookie, setCookie } from 'hono/cookie';
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
  getUrl: (props: { state: string }) => string;
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

  private checkState(stateFromFetch: string) {
    const stateFromCookies = getCookie(
      this.c,
      `${this.c.get('core').authorization.cookie_name}--state-sso`,
    );
    if (!stateFromCookies || stateFromCookies !== stateFromFetch) {
      throw new HTTPException(400, {
        message: 'Invalid state',
      });
    }

    deleteCookie(
      this.c,
      `${this.c.get('core').authorization.cookie_name}--state-sso`,
    );
  }

  private generateState() {
    const state = crypto.randomBytes(64).toString('hex').normalize();

    setCookie(
      this.c,
      `${this.c.get('core').authorization.cookie_name}--state-sso`,
      state,
      {
        httpOnly: true,
        secure: this.c.get('core').authorization.cookie_secure,
        sameSite: 'strict',
        path: '/',
        domain: CONFIG.frontend.hostname,
      },
    );

    return state;
  }

  async callback({
    code,
    providerId,
    state,
  }: {
    code: string;
    providerId: string;
    state: string;
  }): Promise<{
    userId: string;
  }> {
    this.checkState(state);
    const provider = this.plugins.find(p => p.id === providerId);
    if (!provider) {
      throw new HTTPException(404);
    }

    const ssoToken = await provider.fetchToken(code);
    const userFromSSO = await provider.fetchUser(ssoToken);

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

    return provider.getUrl({ state: this.generateState() });
  }
}

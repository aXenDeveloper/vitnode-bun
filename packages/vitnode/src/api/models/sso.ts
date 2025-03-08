import { dbClient } from '@/database/client';
import { core_users_sso } from '@/database/schema/users';
import { removeSpecialCharacters } from '@/lib/special-characters';
import { Context, Env, Input } from 'hono';
import { HTTPException } from 'hono/http-exception';

import { SSOModelPlugin } from '../plugins/sso/plugin';
import { SessionModel } from './session';
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
  constructor(c: Context) {
    super();
    this.plugins = c.get('core').authorization.ssoPlugins;
  }

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
    const { token } = await new SessionModel(c).createSessionByUserId(data.id);

    return token;
  };

  async fetchToken({ code, providerId }: { code: string; providerId: string }) {
    const provider = this.plugins.find(p => p.id === providerId);
    if (!provider) {
      throw new HTTPException(404);
    }

    return provider.fetchToken(code);
  }

  async fetchUser({
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

  getUrl(providerId: string) {
    const provider = this.plugins.find(p => p.id === providerId);
    if (!provider) {
      throw new HTTPException(404);
    }

    return provider.getUrl();
  }
}

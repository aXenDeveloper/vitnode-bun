import { Context } from 'hono';
import { HTTPException } from 'hono/http-exception';

import { SSOModelPlugin } from '../plugins/sso/plugin';

export interface SSOApiPlugin {
  fetchToken: (
    code: string,
  ) => Promise<{ access_token: string; token_type: string }>;
  fetchUser: (args: {
    access_token: string;
    token_type: string;
  }) => Promise<{ email: string; id: string; username?: string }>;
  getUrl: () => string;
  id: string;
}

export class SSOModel extends SSOModelPlugin {
  constructor(c: Context) {
    super();
    this.plugins = c.get('core').authorization.ssoPlugins;
  }

  private readonly plugins: SSOApiPlugin[];

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

import { CONFIG } from '@/lib/config';
import { HTTPException } from 'hono/http-exception';

export interface SSOProvider {
  clientId?: string;
  clientSecret?: string;
  id: string;
  name: string;
}

export class SSOModel {
  private readonly redirectUri = (code: string) =>
    `${CONFIG.frontend.href}/login/sso/${code}/callback`;

  getProviders() {
    return [
      { id: 'google', name: 'Google' },
      { id: 'facebook', name: 'Facebook' },
      { id: 'github', name: 'GitHub' },
    ];
  }

  getUrlProvider(providerId: string) {
    const providers = this.getProviders();
    const provider = providers.find(p => p.id === providerId);
    if (!provider) {
      throw new HTTPException(404);
    }

    const url = new URL('https://discord.com/oauth2/authorize');
    url.searchParams.set('client_id', '');
    url.searchParams.set('redirect_uri', this.redirectUri(provider.id));
  }
}

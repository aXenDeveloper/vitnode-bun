import { CONFIG } from '@/lib/config';
import { HTTPException } from 'hono/http-exception';
import { ContentfulStatusCode } from 'hono/utils/http-status';
import { z } from 'zod';

export interface SSOProvider {
  clientId?: string;
  clientSecret?: string;
  id: string;
  name: string;
}

export class SSOModel {
  private readonly redirectUri = (code: string) =>
    new URL(`${CONFIG.frontend.href}login/sso/${code}`).toString();

  private readonly tokenSchema = z.object({
    access_token: z.string(),
    token_type: z.string(),
  });

  private readonly userSchema = z.object({
    id: z.string(),
    email: z.string(),
    username: z.string().optional(),
  });

  async fetchToken({ code, providerId }: { code: string; providerId: string }) {
    const provider = this.getProviders().find(p => p.id === providerId);
    if (!provider) {
      throw new HTTPException(404);
    }

    const res = await fetch('https://discord.com/api/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'application/json',
      },
      body: new URLSearchParams({
        code,
        redirect_uri: this.redirectUri(providerId),
        grant_type: 'authorization_code',
        client_id: '',
        client_secret: '',
      }),
    });

    if (!res.ok) {
      throw new HTTPException(+res.status.toString() as ContentfulStatusCode, {
        message: 'Internal error requesting token',
      });
    }

    const { data, error } = this.tokenSchema.safeParse(await res.json());
    if (error || !data) {
      throw new HTTPException(400, {
        message: 'Invalid token response',
      });
    }

    return data;
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
    const provider = this.getProviders().find(p => p.id === providerId);
    if (!provider) {
      throw new HTTPException(404);
    }

    const res = await fetch('https://discord.com/api/users/@me', {
      headers: {
        Authorization: `${token_type} ${access_token}`,
      },
    });
    const dataFromRes = await res.json();
    const { data, error } = this.userSchema.safeParse(dataFromRes);
    if (error || !data) {
      throw new HTTPException(400, {
        message: 'Invalid user response',
      });
    }

    return data;
  }

  getProviders() {
    return [
      { id: 'google', name: 'Google' },
      { id: 'facebook', name: 'Facebook' },
      { id: 'github', name: 'GitHub' },
      { id: 'discord', name: 'Discord' },
    ];
  }

  getUrlProvider(providerId: string) {
    const provider = this.getProviders().find(p => p.id === providerId);
    if (!provider) {
      throw new HTTPException(404);
    }

    const url = new URL('https://discord.com/oauth2/authorize');
    url.searchParams.set('client_id', '1344968230946738266');
    url.searchParams.set('redirect_uri', this.redirectUri(provider.id));
    url.searchParams.set('response_type', 'code');
    url.searchParams.set('scope', 'identify email');

    return url.toString();
  }
}

import { SSOApiPlugin } from '@/api/models/sso';
import { HTTPException } from 'hono/http-exception';
import { ContentfulStatusCode } from 'hono/utils/http-status';
import { z } from 'zod';

import { SSOModelPlugin } from './plugin';

export class FacebookSSOApiPlugin
  extends SSOModelPlugin
  implements SSOApiPlugin
{
  constructor({
    clientId,
    clientSecret,
  }: {
    clientId: string;
    clientSecret: string;
  }) {
    super();
    this.clientId = clientId;
    this.clientSecret = clientSecret;
  }

  private readonly clientId: string;
  private readonly clientSecret: string;
  private readonly userSchema = z.object({
    id: z.string(),
    name: z.string(),
    email: z.string(),
  });

  fetchToken = async (code: string) => {
    const url = new URL('https://graph.facebook.com/v22.0/oauth/access_token');
    url.searchParams.set('code', code);
    url.searchParams.set('redirect_uri', this.redirectUri(this.id));
    url.searchParams.set('client_id', this.clientId);
    url.searchParams.set('client_secret', this.clientSecret);
    const res = await fetch(url.toString());
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
  };

  fetchUser = async ({
    access_token,
  }: {
    access_token: string;
    token_type: string;
  }): ReturnType<SSOApiPlugin['fetchUser']> => {
    const url = new URL('https://graph.facebook.com/v22.0/me');
    url.searchParams.set('fields', 'id,name,email');
    url.searchParams.set('access_token', access_token);
    const res = await fetch(url.toString());
    if (!res.ok) {
      throw new HTTPException(+res.status.toString() as ContentfulStatusCode, {
        message: 'Internal error requesting user',
      });
    }
    const { data: userData, error: userError } = this.userSchema.safeParse(
      await res.json(),
    );
    if (userError || !userData) {
      throw new HTTPException(400, {
        message: 'Invalid user response',
      });
    }

    return { ...userData, username: userData.name };
  };

  getUrl = () => {
    const url = new URL('https://www.facebook.com/v22.0/dialog/oauth');
    url.searchParams.set('client_id', this.clientId);
    url.searchParams.set('redirect_uri', this.redirectUri(this.id));
    url.searchParams.set('scope', 'public_profile,email');
    url.searchParams.set('response_type', 'code');
    url.searchParams.set('state', 'isAdmin');

    return url.toString();
  };

  readonly id = 'facebook';
}

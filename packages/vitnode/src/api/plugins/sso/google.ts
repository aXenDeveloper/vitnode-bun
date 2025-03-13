import { SSOApiPlugin } from '@/api/models/sso';
import { SSOModelPlugin } from '@/api/plugins/sso/plugin';
import { HTTPException } from 'hono/http-exception';
import { ContentfulStatusCode } from 'hono/utils/http-status';
import { z } from 'zod';

export class GoogleSSOApiPlugin extends SSOModelPlugin implements SSOApiPlugin {
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
    email: z.string(),
    name: z.string(),
    verified_email: z.boolean(),
  });

  fetchToken = async (code: string) => {
    const res = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'application/json',
      },
      body: new URLSearchParams({
        code,
        redirect_uri: this.redirectUri(this.id),
        grant_type: 'authorization_code',
        client_id: this.clientId,
        client_secret: this.clientSecret,
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
  };

  fetchUser = async ({
    token_type,
    access_token,
  }: {
    access_token: string;
    token_type: string;
  }) => {
    const res = await fetch('https://www.googleapis.com/oauth2/v1/userinfo', {
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

    if (!data.verified_email) {
      throw new HTTPException(400, {
        message: 'Email not verified',
      });
    }

    return {
      ...data,
      username: data.name,
    };
  };

  getUrl = () => {
    const url = new URL('https://accounts.google.com/o/oauth2/auth');
    url.searchParams.set('client_id', this.clientId);
    url.searchParams.set('redirect_uri', this.redirectUri(this.id));
    url.searchParams.set('response_type', 'code');
    url.searchParams.set('scope', 'openid profile email');
    url.searchParams.set('state', 'isAdmin');

    return url.toString();
  };

  readonly id = 'google';
}

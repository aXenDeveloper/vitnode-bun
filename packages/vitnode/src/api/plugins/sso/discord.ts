import { SSOApiPlugin } from '@/api/models/sso';
import { SSOModelPlugin } from '@/api/plugins/sso/plugin';
import { HTTPException } from 'hono/http-exception';
import { ContentfulStatusCode } from 'hono/utils/http-status';

export class DiscordSSOApiPlugin
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
  readonly id = 'discord';

  async fetchToken(code: string) {
    const res = await fetch('https://discord.com/api/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'application/json',
      },
      body: new URLSearchParams({
        code,
        redirect_uri: this.redirectUri('discord'),
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
  }

  async fetchUser({
    token_type,
    access_token,
  }: {
    access_token: string;
    token_type: string;
  }) {
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

  getUrl() {
    const url = new URL('https://discord.com/oauth2/authorize');
    url.searchParams.set('client_id', this.clientId);
    url.searchParams.set('redirect_uri', this.redirectUri('discord'));
    url.searchParams.set('response_type', 'code');
    url.searchParams.set('scope', 'identify email');

    return url.toString();
  }
}

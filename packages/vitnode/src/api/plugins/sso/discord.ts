import { SSOApiPlugin } from '@/api/models/sso';
import { SSOModelPlugin } from '@/api/plugins/sso/plugin';
import { HTTPException } from 'hono/http-exception';
import { ContentfulStatusCode } from 'hono/utils/http-status';
import { z } from 'zod';

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
  private readonly userSchema = z.object({
    id: z.string(),
    email: z.string(),
    username: z.string(),
  });

  fetchToken: SSOApiPlugin['fetchToken'] = async code => {
    const res = await fetch('https://discord.com/api/oauth2/token', {
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

  fetchUser: SSOApiPlugin['fetchUser'] = async ({
    token_type,
    access_token,
  }) => {
    const res = await fetch('https://discord.com/api/users/@me', {
      headers: {
        Authorization: `${token_type} ${access_token}`,
      },
    });
    const { data, error } = this.userSchema.safeParse(await res.json());
    if (error || !data) {
      throw new HTTPException(400, {
        message: 'Invalid user response',
      });
    }

    return data;
  };

  getUrl: SSOApiPlugin['getUrl'] = ({ state }) => {
    const url = new URL('https://discord.com/oauth2/authorize');
    url.searchParams.set('client_id', this.clientId);
    url.searchParams.set('redirect_uri', this.redirectUri(this.id));
    url.searchParams.set('response_type', 'code');
    url.searchParams.set('scope', 'identify email');
    url.searchParams.set('state', state);

    return url.toString();
  };

  readonly id = 'discord';
}

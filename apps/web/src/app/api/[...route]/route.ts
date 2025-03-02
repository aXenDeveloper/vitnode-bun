import { OpenAPIHono } from '@hono/zod-openapi';
import { handle } from 'hono/vercel';
import { VitNodeAPI } from 'vitnode/api/config';
import { DiscordSSOApiPlugin } from 'vitnode/api/plugins/sso/discord';
import { GoogleSSOApiPlugin } from 'vitnode/api/plugins/sso/google';

const app = new OpenAPIHono().basePath('/api');
VitNodeAPI({
  app,
  plugins: [],
  authorization: {
    ssoPlugins: [
      new DiscordSSOApiPlugin({
        clientId: '',
        clientSecret: '',
      }),
      new GoogleSSOApiPlugin({
        clientId: '',
        clientSecret: '',
      }),
    ],
  },
});

export const GET = handle(app);
export const POST = handle(app);
export const PUT = handle(app);
export const DELETE = handle(app);

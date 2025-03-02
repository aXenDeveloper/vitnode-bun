import { OpenAPIHono } from '@hono/zod-openapi';
import { handle } from 'hono/vercel';
import { VitNodeAPI } from 'vitnode/api/config';
import { DiscordSSOApiPlugin } from 'vitnode/api/plugins/sso/discord';

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
    ],
  },
});

export const GET = handle(app);
export const POST = handle(app);
export const PUT = handle(app);
export const DELETE = handle(app);

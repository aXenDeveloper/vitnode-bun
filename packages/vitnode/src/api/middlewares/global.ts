import { Context, Env, Next } from 'hono';

import { SSOApiPlugin } from '../models/sso';

declare module 'hono' {
  interface ContextVariableMap {
    core: {
      authorization: {
        cookie_expires: number;
        cookie_name: string;
        ssoPlugins: SSOApiPlugin[];
      };
    };
  }
}

export const globalMiddleware = ({
  authorization,
}: {
  authorization?: {
    cookie_expires?: number;
    cookie_name?: string;
    ssoPlugins?: SSOApiPlugin[];
  };
}) => {
  return async (c: Context<Env, '*'>, next: Next) => {
    c.set('core', {
      authorization: {
        cookie_name: authorization?.cookie_name ?? 'vitnode-auth',
        cookie_expires:
          authorization?.cookie_expires ?? 1000 * 60 * 60 * 24 * 90, // 90 days
        ssoPlugins: authorization?.ssoPlugins ?? [],
      },
    });

    await next();
  };
};

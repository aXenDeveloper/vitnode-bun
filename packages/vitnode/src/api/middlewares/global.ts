import { Context, Env, Next } from 'hono';

import { SSOApiPlugin } from '../models/sso';

declare module 'hono' {
  interface ContextVariableMap {
    core: {
      authorization: {
        admin_cookie_expires: number;
        admin_cookie_name: string;
        cookie_expires: number;
        cookie_name: string;
        cookie_secure: boolean;
        device_cookie_expires: number;
        device_cookie_name: string;
        ssoPlugins: SSOApiPlugin[];
      };
    };
  }
}

export const globalMiddleware = ({
  authorization,
}: {
  authorization?: {
    admin_cookie_expires?: number;
    admin_cookie_name?: string;
    cookie_expires?: number;
    cookie_name?: string;
    cookie_secure?: boolean;
    device_cookie_expires?: number;
    device_cookie_name?: string;
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
        device_cookie_name:
          authorization?.device_cookie_name ?? 'vitnode-device',
        device_cookie_expires:
          authorization?.device_cookie_expires ?? 1000 * 60 * 60 * 24 * 365, // 1 year,
        admin_cookie_name: authorization?.admin_cookie_name ?? 'vitnode-admin',
        admin_cookie_expires:
          authorization?.admin_cookie_expires ?? 1000 * 60 * 60 * 24 * 1, // 1 day
        cookie_secure: authorization?.cookie_secure ?? true,
      },
    });

    await next();
  };
};

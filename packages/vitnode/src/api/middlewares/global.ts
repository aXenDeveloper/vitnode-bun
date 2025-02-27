import { Context, Env, Next } from 'hono';

declare module 'hono' {
  interface ContextVariableMap {
    core: {
      authorization: {
        cookie_expires: number;
        cookie_name: string;
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
  };
}) => {
  return async (c: Context<Env, '*'>, next: Next) => {
    c.set('core', {
      authorization: {
        cookie_name: authorization?.cookie_name ?? 'vitnode-auth',
        cookie_expires:
          authorization?.cookie_expires ?? 1000 * 60 * 60 * 24 * 90, // 90 days
      },
    });

    await next();
  };
};

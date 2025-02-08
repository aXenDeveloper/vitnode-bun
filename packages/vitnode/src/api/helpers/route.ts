import { createRoute as createRouteHono, RouteConfig } from '@hono/zod-openapi';

import { sessionMiddleware } from '../middlewares/session';

type RoutingPath<P extends string> =
  P extends `${infer Head}/{${infer Param}}${infer Tail}`
    ? `${Head}/:${Param}${RoutingPath<Tail>}`
    : P;

export function createApiRoute<
  R extends Omit<RouteConfig, 'path'> & {
    path: string;
  },
>({
  isAuth,
  ...routeConfig
}: R & {
  isAuth?: boolean;
}): R & {
  getRoutingPath: () => RoutingPath<R['path']>;
} {
  const middlewareFromConfig = routeConfig.middleware
    ? Array.isArray(routeConfig.middleware)
      ? routeConfig.middleware
      : [routeConfig.middleware]
    : [];

  return createRouteHono({
    middleware: isAuth ? [sessionMiddleware(), ...middlewareFromConfig] : [],
    ...routeConfig,
  }) as R & {
    getRoutingPath: () => RoutingPath<R['path']>;
  };
}

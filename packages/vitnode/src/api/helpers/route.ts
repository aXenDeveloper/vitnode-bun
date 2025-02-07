import { createRoute as createRouteHono, RouteConfig } from '@hono/zod-openapi';

import { sessionMiddleware } from '../middleware/session';

export function createApiRoute({
  isAuth,
  ...routeConfig
}: Omit<RouteConfig, 'path'> & {
  isAuth?: boolean;
  path: string;
}): ReturnType<typeof createRouteHono> {
  const middlewareFromConfig = routeConfig.middleware
    ? Array.isArray(routeConfig.middleware)
      ? routeConfig.middleware
      : [routeConfig.middleware]
    : [];

  return createRouteHono({
    middleware: isAuth ? [sessionMiddleware(), ...middlewareFromConfig] : [],
    ...routeConfig,
  });
}

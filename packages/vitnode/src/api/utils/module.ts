import { OpenAPIHono } from '@hono/zod-openapi';
import { Env, Schema } from 'hono';

export interface ModuleApi<
  T extends Schema,
  N extends string,
  P extends string,
> {
  app: OpenAPIHono<Env, T, string>;
  name: N;
  plugin: P;
}

export function createModuleApi<
  S extends Schema,
  N extends string,
  P extends string,
>({
  name,
  plugin,
  routes,
}: {
  name: N;
  plugin: P;
  routes: OpenAPIHono<Env, S, string>;
}): ModuleApi<S, N, P> {
  return {
    app: routes,
    plugin,
    name,
  };
}

import { OpenAPIHono } from '@hono/zod-openapi';
import { Env, Schema } from 'hono';

export interface PluginVitNodeAPI<T extends Schema> {
  name: string;
  root: OpenAPIHono<Env, T, string>;
}

export function createPlugin<T extends Schema>({
  name,
  modules,
}: {
  modules: {
    name: string;
    routes: OpenAPIHono<Env, T, string>;
  }[];
  name: string;
}): PluginVitNodeAPI<T> {
  const root = new OpenAPIHono();
  modules.forEach(({ name, routes }) => {
    root.route(`/${name}`, routes);
  });

  return {
    name,
    root,
  };
}

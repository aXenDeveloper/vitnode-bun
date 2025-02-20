import { ModuleApi } from '@/api/helpers/module';
import { ClientRequest, ClientRequestOptions, hc } from 'hono/client';
import { HonoBase } from 'hono/hono-base';
import { Env, Schema } from 'hono/types';
import { UnionToIntersection } from 'hono/utils/types';

import { CONFIG } from './config';

type PathToChain<
  Path extends string,
  E extends Schema,
  Original extends string = Path,
> = Path extends `/${infer P}`
  ? PathToChain<P, E, Path>
  : Path extends `${infer P}/${infer R}`
    ? {
        [K in P]: PathToChain<R, E, Original>;
      }
    : Record<
        Path extends '' ? 'index' : Path,
        ClientRequest<E extends Record<string, unknown> ? E[Original] : never>
      >;

type Client<T> =
  T extends HonoBase<Env, infer S, string>
    ? S extends Record<infer K, Schema>
      ? K extends string
        ? PathToChain<K, S>
        : never
      : never
    : never;

export function fetcher<T extends ModuleApi<Schema, string, string>>({
  plugin,
  module,
  options,
}: {
  module: T['name'];
  options?: ClientRequestOptions;
  plugin: T['plugin'];
}): UnionToIntersection<Client<T['app']>> {
  const url = new URL(`/api/${plugin}/${module}`, CONFIG.backend.origin);
  const client = hc<T['app']>(url.href, {
    ...options,
  });

  return client as unknown as UnionToIntersection<Client<T['app']>>;
}

type SchemaOf<T extends ModuleApi<Schema, string, string>> =
  T extends ModuleApi<infer S, string, string> ? S : never;

type MethodsForEndpoint<
  T extends ModuleApi<Schema, string, string>,
  P extends keyof SchemaOf<T>,
> = {
  [K in Extract<keyof SchemaOf<T>[P], `$${string}`>]: K extends `$${infer U}`
    ? Lowercase<U>
    : never;
}[Extract<keyof SchemaOf<T>[P], `$${string}`>];

export type FetcherInput<
  T extends ModuleApi<Schema, string, string>,
  P extends keyof SchemaOf<T>,
  M extends MethodsForEndpoint<T, P>,
> = {
  [K in Extract<keyof SchemaOf<T>[P], `$${string}`>]: Lowercase<
    K extends `$${infer U}` ? U : never
  > extends M
    ? SchemaOf<T>[P][K] extends { input: infer I }
      ? I
      : never
    : never;
}[Extract<keyof SchemaOf<T>[P], `$${string}`>];

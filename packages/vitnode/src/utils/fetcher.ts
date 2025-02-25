import { ModuleApi } from '@/api/utils/module';
import { ClientRequest, ClientResponse, hc } from 'hono/client';
import { HonoBase } from 'hono/hono-base';
import { Env, ResponseFormat, Schema } from 'hono/types';
import { StatusCode } from 'hono/utils/http-status';
import { UnionToIntersection } from 'hono/utils/types';
import { cookies, headers } from 'next/headers';

import { CONFIG } from './config';
import { cookieFromStringToObject } from './cookie-from-string-to-object';

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

export async function fetcher<T extends ModuleApi<Schema, string, string>>({
  plugin,
  module,
  options,
}: {
  module: T['name'];
  options?: Omit<RequestInit, 'body'>;
  plugin: T['plugin'];
}): Promise<UnionToIntersection<Client<T['app']>>> {
  const url = new URL(`/api/${plugin}/${module}`, CONFIG.backend.origin);
  const [nextInternalHeaders, cookie] = await Promise.all([
    headers(),
    cookies(),
  ]);

  const internalHeaders = {
    Cookie: cookie.toString(),
    ['user-agent']: nextInternalHeaders.get('user-agent') ?? 'node',
    ['x-forwarded-for']:
      nextInternalHeaders.get('x-forwarded-for') ?? '0.0.0.0',
    // 'x-vitnode-user-language': cookie.get('NEXT_LOCALE')?.value ?? 'en',
  };

  const client = hc<T['app']>(url.href, {
    fetch: async (input, requestInit) => {
      return await fetch(input, {
        ...requestInit,
        ...options,
        headers: {
          ...internalHeaders,
          ...options?.headers,
          ...requestInit?.headers,
        },
      });
    },
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

export async function handleSetCookiesFetcher<
  T,
  U extends number = StatusCode,
  F extends ResponseFormat = string,
>(res: ClientResponse<T, U, F>) {
  await Promise.all(
    cookieFromStringToObject(res.headers.getSetCookie()).map(async cookie => {
      const key = Object.keys(cookie)[0];
      const value = Object.values(cookie)[0];

      if (typeof value !== 'string' || typeof key !== 'string') return;

      (await cookies()).set(key, value, {
        domain: cookie.Domain,
        path: cookie.Path,
        expires: new Date(cookie.Expires),
        secure: cookie.Secure,
        httpOnly: cookie.HttpOnly,
        sameSite: cookie.SameSite,
      });
    }),
  );
}

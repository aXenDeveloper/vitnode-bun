import { ModuleApi } from '@/api/helpers/module';
import { Schema } from 'hono/types';
import { CONFIG } from './config';

type MethodKeys<T> = Extract<keyof T, `$${string}`>;
type InputProp<I> = [keyof I] extends [never]
  ? { input?: never }
  : { input: I }; // Required to make input optional when it's not present

type FetcherConfig<T extends ModuleApi<Schema, string, string>> =
  T extends ModuleApi<infer S, string, string>
    ? {
        [P in keyof S]: {
          [K in MethodKeys<S[P]>]: (S[P][K] extends { input: infer I }
            ? InputProp<I>
            : { input: never }) & {
            method: K extends `$${infer U}` ? Lowercase<U> : never;
            module: T['name'];
            path: P;
            plugin: T['plugin'];
          };
        }[MethodKeys<S[P]>];
      }[keyof S]
    : never;

export async function fetcher<T extends ModuleApi<Schema, string, string>>({
  path,
  method,
  input: inputFromArgs,
  plugin,
  module,
}: FetcherConfig<T>) {
  const input: null | { json?: object } = inputFromArgs ?? null;
  const url = new URL(`/api${path}/${plugin}/${module}`, CONFIG.backend.origin);

  const res = await fetch(url.href, {
    method,
    body: JSON.stringify(input?.json),
  });
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

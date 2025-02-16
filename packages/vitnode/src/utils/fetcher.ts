import { ModuleApi } from '@/api/helpers/module';
import { Schema } from 'hono/types';

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
}: FetcherConfig<T>) {
  const input: null | { json?: object } = inputFromArgs ?? null;

  const res = await fetch(path, {
    method,
    body: JSON.stringify(input?.json),
  });
}

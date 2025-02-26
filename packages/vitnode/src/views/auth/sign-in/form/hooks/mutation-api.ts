'use server';

import { UsersTypes } from '@/api/modules/users/users.module';
import { fetcher, FetcherInput, handleSetCookiesFetcher } from '@/lib/fetcher';

export const mutationApi = async (
  input: FetcherInput<UsersTypes, '/sign_in', 'post'>,
) => {
  const res = await fetcher<UsersTypes>({
    plugin: 'core',
    module: 'users',
  });

  const data = await res.sign_in.$post(input);
  await handleSetCookiesFetcher(data);

  if (data.status === 403) {
    return { message: 'access_denied' } as const;
  }

  if (data.status !== 200) {
    return { message: 'Internal Server Error' } as const;
  }
};

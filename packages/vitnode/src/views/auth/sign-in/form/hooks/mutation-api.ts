'use server';

import { UsersTypes } from '@/api/core/users/routes';
import { fetcher, FetcherInput } from '@/helpers/fetcher';

export const mutationApi = async (
  input: FetcherInput<UsersTypes, '/sign_in', 'post'>,
) => {
  const data = await fetcher<UsersTypes>({
    plugin: 'core',
    module: 'users',
  }).sign_in.$post(input);

  if (data.status === 403) {
    return { message: 'access_denied' } as const;
  }

  if (data.status !== 200) {
    return { message: 'Internal Server Error' } as const;
  }
};

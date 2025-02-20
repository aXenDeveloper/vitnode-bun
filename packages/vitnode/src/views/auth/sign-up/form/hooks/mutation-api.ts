'use server';

import { UsersTypes } from '@/api/core/users/routes';
import { fetcher, FetcherInput } from '@/helpers/fetcher';

export const mutationApi = async (
  input: FetcherInput<UsersTypes, '/sign_up', 'post'>,
) => {
  const data = await fetcher<UsersTypes>({
    plugin: 'core',
    module: 'users',
  }).sign_up.$post(input);

  if (data.status !== 200) {
    return { message: await data.text() };
  }
};

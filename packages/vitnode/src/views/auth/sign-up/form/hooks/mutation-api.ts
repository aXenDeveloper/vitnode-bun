'use server';

import { UsersTypes } from '@/api/core/users/routes';
import { fetcher, FetcherInput } from '@/helpers/fetcher';

export const mutationApi = async (
  input: FetcherInput<UsersTypes, '/sign_up', 'post'>,
) => {
  await fetcher<UsersTypes>({
    path: '/sign_up',
    plugin: 'core',
    module: 'users',
    method: 'post',
    input: input,
  });
};

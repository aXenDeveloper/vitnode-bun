'use server';

import { UsersTypes } from '@/api/core/users/module';
import { fetcher, FetcherInput } from '@/utils/fetcher';

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

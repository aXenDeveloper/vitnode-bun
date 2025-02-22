'use server';

import { UsersTypes } from '@/api/modules/users/users.module';
import { fetcher, FetcherInput } from '@/utils/fetcher';

export const mutationApi = async (
  input: FetcherInput<UsersTypes, '/sign_in', 'post'>,
) => {
  const res = await fetcher<UsersTypes>({
    plugin: 'core',
    module: 'users',
  });
  const data = await res.sign_in.$post(input);

  if (data.status === 403) {
    return { message: 'access_denied' } as const;
  }

  if (data.status !== 200) {
    return { message: 'Internal Server Error' } as const;
  }
};

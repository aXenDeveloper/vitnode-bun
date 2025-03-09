import { UsersTypes } from '@/api/modules/users/users.module';

import { fetcher } from '../fetcher';

export const getSessionApi = async () => {
  const client = await fetcher<UsersTypes>({
    plugin: 'core',
    module: 'users',
    options: {
      cache: 'force-cache',
    },
  });

  return await client.session.$get();
};

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

  const data = await client.session.$get();

  return data.json();
};

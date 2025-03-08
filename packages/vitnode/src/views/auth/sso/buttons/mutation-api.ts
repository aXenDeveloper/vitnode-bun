'use server';

import { UsersTypes } from '@/api/modules/users/users.module';
import { fetcher } from '@/lib/fetcher';
import { redirect } from '@/lib/navigation';

export const mutationApi = async (providerId: string) => {
  const client = await fetcher<UsersTypes>({
    plugin: 'core',
    module: 'users',
  });

  const res = await client.sso[':providerId'].$post({
    param: { providerId },
  });

  if (res.status !== 200) {
    return { message: 'Something is wrong' };
  }

  const data = await res.json();
  await redirect(data.url);
};

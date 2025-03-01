'use server';

import { UsersTypes } from '@/api/modules/users/users.module';
import { fetcher } from '@/lib/fetcher';
import { redirect } from '@/lib/navigation';

export const mutationApi = async (providerId: string) => {
  const client = await fetcher<UsersTypes>({
    plugin: 'core',
    module: 'users',
  });

  const req = await client.sso[':providerId'].$post({
    param: { providerId },
  });
  if (req.status === 200) {
    const data = await req.json();

    await redirect(data.url);
  }
};

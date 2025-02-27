'use server';

import { UsersTypes } from '@/api/modules/users/users.module';
import { fetcher, handleSetCookiesFetcher } from '@/lib/fetcher';
import { revalidatePath } from 'next/cache';

export const mutationApi = async () => {
  const res = await fetcher<UsersTypes>({
    plugin: 'core',
    module: 'users',
  });
  const data = await res.sign_out.$delete();
  await handleSetCookiesFetcher(data);
  revalidatePath('/', 'layout');
};

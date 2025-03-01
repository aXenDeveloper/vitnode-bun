'use server';

import { UsersTypes } from '@/api/modules/users/users.module';
import { fetcher, FetcherInput, handleSetCookiesFetcher } from '@/lib/fetcher';
import { redirect } from '@/lib/navigation';
import { revalidatePath } from 'next/cache';

export const mutationApi = async (
  input: FetcherInput<UsersTypes, '/sso/:providerId/sign_up', 'post'>,
) => {
  const res = await fetcher<UsersTypes>({
    plugin: 'core',
    module: 'users',
  });
  const data = await res.sso[':providerId'].sign_up.$post(input);

  if (data.status !== 200) {
    return { message: await data.text() };
  }

  await handleSetCookiesFetcher(data);
  revalidatePath('/[locale]/(main)', 'layout');
  await redirect('/');
};

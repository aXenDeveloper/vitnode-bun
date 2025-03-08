import { UsersTypes } from '@/api/modules/users/users.module';
import { fetcher } from '@/lib/fetcher';
import { ErrorView } from '@/views/error/error-view';
import { getTranslations } from 'next-intl/server';

import { ClientCallbackSSO } from './client/client';

export const CallbackSSOView = async ({
  providerId,
  searchParams,
}: {
  providerId: string;
  searchParams: Promise<Record<string, string>>;
}) => {
  const [{ code, error }, t, client] = await Promise.all([
    searchParams,
    getTranslations('core.auth.sso'),
    fetcher<UsersTypes>({
      plugin: 'core',
      module: 'users',
    }),
  ]);
  const res = await client.sso[':providerId'].callback.$get({
    param: { providerId },
    query: {
      code,
    },
  });

  if (error === 'access_denied') {
    return <ErrorView code={403} customDescription={t('access_denied')} />;
  }

  if (res.status !== 200) {
    return <ErrorView code={res.status} />;
  }

  return (
    <ClientCallbackSSO
      code={code}
      cookiesToSave={res.headers.getSetCookie()}
      providerId={providerId}
    />
  );
};

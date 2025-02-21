import { CardDescription } from '@/components/ui/card';
import { Link } from '@/helpers/navigation';
import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import { Metadata } from 'next/dist/types';

import { FormSignIn } from './form/form';

export const generateMetadataSignInView = async (): Promise<Metadata> => {
  const t = await getTranslations('core.global');

  return {
    title: t('login'),
  };
};

export const SignInView = () => {
  const t = useTranslations('core.auth.sign_in');
  const tGlobal = useTranslations('core.global');

  return (
    <div className="mx-auto max-w-md px-4 py-10">
      <div className="mb-10 space-y-2 text-center">
        <h1 className="text-3xl font-semibold leading-none tracking-tight">
          {tGlobal('login')}
        </h1>
        <CardDescription>
          {t.rich('desc', {
            link: text => (
              <Link className="text-primary" href="/register">
                {text}
              </Link>
            ),
          })}
        </CardDescription>
      </div>

      <FormSignIn />
    </div>
  );
};

import { Card, CardDescription } from '@/components/ui/card';
import { Link } from '@/lib/navigation';
import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import { Metadata } from 'next/dist/types';

import { SSOButtons } from '../sso/sso-buttons';
import { FormSignUp } from './form/form';

export const generateMetadataSignUpView = async (
  locale: string,
): Promise<Metadata> => {
  const t = await getTranslations({ locale, namespace: 'core.global' });

  return {
    title: t('register'),
  };
};

export const SignUpView = () => {
  const t = useTranslations('core.auth.sign_up');
  const tGlobal = useTranslations('core.global');

  return (
    <div className="mx-auto max-w-md px-4 py-10">
      <div className="mb-10 space-y-2 text-center">
        <h1 className="text-3xl font-semibold leading-none tracking-tight">
          {tGlobal('register')}
        </h1>
        <CardDescription>
          {t.rich('desc', {
            link: text => (
              <Link className="text-primary" href="/login">
                {text}
              </Link>
            ),
          })}
        </CardDescription>
      </div>

      <Card className="p-6">
        <FormSignUp />
        <SSOButtons />
      </Card>
    </div>
  );
};

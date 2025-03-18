import { Card, CardDescription } from '@/components/ui/card';
import { Link } from '@/lib/navigation';
import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import { Metadata } from 'next/dist/types';

import { SSOButtons } from '../sso/buttons/sso-buttons';
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
      <Card className="bg-muted gap-0 p-0">
        <div className="bg-card rounded-xl p-6">
          <div className="mb-10 space-y-2 text-center">
            <h1 className="text-2xl font-semibold leading-none tracking-tight">
              {tGlobal('register')}
            </h1>
            <CardDescription>{t('desc')}</CardDescription>
          </div>
          <FormSignUp />
          <SSOButtons />
        </div>

        <div className="text-accent-foreground p-6 text-center text-sm">
          {t.rich('already_have_account', {
            link: text => (
              <Link className="font-semibold" href="/login">
                {text}
              </Link>
            ),
          })}
        </div>
      </Card>
    </div>
  );
};

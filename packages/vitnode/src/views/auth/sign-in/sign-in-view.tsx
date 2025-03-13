import { Card, CardDescription } from '@/components/ui/card';
import { Link } from '@/lib/navigation';
import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import { Metadata } from 'next/dist/types';

import { SSOButtons } from '../sso/buttons/sso-buttons';
import { FormSignIn } from './form/form';

export const generateMetadataSignInView = async (
  locale: string,
): Promise<Metadata> => {
  const t = await getTranslations({ locale, namespace: 'core.global' });

  return {
    title: t('login'),
  };
};

export const SignInView = () => {
  const t = useTranslations('core.auth.sign_in');
  const tGlobal = useTranslations('core.global');

  return (
    <div className="mx-auto max-w-md px-4 py-10">
      <Card className="bg-muted p-0">
        <div className="bg-card rounded-xl p-6">
          <div className="mb-10 space-y-2 text-center">
            <h1 className="text-2xl font-semibold leading-none tracking-tight">
              {tGlobal('login')}
            </h1>
            <CardDescription>{t('desc')}</CardDescription>
          </div>

          <FormSignIn />
          <SSOButtons />
        </div>

        <div className="text-accent-foreground p-6 text-center text-sm">
          {t.rich('do_not_have_account', {
            link: text => (
              <Link className="font-semibold" href="/register">
                {text}
              </Link>
            ),
          })}
        </div>
      </Card>
    </div>
  );
};

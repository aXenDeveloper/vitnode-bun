import { Card, CardDescription } from '@/components/ui/card';
import { getTranslations } from 'next-intl/server';

import { FormSignUpSSO } from './form';

export const SignUpSSOView = async (
  props: React.ComponentProps<typeof FormSignUpSSO>,
) => {
  const t = await getTranslations('core.auth.sso.sign_up');

  return (
    <div className="mx-auto max-w-md space-y-4 px-4 py-10">
      <div className="mb-10 space-y-2 text-center">
        <h1 className="text-3xl font-semibold leading-none tracking-tight">
          {t('title')}
        </h1>
        <CardDescription>
          {t.rich('desc', {
            email: () => (
              <span className="text-foreground font-medium">test@test.com</span>
            ),
          })}
        </CardDescription>
      </div>

      <Card className="space-y-4 p-6">
        <FormSignUpSSO {...props} />
      </Card>
    </div>
  );
};

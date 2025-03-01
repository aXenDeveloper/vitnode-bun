import { useTranslations } from 'next-intl';

import { ButtonSSOButtons } from './client';

export const SSOButtons = () => {
  const t = useTranslations('core.global');

  return (
    <>
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-card text-muted-foreground px-4">{t('or')}</span>
        </div>
      </div>

      <div className="space-y-4">
        <ButtonSSOButtons providerId="discord">Discord</ButtonSSOButtons>
        <ButtonSSOButtons providerId="facebook">Facebook</ButtonSSOButtons>
        <ButtonSSOButtons providerId="google">Google</ButtonSSOButtons>
        <ButtonSSOButtons providerId="github">GitHub</ButtonSSOButtons>
      </div>
    </>
  );
};

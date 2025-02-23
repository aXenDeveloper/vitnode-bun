import { Button } from '@/components/ui/button';
import { Link } from '@/utils/navigation';
import { ArrowLeft } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { BackButtonNotFound } from './back-button';

export const NotFoundView = () => {
  const t = useTranslations('core.not_found');

  return (
    <div className="flex flex-col items-center justify-center px-4 py-10 sm:py-20">
      <div className="max-w-xl text-center">
        <h1 className="text-9xl font-bold">404</h1>
        <h2 className="mt-4 text-4xl font-semibold">{t('title')}</h2>
        <p className="text-muted-foreground mb-8 mt-4">{t('desc')}</p>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <BackButtonNotFound>
            <ArrowLeft />
            {t('go_back')}
          </BackButtonNotFound>
          <Button asChild size="lg">
            <Link href="/">{t('back_home')}</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

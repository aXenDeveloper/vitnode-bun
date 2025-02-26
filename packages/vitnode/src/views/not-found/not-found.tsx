import { Button } from '@/components/ui/button';
import { Link } from '@/lib/navigation';
import { ArrowLeft, HomeIcon } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

import { BackButtonNotFound } from './back-button';

export const NotFoundView = async () => {
  const t = await getTranslations('core.not_found');

  return (
    <div className="flex flex-col items-center justify-center px-4 py-10 sm:py-20">
      <div className="max-w-md space-y-6 text-center">
        <div className="space-y-2">
          <h1 className="text-primary text-8xl font-bold">404</h1>
          <h2 className="text-2xl font-medium">{t('title')}</h2>
          <p className="text-muted-foreground">{t('desc')}</p>
        </div>

        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
          <BackButtonNotFound>
            <ArrowLeft />
            {t('go_back')}
          </BackButtonNotFound>

          <Button asChild size="lg">
            <Link href="/">
              <HomeIcon />
              {t('back_home')}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

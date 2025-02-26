import { Button } from '@/components/ui/button';
import { getSessionApi } from '@/lib/api/get-session-api';
import { Link } from '@/lib/navigation';
import { getTranslations } from 'next-intl/server';

export const UserHeader = async () => {
  const [t, data] = await Promise.all([
    getTranslations('core.global'),
    getSessionApi(),
  ]);

  if (!data.user) {
    return (
      <>
        <Button asChild variant="ghost">
          <Link href="/login">{t('login')}</Link>
        </Button>
        <Button asChild>
          <Link href="/register">{t('register')}</Link>
        </Button>
      </>
    );
  }

  return <div>auth</div>;
};

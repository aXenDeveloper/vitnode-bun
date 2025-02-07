import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';

export default function Page() {
  const t = useTranslations('core');

  return (
    <div>
      <h1>{t('example')} XDDD</h1>
      <Link href="/">{t('example')}</Link>
    </div>
  );
}

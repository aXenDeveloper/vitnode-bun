import { useTranslations } from 'next-intl';
import { Link } from 'vitnode/utils/navigation';

export default function Home() {
  const t = useTranslations('core.global');

  return (
    <div>
      <Link href="/register">{t('register')}</Link>
    </div>
  );
}

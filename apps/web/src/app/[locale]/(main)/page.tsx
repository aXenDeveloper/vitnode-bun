import { getTranslations } from 'next-intl/server';
import { Link } from 'vitnode/lib/navigation';

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const t = await getTranslations({ locale, namespace: 'core.global' });

  return (
    <div className="container mx-auto p-4">
      <Link href="/admin">{t('loading')} + admin</Link>
    </div>
  );
}

import { getTranslations } from 'next-intl/server';
import { LogoVitNode } from 'vitnode/components/logo-vitnode';
import { Button } from 'vitnode/components/ui/button';
import { Link } from 'vitnode/lib/navigation';

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'welcome.home' });

  return (
    <main className="container mx-auto flex max-w-2xl flex-col items-center justify-center gap-16 px-4 py-16 text-center">
      <div className="max-w-md space-y-4">
        <h1 className="text-balance text-3xl font-bold tracking-tight md:text-4xl">
          {t('title')}
        </h1>

        <p className="text-muted-foreground text-pretty">{t('desc')}</p>

        <div className="flex flex-wrap items-center justify-center gap-2 md:gap-4">
          <Button asChild>
            <Link href="/admin" target="_blank">
              {t('go_to_admin_cp')}
            </Link>
          </Button>

          <Button asChild variant="ghost">
            <Link
              href="https://vitnode.com/docs"
              rel="noopener noreferrer"
              target="_blank"
            >
              {t('read_our_docs')}
            </Link>
          </Button>
        </div>
      </div>

      <LogoVitNode className="w-44" />
    </main>
  );
}

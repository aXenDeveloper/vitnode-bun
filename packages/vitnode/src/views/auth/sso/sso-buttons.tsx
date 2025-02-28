import { Button } from '@/components/ui/button';
import { Link } from '@/lib/navigation';
import { useTranslations } from 'next-intl';

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
        <Button asChild className="bg-card w-full" variant="outline">
          <Link href={`/login/sso/facebook`}>Facebook</Link>
        </Button>

        <Button asChild className="bg-card w-full" variant="outline">
          <Link href={`/login/sso/google`}>Google</Link>
        </Button>

        <Button asChild className="bg-card w-full" variant="outline">
          <Link href={`/login/sso/google`}>GitHub</Link>
        </Button>
      </div>
    </>
  );
};

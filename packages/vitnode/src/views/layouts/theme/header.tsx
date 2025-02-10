import { ThemeSwitcher } from '@/components/switchers/theme-switcher';
import { Button } from '@/components/ui/button';
import { Link } from '@/utils/navigation';
import { useTranslations } from 'next-intl';

export const HeaderLayout = ({ logo }: { logo: React.ReactNode }) => {
  const t = useTranslations('core.global');

  return (
    <header className="bg-background/75 top-0 z-20 w-full border-b backdrop-blur sm:sticky">
      <div className="container mx-auto flex items-center p-4">
        <Link href="/">{logo}</Link>

        <div className="ml-auto flex items-center gap-2">
          <ThemeSwitcher />
          <Button asChild>
            <Link href="/register">{t('register')}</Link>
          </Button>
        </div>
      </div>
    </header>
  );
};

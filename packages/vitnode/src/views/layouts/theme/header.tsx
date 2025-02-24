import { ThemeSwitcher } from '@/components/switchers/theme-switcher';
import { Button } from '@/components/ui/button';
import { cn } from '@/utils/cn';
import { Link } from '@/utils/navigation';
import { useTranslations } from 'next-intl';

export const HeaderLayout = ({
  logo,
  className,
  ...props
}: React.ComponentProps<'header'> & { logo: React.ReactNode }) => {
  const t = useTranslations('core.global');

  return (
    <header
      className={cn(
        'bg-background/75 top-0 z-20 w-full border-b backdrop-blur sm:sticky',
        className,
      )}
      {...props}
    >
      <div className="container mx-auto flex h-14 items-center px-4">
        <Link href="/">{logo}</Link>

        <div className="ml-auto flex items-center gap-2">
          <ThemeSwitcher />
          <Button asChild variant="ghost">
            <Link href="/login">{t('login')}</Link>
          </Button>
          <Button asChild>
            <Link href="/register">{t('register')}</Link>
          </Button>
        </div>
      </div>
    </header>
  );
};

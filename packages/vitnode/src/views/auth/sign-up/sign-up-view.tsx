import { CardDescription } from '@/components/ui/card';
import { Link } from '@/utils/navigation';
import { useTranslations } from 'next-intl';

export const SignUpView = () => {
  const t = useTranslations('core.auth.sign_up');
  const tGlobal = useTranslations('core.global');

  return (
    <div className="mx-auto max-w-xl px-4 py-10">
      <div className="mb-10 space-y-2 text-center">
        <h1 className="text-3xl font-semibold leading-none tracking-tight">
          {tGlobal('register')}
        </h1>
        <CardDescription>
          {t.rich('desc', {
            link: text => <Link href="/login">{text}</Link>,
          })}
        </CardDescription>
      </div>
    </div>
  );
};

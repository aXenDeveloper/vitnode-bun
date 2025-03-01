'use client';

import { Checkbox } from '@/components/ui/checkbox';
import {
  Form,
  FormButtonSubmit,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Link } from '@/lib/navigation';
import { removeSpecialCharacters } from '@/lib/special-characters';
import { useTranslations } from 'next-intl';

import { useFormSignUpSSO } from './hooks/use-form';

export const FormSignUpSSO = (props: {
  access_token: string;
  providerId: string;
  token_type: string;
  username?: string;
}) => {
  const t = useTranslations('core.auth.sign_up');
  const { form, onSubmit } = useFormSignUpSSO(props);

  return (
    <Form form={form} onSubmit={onSubmit}>
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('username.label')}</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            {field.value.length >= 3 && (
              <div className="text-muted-foreground text-sm">
                {t.rich('username.your_user_code', {
                  code: () => (
                    <span className="text-foreground">
                      {removeSpecialCharacters(field.value)}
                    </span>
                  ),
                })}
              </div>
            )}
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="terms"
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel>{t('terms.label')}</FormLabel>
              <FormDescription>
                {t.rich('terms.desc', {
                  link: text => (
                    <Link className="text-primary" href="/terms">
                      {text}
                    </Link>
                  ),
                })}
              </FormDescription>
              <FormMessage />
            </div>
          </FormItem>
        )}
      />

      <FormButtonSubmit className="w-full">{t('submit')}</FormButtonSubmit>
    </Form>
  );
};

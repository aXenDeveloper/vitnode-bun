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
import { Link } from '@/utils/navigation';
import { useTranslations } from 'next-intl';

import { PasswordInput } from '../../components/password-input';
import { useFormSignUp } from './hooks/use-form';

export const FormSignUp = () => {
  const t = useTranslations('core.auth.sign_up');
  const { form, onSubmit } = useFormSignUp();

  return (
    <Form form={form} onSubmit={onSubmit}>
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('username.label')}</FormLabel>
            <FormControl>
              <Input className="bg-card" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('email.label')}</FormLabel>
            <FormControl>
              <Input className="bg-card" type="email" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="password"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('password.label')}</FormLabel>
            <FormControl>
              <PasswordInput className="bg-card" {...field} />
            </FormControl>
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

      <FormField
        control={form.control}
        name="newsletter"
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel optional>{t('newsletter.label')}</FormLabel>
              <FormDescription>{t('newsletter.desc')}</FormDescription>
              <FormMessage />
            </div>
          </FormItem>
        )}
      />

      <FormButtonSubmit className="w-full">{t('submit')}</FormButtonSubmit>
    </Form>
  );
};

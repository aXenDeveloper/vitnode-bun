'use client';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Form,
  FormButtonSubmit,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { AlertCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { useFormSignIn } from './hooks/use-form';

export const FormSignIn = () => {
  const t = useTranslations('core.auth.sign_in');
  const tSignUp = useTranslations('core.auth.sign_up');
  const { form, onSubmit, error } = useFormSignIn();

  return (
    <>
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="size-4" />
          <AlertTitle>{t(`errors.${error}.title`)}</AlertTitle>
          <AlertDescription>{t(`errors.${error}.desc`)}</AlertDescription>
        </Alert>
      )}

      <Form form={form} onSubmit={onSubmit}>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{tSignUp('email.label')}</FormLabel>
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
              <FormLabel>{tSignUp('password.label')}</FormLabel>
              <FormControl>
                <Input className="bg-card" type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormButtonSubmit className="w-full">{t('submit')}</FormButtonSubmit>
      </Form>
    </>
  );
};

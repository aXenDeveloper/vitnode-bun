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

export const FormSignIn = ({ isAdmin }: { isAdmin?: boolean }) => {
  const t = useTranslations('core.auth.sign_in');
  const { form, onSubmit, error } = useFormSignIn({ isAdmin });

  return (
    <div className="space-y-4">
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
              <FormLabel>{t('email.label')}</FormLabel>
              <FormControl>
                <Input type="email" {...field} />
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
              <FormLabel>{t('password')}</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormButtonSubmit className="w-full">{t('submit')}</FormButtonSubmit>
      </Form>
    </div>
  );
};

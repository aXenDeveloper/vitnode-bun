'use client';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { PasswordInput } from '../../components/password-input';
import { useFormSignUp } from './hooks/use-form';

export const FormSignUp = () => {
  const t = useTranslations('core.auth.sign_up');
  const { formSchema } = useFormSignUp();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: 'onBlur',
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    // eslint-disable-next-line no-console
    console.log(values);
  };

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
    </Form>
  );
};

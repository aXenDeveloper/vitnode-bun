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
import { Link } from '@/helpers/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { PasswordInput } from '../../components/password-input';
import { mutationApi } from './hooks/mutation-api';
import { useFormSignUp } from './hooks/use-form';

export const FormSignUp = () => {
  const t = useTranslations('core.auth.sign_up');
  const tError = useTranslations('core.global.errors');
  const { formSchema } = useFormSignUp();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: 'onBlur',
    defaultValues: {
      name: '',
      email: '',
      password: '',
      terms: false,
      newsletter: false,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const mutation = await mutationApi({
      json: values,
    });
    if (!mutation?.message) {
      return toast('Event has been created.');
    }

    const errorMessages = {
      'Email already exists': {
        field: 'email',
        message: t('email.exists'),
      },
      'Name already exists': {
        field: 'name',
        message: t('username.exists'),
      },
    } as const;

    const errorConfig =
      errorMessages[mutation.message as keyof typeof errorMessages];

    if (errorConfig) {
      form.setError(errorConfig.field, {
        type: 'manual',
        message: errorConfig.message,
      });

      return;
    }

    toast.error(tError('title'), {
      description: tError('internal_server_error'),
    });
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

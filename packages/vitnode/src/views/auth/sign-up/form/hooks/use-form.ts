import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { mutationApi } from './mutation-api';

export const useFormSignUp = () => {
  const t = useTranslations('core.auth.sign_up');
  const tError = useTranslations('core.global.errors');
  const invalidPassword = t('password.invalid');
  const formSchema = z.object({
    name: z
      .string()
      .min(3, t('username.min_length'))
      .max(32, t('username.max_length')),
    // .refine(value => nameRegex.test(value), t('name.invalid'))
    email: z.string().email(t('email.invalid')),
    password: z
      .string()
      .regex(/^.{8,}$/, invalidPassword)
      .regex(/[A-Z]/, invalidPassword)
      .regex(/\d/, invalidPassword)
      .regex(/\W|_/, invalidPassword),
    terms: z.boolean().refine(value => value, t('terms.required')),
    newsletter: z.boolean().optional(),
  });

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
      form.setError(
        errorConfig.field,
        {
          type: 'manual',
          message: errorConfig.message,
        },
        {
          shouldFocus: true,
        },
      );

      return;
    }

    toast.error(tError('title'), {
      description: tError('internal_server_error'),
    });
  };

  return { form, onSubmit };
};

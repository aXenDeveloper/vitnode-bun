import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import React from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { mutationApi } from './mutation-api';

export const useFormSignIn = ({ isAdmin }: { isAdmin?: boolean }) => {
  const [error, setError] = React.useState<'' | 'access_denied'>('');
  const t = useTranslations('core.auth.sign_in');
  const tErrors = useTranslations('core.global.errors');
  const formSchema = z.object({
    email: z.string().email({ message: t('email.invalid') }),
    password: z.string(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setError('');
    const mutation = await mutationApi({
      json: { ...values, isAdmin },
    });

    if (!mutation?.message) return;
    if (mutation?.message !== 'Internal Server Error') {
      setError(mutation.message);

      return;
    }

    toast.error(tErrors('title'), {
      description: tErrors('internal_server_error'),
    });
  };

  return { form, onSubmit, error };
};

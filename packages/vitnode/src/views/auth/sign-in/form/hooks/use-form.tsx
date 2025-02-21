import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import React from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { mutationApi } from './mutation-api';

export const useFormSignIn = () => {
  const [error, setError] = React.useState<'' | 'access_denied'>('');
  const t = useTranslations('core.global.errors');
  const formSchema = z.object({
    email: z.string().email(),
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
      json: values,
    });

    if (!mutation?.message) {
      return;
    }

    if (mutation?.message !== 'Internal Server Error') {
      setError(mutation.message);

      return;
    }

    toast.error(t('title'), {
      description: t('internal_server_error'),
    });
  };

  return { form, onSubmit, error };
};

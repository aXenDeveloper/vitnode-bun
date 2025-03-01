import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { FormSignUpSSO } from '../form';
import { mutationApi } from './mutation-api';

export const useFormSignUpSSO = ({
  username,
  access_token,
  token_type,
  providerId,
}: React.ComponentProps<typeof FormSignUpSSO>) => {
  const t = useTranslations('core.auth.sign_up');
  const tError = useTranslations('core.global.errors');
  const formSchema = z.object({
    name: z
      .string()
      .min(3, t('username.min_length'))
      .max(32, t('username.max_length')),
    // .refine(value => nameRegex.test(value), t('name.invalid'))
    terms: z.boolean().refine(value => value, t('terms.required')),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: 'onBlur',
    defaultValues: {
      name: username ?? '',
      terms: false,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const mutation = await mutationApi({
      json: {
        name: values.name,
        access_token,
        token_type,
      },
      param: {
        providerId,
      },
    });
    if (!mutation?.message) return;

    if (mutation.message === 'Name already exists') {
      form.setError(
        'name',
        {
          type: 'manual',
          message: t('username.exists'),
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

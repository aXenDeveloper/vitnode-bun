import { useTranslations } from 'next-intl';
import { z } from 'zod';

export const useFormSignUp = () => {
  const t = useTranslations('core.auth.sign_up');
  const invalidPassword = t('password.invalid');
  const formSchema = z.object({
    name: z
      .string()
      .min(3, t('username.min_length'))
      .max(32, t('username.max_length'))
      // .refine(value => nameRegex.test(value), t('name.invalid'))
      .default(''),
    email: z.string().email(t('email.invalid')).default(''),
    password: z
      .string()
      .regex(/^.{8,}$/, invalidPassword)
      .regex(/[A-Z]/, invalidPassword)
      .regex(/\d/, invalidPassword)
      .regex(/\W|_/, invalidPassword)
      .default(''),
    terms: z
      .boolean()
      .refine(value => value, t('terms.required'))
      .default(false),
    newsletter: z.boolean().default(false).optional(),
  });

  return { formSchema };
};

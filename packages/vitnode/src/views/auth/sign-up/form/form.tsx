'use client';

import { AutoForm } from '@/components/form/auto-form';
import { AutoFormInput } from '@/components/form/fields/input';
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
import { Link } from '@/lib/navigation';
import { removeSpecialCharacters } from '@/lib/special-characters';
import { useTranslations } from 'next-intl';

import { PasswordInput } from '../../components/password-input';
import { useFormSignUp } from './hooks/use-form';

export const FormSignUp = () => {
  const t = useTranslations('core.auth.sign_up');
  const { form, onSubmit, formSchema } = useFormSignUp();

  return (
    <>
      <AutoForm
        fields={[
          {
            id: 'name',
            component: ({ field }) => {
              const value = field.value as string;

              return (
                <>
                  <AutoFormInput field={field} label={t('username.label')} />
                  {value.length >= 3 && (
                    <div className="text-muted-foreground text-sm">
                      {t.rich('username.your_user_code', {
                        code: () => (
                          <span className="text-foreground">
                            {removeSpecialCharacters(value)}
                          </span>
                        ),
                      })}
                    </div>
                  )}
                </>
              );
            },
          },
          {
            id: 'email',
            component: ({ field }) => (
              <AutoFormInput
                field={field}
                label={t('email.label')}
                type="email"
              />
            ),
          },
          {
            id: 'password',
            component: ({ field }) => (
              <AutoFormInput field={field} label={t('password.label')} />
            ),
          },
        ]}
        formSchema={formSchema}
        mode="onBlur"
        onSubmit={onSubmit}
        submitButtonProps={{
          className: 'w-full',
          children: t('submit'),
        }}
      />

      <Form form={form} onSubmit={onSubmit}>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('username.label')}</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              {field.value.length >= 3 && (
                <div className="text-muted-foreground text-sm">
                  {t.rich('username.your_user_code', {
                    code: () => (
                      <span className="text-foreground">
                        {removeSpecialCharacters(field.value)}
                      </span>
                    ),
                  })}
                </div>
              )}
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
              <FormLabel>{t('password.label')}</FormLabel>
              <FormControl>
                <PasswordInput {...field} />
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
    </>
  );
};

import { getRequestConfig } from 'next-intl/server';

export const locales = ['en', 'pl'];

export default getRequestConfig(async ({ requestLocale }) => {
  const locale = (await requestLocale) ?? 'en';

  return {
    locale,
    messages: (await import(`@/plugins/core/langs/${locale}.json`)).default,
  };
});

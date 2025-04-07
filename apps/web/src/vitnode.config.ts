import { getRequestConfig } from 'next-intl/server';
import { VitNodeConfig } from 'vitnode/vitnode.config';

export const vitNodeConfig: VitNodeConfig = {
  metadata: {
    title: 'VitNode',
    shortTitle: 'VitNode',
  },
  plugins: [],
  i18n: {
    locales: ['en', 'pl'],
    defaultLocale: 'en',
  },
  debug: true,
};

export default getRequestConfig(async ({ requestLocale }) => {
  const locale = (await requestLocale) ?? vitNodeConfig.i18n.defaultLocale;

  return {
    locale,
    messages: (await import(`@/plugins/core/langs/${locale}.json`)).default,
  };
});

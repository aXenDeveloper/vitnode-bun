import { CONFIG } from '@/helpers/config';
import { Locale, NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import React from 'react';

import { RootProvider } from './provider';

export const RootLayout = async ({
  children,
  className,
  params,
  debug,
  head,
  ...paramsForRoot
}: React.ComponentProps<typeof RootProvider> & {
  children: React.ReactNode;
  className?: string;
  debug?: boolean;
  head?: React.ReactNode;
  params: Promise<{ locale: Locale }>;
}) => {
  const { locale } = await params;
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        {debug && CONFIG.node_development && (
          <script
            crossOrigin="anonymous"
            src="//unpkg.com/react-scan/dist/auto.global.js"
          />
        )}
        {head}
      </head>
      <body className={className}>
        <NextIntlClientProvider messages={messages}>
          <RootProvider {...paramsForRoot}>{children}</RootProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
};

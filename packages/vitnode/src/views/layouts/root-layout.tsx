import { Locale, NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import React from 'react';

import { RootProvider } from './provider';

export const RootLayout = async ({
  children,
  className,
  params,
  ...paramsForRoot
}: React.ComponentProps<typeof RootProvider> & {
  children: React.ReactNode;
  className?: string;
  params: Promise<{ locale: Locale }>;
}) => {
  const { locale } = await params;
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={className}>
        <NextIntlClientProvider messages={messages}>
          <RootProvider {...paramsForRoot}>{children}</RootProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
};

import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import React from 'react';

import { RootProvider } from './provider';

export const RootLayout = async ({
  children,
  className,
  params,
}: {
  children: React.ReactNode;
  className: string;
  params: Promise<{ locale: string }>;
}) => {
  const { locale } = await params;
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={className}>
        <NextIntlClientProvider messages={messages}>
          <RootProvider>{children}</RootProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
};

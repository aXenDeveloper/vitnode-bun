import type { Metadata } from 'next';

import { locales } from '@/i18n';
import { Geist, Geist_Mono } from 'next/font/google';
import {
  generateMetadataRootLayout,
  RootLayout,
} from 'vitnode/views/layouts/root-layout';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const generateMetadata = (): Metadata => {
  return generateMetadataRootLayout({
    title: 'VitNode',
  });
};

export const generateStaticParams = () => locales.map(locale => ({ locale }));

export default function LocaleLayout(
  props: Pick<React.ComponentProps<typeof RootLayout>, 'children' | 'params'>,
) {
  return (
    <RootLayout
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      debug
      theme={{
        defaultTheme: 'dark',
      }}
      {...props}
    />
  );
}

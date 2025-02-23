import { setRequestLocale } from 'next-intl/server';
import { Metadata } from 'next/dist/types';
import { notFound } from 'next/navigation';

import {
  generateMetadataSignInView,
  SignInView,
} from './auth/sign-in/sign-in-view';
import {
  generateMetadataSignUpView,
  SignUpView,
} from './auth/sign-up/sign-up-view';

interface Props {
  params: Promise<{
    locale: string;
    rest: string[];
  }>;
}

export const generateMetadataDynamicView = async ({
  params,
}: Props): Promise<Metadata> => {
  const { rest, locale } = await params;
  const path = rest.join('/');

  const views: Record<string, Promise<Metadata>> = {
    register: generateMetadataSignUpView(locale),
    login: generateMetadataSignInView(locale),
  };

  return await views[path];
};

export const DynamicView = async ({ params }: Props) => {
  const { rest, locale } = await params;
  setRequestLocale(locale);
  const path = rest.join('/');

  const views = {
    register: <SignUpView />,
    login: <SignInView />,
  };

  const view = views[path];

  if (view) {
    return view;
  }

  notFound();
};

export const dynamicGenerateStaticParams = (locales: string[]) => {
  return locales.map(locale => ({ locale, rest: ['register', 'login'] }));
};

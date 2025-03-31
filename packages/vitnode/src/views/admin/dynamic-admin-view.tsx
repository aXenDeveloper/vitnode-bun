import { setRequestLocale } from 'next-intl/server';
import { Metadata } from 'next/dist/types';
import { notFound } from 'next/navigation';

import { DashboardAdminView } from './views/core/dashboard/dashboard-admin-view';

interface Props {
  params: Promise<{
    locale: string;
    rest: string[];
  }>;
}

export const generateMetadataDynamicAdminView = async ({
  params,
}: Props): Promise<Metadata> => {
  const { rest } = await params;
  const path = rest.join('/');

  const views: Record<string, Promise<Metadata>> = {};

  return await views[path];
};

export const DynamicAdminView = async ({ params }: Props) => {
  const { rest, locale } = await params;
  setRequestLocale(locale);
  const path = rest.join('/');

  const views = {
    core: <DashboardAdminView />,
    'core/users': <div>users view</div>,
  };

  const view = views[path];

  if (view) {
    return view;
  }

  notFound();
};

export const dynamicAdminViewGenerateStaticParams = (locales: string[]) => {
  return locales.map(locale => ({ locale, rest: ['core', 'core/users'] }));
};

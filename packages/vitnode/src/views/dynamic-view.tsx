import { notFound } from 'next/navigation';

import { SignUpView } from './auth/sign-up/sign-up-view';

export const DynamicView = async ({
  params,
}: {
  params: Promise<{
    rest: string[];
  }>;
}) => {
  const { rest } = await params;
  const path = rest.join('/');

  const views = {
    register: <SignUpView />,
  };

  const view = views[path];

  if (view) {
    return view;
  }

  notFound();
};

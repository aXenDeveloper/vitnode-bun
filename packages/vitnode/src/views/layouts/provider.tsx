'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';
import React from 'react';
import { Toaster } from 'sonner';

export const RootProvider = ({
  children,
  theme,
  toaster,
}: {
  children: React.ReactNode;
  theme: Omit<
    React.ComponentProps<typeof ThemeProvider>,
    'attribute' | 'disableTransitionOnChange' | 'enableSystem'
  >;
  toaster?: React.ComponentProps<typeof Toaster>;
}) => {
  const [queryClient] = React.useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            refetchOnMount: false,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider
        attribute="class"
        disableTransitionOnChange
        enableSystem
        {...theme}
      >
        {children}
        <Toaster closeButton {...toaster} />
      </ThemeProvider>
    </QueryClientProvider>
  );
};

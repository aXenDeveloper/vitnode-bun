'use client';

import { ThemeProvider } from 'next-themes';
import React from 'react';
import { scan } from 'react-scan';
import { Toaster } from 'sonner';

export const RootProvider = ({
  children,
  theme,
  debug,
  toaster,
}: {
  children: React.ReactNode;
  debug?: boolean;
  theme: Omit<
    React.ComponentProps<typeof ThemeProvider>,
    'attribute' | 'disableTransitionOnChange' | 'enableSystem'
  >;
  toaster?: React.ComponentProps<typeof Toaster>;
}) => {
  React.useEffect(() => {
    if (debug && process.env.NODE_ENV === 'development') {
      scan({
        enabled: true,
      });
    }
  }, [debug]);

  return (
    <ThemeProvider
      attribute="class"
      disableTransitionOnChange
      enableSystem
      {...theme}
    >
      {children}
      <Toaster closeButton {...toaster} />
    </ThemeProvider>
  );
};

"use client";

import React from "react";
import { ThemeProvider } from "next-themes";

export const RootProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
      {children}
    </ThemeProvider>
  );
};

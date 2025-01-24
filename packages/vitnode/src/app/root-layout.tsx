import React from "react";
import { RootProvider } from "./provider.js";

export const RootLayout = ({
  children,
  className
}: {
  children: React.ReactNode;
  className: string;
}) => {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={className}>
        <RootProvider>{children}</RootProvider>
      </body>
    </html>
  );
};

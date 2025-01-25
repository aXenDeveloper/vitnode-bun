import { HeaderLayout } from "./header.js";

export const ThemeLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <HeaderLayout /> <main>{children}</main>
    </>
  );
};

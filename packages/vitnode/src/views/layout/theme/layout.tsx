import { HeaderLayout } from './header';

export const ThemeLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <HeaderLayout /> <main>{children}</main>
    </>
  );
};

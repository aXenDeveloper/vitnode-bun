import { ThemeLayout } from 'vitnode/views/layout/theme/layout';

export default function Layout({ children }: { children: React.ReactNode }) {
  return <ThemeLayout>{children}</ThemeLayout>;
}

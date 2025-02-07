import { ThemeLayout } from 'vitnode/layouts/theme/layout';

export default function Layout({ children }: { children: React.ReactNode }) {
  return <ThemeLayout logo="test123">{children}</ThemeLayout>;
}

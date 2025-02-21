import { ThemeLayout } from 'vitnode/views/layouts/theme/layout';

export default function Layout({ children }: { children: React.ReactNode }) {
  return <ThemeLayout logo="VitNode">{children}</ThemeLayout>;
}

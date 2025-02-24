import { ThemeSwitcher } from '@/components/switchers/theme-switcher';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { SidebarInset } from '@/components/ui/sidebar-server';
import { cookies } from 'next/headers';

import { SidebarAdmin } from './sidebar/sidebar';

export const AdminLayout = async ({
  children,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) => {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get('sidebar_state')?.value === 'true';

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <SidebarAdmin />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <ThemeSwitcher />
        </header>
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
};

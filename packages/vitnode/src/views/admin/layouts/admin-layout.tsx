import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { SidebarInset } from '@/components/ui/sidebar-server';
import { getSessionAdminApi } from '@/lib/api/get-session-admin-api';
import { cookies } from 'next/headers';

import { SidebarAdmin } from './sidebar/sidebar';
import { UserBarAdmin } from './user-bar/user-bar';

export const AdminLayout = async ({
  children,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) => {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get('sidebar_state')?.value === 'true';
  await getSessionAdminApi();

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <SidebarAdmin />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <div className="ml-auto flex items-center justify-center gap-2">
            <UserBarAdmin />
          </div>
        </header>
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
};

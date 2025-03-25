import { LogoVitNode } from '@/components/logo-vitnode';
import { ThemeSwitcher } from '@/components/switchers/theme-switcher';
import { Sidebar } from '@/components/ui/sidebar';
import { SidebarContent, SidebarHeader } from '@/components/ui/sidebar-server';
import { Link } from '@/lib/navigation';
import { cn } from '@/lib/utils';

import { NavSidebarAdmin } from './nav/nav';

export const SidebarAdmin = () => {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="flex h-16 flex-row items-center border-b">
        <Link
          className={cn(
            'px-2',
            'transition-[padding] group-data-[collapsible=icon]:p-0',
          )}
          href="/admin/core"
        >
          <LogoVitNode className="size-8" small />
        </Link>
        <div
          className={cn(
            'ml-auto px-2',
            'transition-opacity group-data-[collapsible=icon]:pointer-events-none group-data-[collapsible=icon]:opacity-0',
          )}
        >
          <ThemeSwitcher />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <NavSidebarAdmin />
      </SidebarContent>
    </Sidebar>
  );
};

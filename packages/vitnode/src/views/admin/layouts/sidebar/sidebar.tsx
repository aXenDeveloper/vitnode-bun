import { Sidebar } from '@/components/ui/sidebar';
import {
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from '@/components/ui/sidebar-server';

import { NavSidebarAdmin } from './nav/nav';
import { UserFooterSidebarAdmin } from './user-footer';

export const SidebarAdmin = () => {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>header</SidebarHeader>
      <SidebarContent>
        <NavSidebarAdmin />
      </SidebarContent>
      <SidebarFooter>
        <UserFooterSidebarAdmin />
      </SidebarFooter>
    </Sidebar>
  );
};

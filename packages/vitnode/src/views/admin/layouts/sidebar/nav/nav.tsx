import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
} from '@/components/ui/sidebar-server';
import { HomeIcon } from 'lucide-react';

import { ItemNavAdmin } from './item';

export const NavSidebarAdmin = () => {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Platform</SidebarGroupLabel>
      <SidebarMenu>
        <ItemNavAdmin
          href="/admin/core"
          icon={<HomeIcon />}
          title="test button"
        />

        <ItemNavAdmin
          href="/admin/core/users"
          icon={<HomeIcon />}
          items={[
            {
              title: 'test 123',
              href: '/admin/core/users/test',
            },
          ]}
          title="Users"
        />
      </SidebarMenu>
    </SidebarGroup>
  );
};

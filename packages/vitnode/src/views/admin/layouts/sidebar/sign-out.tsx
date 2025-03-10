'use client';

import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { signOutMutationApi } from '@/views/layouts/theme/header/user/auth/log-out/mutation-api';

export const SignOutUserFooterSidebarAdmin = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <DropdownMenuItem
      onClick={async () => {
        await signOutMutationApi({ isAdmin: true });
      }}
    >
      {children}
    </DropdownMenuItem>
  );
};

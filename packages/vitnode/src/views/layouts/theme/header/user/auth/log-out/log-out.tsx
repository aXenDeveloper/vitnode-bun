'use client';

import { DropdownMenuItem } from '@/components/ui/dropdown-menu';

import { signOutMutationApi } from './mutation-api';

export const LogOutAuthUserHeader = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <DropdownMenuItem
      onClick={async () => {
        await signOutMutationApi({});
      }}
    >
      {children}
    </DropdownMenuItem>
  );
};

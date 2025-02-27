import { Avatar } from '@/components/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { getSessionApi } from '@/lib/api/get-session-api';
import { LogOutIcon } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

import { LogOutAuthUserHeader } from './log-out/log-out';

export const AuthUserHeader = async () => {
  const [t, { user }] = await Promise.all([
    getTranslations('core.global.user_bar'),
    getSessionApi(),
  ]);

  if (!user) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button aria-label={user.name} size="icon" variant="ghost">
          <Avatar size={24} user={user} />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-64 p-2">
        {/* <DropdownMenuSeparator /> */}

        <DropdownMenuGroup>
          <LogOutAuthUserHeader>
            <LogOutIcon />
            <span>{t('log_out')}</span>
          </LogOutAuthUserHeader>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

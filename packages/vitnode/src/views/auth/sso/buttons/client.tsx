'use client';

import { Button } from '@/components/ui/button';

import { mutationApi } from './mutation-api';

export const ButtonSSOButtons = ({
  children,
  providerId,
}: {
  children: React.ReactNode;
  providerId: string;
}) => {
  return (
    <Button
      className="bg-card w-full"
      onClick={async () => mutationApi(providerId)}
      variant="outline"
    >
      {children}
    </Button>
  );
};

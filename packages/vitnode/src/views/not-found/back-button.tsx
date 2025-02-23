'use client';

import { Button } from '@/components/ui/button';
import { useRouter } from '@/utils/navigation';

export const BackButtonNotFound = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { back } = useRouter();

  return (
    <Button onClick={back} size="lg" variant="ghost">
      {children}
    </Button>
  );
};

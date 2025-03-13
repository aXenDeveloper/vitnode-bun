'use client';

import { Loader } from '@/components/ui/loader';
import { ErrorView } from '@/views/error/error-view';
import { useQuery } from '@tanstack/react-query';

import { mutationApi } from './mutation-api';

export const ClientCallbackSSO = ({
  providerId,
  code,
}: {
  code: string;
  providerId: string;
}) => {
  const { isError } = useQuery({
    queryKey: ['core.auth.sso.callback.sign-up', providerId, code],
    queryFn: async () => {
      const mutation = await mutationApi({ providerId, code });
      if (mutation?.error) {
        throw new Error(mutation.error);
      }

      return '';
    },
    retry: false,
  });

  if (isError) {
    return <ErrorView code={500} />;
  }

  return (
    <div className="container mx-auto flex items-center justify-center p-4">
      <Loader />
    </div>
  );
};

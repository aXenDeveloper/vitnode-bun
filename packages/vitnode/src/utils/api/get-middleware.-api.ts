import { MiddlewareTypes } from '@/api/modules/middleware/middleware.module';

import { fetcher } from '../fetcher';

export const getMiddlewareApi = async () => {
  const client = await fetcher<MiddlewareTypes>({
    plugin: 'core',
    module: 'middleware',
  });

  const data = await client.index.$get();

  return data;
};

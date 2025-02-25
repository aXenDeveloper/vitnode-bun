'use client';

import { lazy } from 'react';

// Move error content to a separate chunk and load it only when needed
export default lazy(async () =>
  import('vitnode/views/not-found/not-found').then(mod => ({
    default: mod.NotFoundView,
  })),
);

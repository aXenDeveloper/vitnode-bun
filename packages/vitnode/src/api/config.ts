import type { OpenAPIHono } from '@hono/zod-openapi';

import { swaggerUI } from '@hono/swagger-ui';

import { sessionMiddleware } from './middleware/session';

export const honoConfig = ({ app }: { app: OpenAPIHono }) => {
  app.doc('/swagger/doc', {
    openapi: '3.0.0',
    info: {
      version: '1.0.0',
      title: 'VitNode API',
    },
  });

  app.get('/swagger', swaggerUI({ url: '/api/swagger/doc' }));
  app.use('*', sessionMiddleware());
};

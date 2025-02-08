import type { OpenAPIHono } from '@hono/zod-openapi';

import { swaggerUI } from '@hono/swagger-ui';
import { cors } from 'hono/cors';

export const honoConfig = ({ app }: { app: OpenAPIHono }) => {
  app.doc('/swagger/doc', {
    openapi: '3.0.0',
    info: {
      version: '1.0.0',
      title: 'VitNode API',
    },
  });

  app.use('/*', cors());
  app.get('/swagger', swaggerUI({ url: '/api/swagger/doc' }));
};

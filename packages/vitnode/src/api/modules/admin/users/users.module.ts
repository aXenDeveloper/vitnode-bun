import { createModuleApi } from '@/api/lib/module';
import { OpenAPIHono } from '@hono/zod-openapi';

import { sessionAdminRoute } from './session';

export const usersAdminModule = createModuleApi({
  name: 'users',
  plugin: 'core',
  routes: new OpenAPIHono().route('/session', sessionAdminRoute),
});

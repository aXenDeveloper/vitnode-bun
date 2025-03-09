import { createModuleApi } from '@/api/lib/module';
import { OpenAPIHono } from '@hono/zod-openapi';

import { usersAdminModule } from './users/users.module';

export const adminModule = createModuleApi({
  name: 'admin',
  plugin: 'core',
  routes: new OpenAPIHono().route('/users', usersAdminModule.app),
});

export type AdminTypes = typeof adminModule;

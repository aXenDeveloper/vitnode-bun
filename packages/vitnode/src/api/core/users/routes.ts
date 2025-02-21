import { createModuleApi } from '@/api/helpers/module';
import { OpenAPIHono } from '@hono/zod-openapi';

import { signInRoute } from './sign-in/route';
import { signUpRoute } from './sign-up/route';

export const usersModule = createModuleApi({
  name: 'users',
  plugin: 'core',
  routes: new OpenAPIHono().route('/', signUpRoute).route('/', signInRoute),
});

export type UsersTypes = typeof usersModule;

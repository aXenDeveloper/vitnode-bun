import { createModuleApi } from '@/api/lib/module';
import { OpenAPIHono } from '@hono/zod-openapi';

import { sessionRoute } from './session';
import { signInRoute } from './sign-in';
import { signUpRoute } from './sign-up';

export const usersModule = createModuleApi({
  name: 'users',
  plugin: 'core',
  routes: new OpenAPIHono()
    .route('/', signUpRoute)
    .route('/', signInRoute)
    .route('/', sessionRoute),
});

export type UsersTypes = typeof usersModule;

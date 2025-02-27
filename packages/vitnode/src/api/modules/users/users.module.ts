import { createModuleApi } from '@/api/lib/module';
import { OpenAPIHono } from '@hono/zod-openapi';

import { sessionRoute } from './session';
import { signInRoute } from './sign-in';
import { signOutRoute } from './sign-out';
import { signUpRoute } from './sign-up';

export const usersModule = createModuleApi({
  name: 'users',
  plugin: 'core',
  routes: new OpenAPIHono()
    .route('/', signUpRoute)
    .route('/', signInRoute)
    .route('/', sessionRoute)
    .route('/', signOutRoute),
});

export type UsersTypes = typeof usersModule;

import { createModuleApi } from '@/api/lib/module';
import { OpenAPIHono } from '@hono/zod-openapi';

import { callbackRoute } from './callback';
import { createUrlRoute } from './create-url';
import { signUpSSORoute } from './sign-up';

export const ssoUserModule = createModuleApi({
  name: 'sso',
  plugin: 'core',
  routes: new OpenAPIHono()
    .route('/', createUrlRoute)
    .route('/', callbackRoute)
    .route('/', signUpSSORoute),
});

import { OpenAPIHono } from '@hono/zod-openapi';

import { showApi } from './services/show';

export const middleware = new OpenAPIHono().route('/', showApi);

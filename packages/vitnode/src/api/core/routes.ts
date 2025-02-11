import { OpenAPIHono } from '@hono/zod-openapi';

import { middleware } from './middleware/routes';
import { users } from './users/routes';

export const core = new OpenAPIHono();
core.route('/middleware', middleware).route('/users', users);

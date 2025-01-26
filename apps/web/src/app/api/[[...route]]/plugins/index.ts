import { OpenAPIHono } from '@hono/zod-openapi';
import { core } from 'vitnode/api/core/routes';

export const plugins = new OpenAPIHono();

plugins.route('/core', core);

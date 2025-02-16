import { createModuleApi } from '@/api/helpers/module';
import { createApiRoute } from '@/api/helpers/route';
import { OpenAPIHono, z } from '@hono/zod-openapi';

export const showMiddlewareObj = z.object({
  languages_code_default: z.string(),
  last_updated: z.date(),
});

const route = createApiRoute({
  method: 'get',
  path: '/{id}',
  plugin: 'core',
  request: {
    params: z.object({
      id: z.string(),
    }),
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: showMiddlewareObj,
        },
      },
      description: 'Show middleware',
    },
  },
});

export const middlewareModule = createModuleApi({
  name: 'middleware',
  plugin: 'core',
  routes: new OpenAPIHono().openapi(route, c => {
    const json: z.infer<typeof showMiddlewareObj> = {
      languages_code_default: 'en',
      last_updated: new Date(),
    };

    return c.json(json);
  }),
});

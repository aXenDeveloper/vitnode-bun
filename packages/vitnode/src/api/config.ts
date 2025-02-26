import { swaggerUI } from '@hono/swagger-ui';
import { OpenAPIHono } from '@hono/zod-openapi';
import { Context, Env, Schema } from 'hono';
import { cors } from 'hono/cors';
import { csrf } from 'hono/csrf';
import { HTTPException } from 'hono/http-exception';

import { PluginAPI } from './lib/plugin';

interface CORSOptions {
  allowHeaders?: string[];
  allowMethods?: string[];
  credentials?: boolean;
  exposeHeaders?: string[];
  maxAge?: number;
  origin:
    | ((origin: string, c: Context) => null | string | undefined)
    | string
    | string[];
}

type IsAllowedOriginHandler = (origin: string, context: Context) => boolean;
interface CSRFOptions {
  origin?: IsAllowedOriginHandler | string | string[];
}

export function VitNodeAPIInit<T extends Schema>({
  app,
  cors: corsOptions,
  csrf: csrfOptions,
  plugins,
}: {
  app: OpenAPIHono<Env, Schema, string>;
  cors?: CORSOptions;
  csrf?: CSRFOptions;
  plugins: PluginAPI<T, string>[];
}) {
  app.doc('/swagger/doc', {
    openapi: '3.0.0',
    info: {
      version: '1.0.0',
      title: 'VitNode API',
    },
  });
  app.use(cors(corsOptions));
  app.use(csrf(csrfOptions));
  app.get('/swagger', swaggerUI({ url: `/api/swagger/doc` }));

  app.onError(error => {
    if (error instanceof HTTPException) {
      return error.getResponse();
    }

    return new Response('Internal Server Error', {
      status: 500,
    });
  });

  plugins.map(root => {
    app.route(`/${root.name}`, root.app);
  });

  return app;
}

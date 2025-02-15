import { swaggerUI } from '@hono/swagger-ui';
import { OpenAPIHono } from '@hono/zod-openapi';
import { Context, Env, Schema } from 'hono';
import { cors } from 'hono/cors';
import { csrf } from 'hono/csrf';

import { PluginVitNodeAPI } from './helpers/plugin';

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

// export class VitNodeAPI<
//   E extends Env = Env,
//   S extends Schema = Schema,
//   BasePath extends string = '/',
// > extends OpenAPIHono<E, S, BasePath> {
//   constructor(options?: HonoOptions<Env> & OpenAPIHonoOptions<E>) {
//     super(options);

//     const app = new OpenAPIHono<E, S, BasePath>();
//     this.app = app;

//     this.app.doc('/swagger/doc', {
//       openapi: '3.0.0',
//       info: {
//         version: '1.0.0',
//         title: 'VitNode API',
//       },
//     });
//     this.app.get('/swagger', swaggerUI({ url: '/api/swagger/doc' }));
//   }

//   app: OpenAPIHono<E, S, BasePath>;
// }

export function VitNodeAPIInit<T extends Schema>({
  app,
  cors: corsOptions,
  csrf: csrfOptions,
  plugins,
}: {
  app: OpenAPIHono<Env, Schema, string>;
  cors?: CORSOptions;
  csrf?: CSRFOptions;
  plugins: PluginVitNodeAPI<T>[];
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

  plugins.map(({ name, root }) => {
    app.route(`/${name}`, root);
  });

  return app;
}

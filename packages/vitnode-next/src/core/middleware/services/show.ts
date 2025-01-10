import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";

export const showApi = new OpenAPIHono();

export const showMiddlewareObj = z.object({
  languages_code_default: z.string(),
  last_updated: z.date(),
  plugins: z.array(z.string())
});

const route = createRoute({
  method: "get",
  path: "/",
  responses: {
    200: {
      content: {
        "application/json": {
          schema: showMiddlewareObj
        }
      },
      description: "Show middleware"
    }
  }
});

showApi.openapi(route, async (c) => {
  const json: z.infer<typeof showMiddlewareObj> = {
    languages_code_default: "en",
    last_updated: new Date(),
    plugins: ["core", "admin"]
  };

  return c.json(json);
});

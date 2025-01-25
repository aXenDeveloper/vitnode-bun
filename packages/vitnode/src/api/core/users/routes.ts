import { clientDb } from "@/database/client.js";
import { core_config } from "@/database/schema/config.js";
import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";

export const users = new OpenAPIHono();

users.openapi(
  createRoute({
    method: "post",
    description: "Create a new user",
    tags: ["Core"],
    path: "/sign_up",
    request: {
      body: {
        required: true,
        content: {
          "application/json": {
            schema: z.object({
              email: z.string().email().toLowerCase(),
              name: z.string().min(3),
              password: z.string().min(8),
              newsletter: z.boolean().default(false).optional()
            })
          }
        }
      }
    },
    responses: {
      200: {
        content: {
          "application/json": {
            schema: z.object({
              id: z.string()
            })
          }
        },
        description: "User created"
      }
    }
  }),
  async (c) => {
    const { email, name, newsletter, password } = c.req.valid("json");

    const test = await clientDb.select().from(core_config);
    console.log(test);

    return c.json({ id: email });
  }
);

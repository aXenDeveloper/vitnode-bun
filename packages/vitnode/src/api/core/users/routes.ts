import { clientDb } from "@/database/client";
import { removeSpecialCharacters } from "@/functions/special-characters";
import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import { HTTPException } from "hono/http-exception";
import { passwordModel } from "./models/password";

export const users = new OpenAPIHono();
const nameRegex = /^(?!.* {2})[\p{L}\p{N}._@ -]*$/u;

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
              name: z
                .string()
                .min(3)
                .refine((val) => nameRegex.test(val), {
                  message: "Invalid name"
                }),
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
    const { email, name: nameFromBody, newsletter, password } = c.req.valid("json");
    const name = removeSpecialCharacters(nameFromBody);
    const encryptPassword = await passwordModel.encryptPassword(password);
    console.log({ encryptPassword });

    const checkIfUserExist = await clientDb.query.core_users.findMany({
      where: (table, { eq, and }) => and(eq(table.email, email), eq(table.name, name))
    });
    const findEmail = checkIfUserExist.find((user) => user.email === email);
    if (findEmail) {
      throw new HTTPException(400, {
        message: "Email already exists"
      });
    }
    const findName = checkIfUserExist.find((user) => user.name === name);
    if (findName) {
      throw new HTTPException(400, {
        message: "Name already exists"
      });
    }

    return c.json({ id: email });
  }
);

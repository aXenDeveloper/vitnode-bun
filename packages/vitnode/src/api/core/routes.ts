import { OpenAPIHono } from "@hono/zod-openapi";
import { middleware } from "./middleware/routes.js";
import { users } from "./users/routes.js";

export const core = new OpenAPIHono();
core.route("/middleware", middleware);
core.route("/users", users);

import { OpenAPIHono } from "@hono/zod-openapi";
import { showApi } from "./services/show.js";

export const middleware = new OpenAPIHono();
middleware.route("/", showApi);

import { core } from "vitnode/core/routes";
import { OpenAPIHono } from "@hono/zod-openapi";

export const plugins = new OpenAPIHono();

plugins.route("/core", core);

import { core } from "vitnode-next/core/routes";
import { OpenAPIHono } from "@hono/zod-openapi";

export const plugins = new OpenAPIHono();

plugins.route("/core", core);

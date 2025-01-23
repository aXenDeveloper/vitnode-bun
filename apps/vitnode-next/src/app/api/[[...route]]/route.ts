import { OpenAPIHono } from "@hono/zod-openapi";
import { handle } from "hono/vercel";
import { honoConfig } from "vitnode/api/api-config";
import { plugins } from "./plugins";

export const runtime = "edge";

const app = new OpenAPIHono().basePath("/api");

honoConfig({ app });

app.route("/", plugins);

app.get("/hello", (c) => {
  console.log("hello", process.env.DB_HOST);

  return c.json({
    message: "welcome"
  });
});

export const GET = handle(app);
export const POST = handle(app);

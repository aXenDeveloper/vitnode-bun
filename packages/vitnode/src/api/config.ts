import type { OpenAPIHono } from "@hono/zod-openapi";
import type { Env } from "hono";
import { swaggerUI } from "@hono/swagger-ui";
import { sessionMiddleware } from "./middleware/session.js";

export const honoConfig = ({ app }: { app: OpenAPIHono<Env, {}, "/"> }) => {
  app.doc("/swagger/doc", {
    openapi: "3.0.0",
    info: {
      version: "1.0.0",
      title: "VitNode API"
    }
  });

  app.get("/swagger", swaggerUI({ url: "/api/swagger/doc" }));
  app.use("*", sessionMiddleware());
};

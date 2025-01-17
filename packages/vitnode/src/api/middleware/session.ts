import type { Context, Env, Next } from "hono";
import { getCookie } from "hono/cookie";

export const sessionMiddleware = () => {
  return async (c: Context<Env, "*", {}>, next: Next) => {
    const secret = process.env.LOGIN_TOKEN_SECRET ?? "";
    console.log("Session middleware", secret);
    const allCookies = getCookie(c);
    console.log("All cookies", allCookies);

    await next();
  };
};

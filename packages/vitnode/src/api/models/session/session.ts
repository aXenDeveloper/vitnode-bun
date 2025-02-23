import { getUserIp } from '@/api/utils/get-user-ip';
import { signJWT } from '@/api/utils/jwt';
import { dbClient } from '@/database/client';
import {
  core_sessions,
  core_sessions_known_devices,
} from '@/database/schema/sessions';
import { CONFIG } from '@/utils/config';
import { Context, Env, Input } from 'hono';
import { setCookie } from 'hono/cookie';
import { HTTPException } from 'hono/http-exception';
import { jwtVerify } from 'jose';

interface SessionJWTPayload {
  userId: string;
}

export const SessionModel = {
  createSession: async (
    { userId }: SessionJWTPayload,
    c: Context<Env, '/', Input>,
  ) => {
    const token = await signJWT(
      { userId },
      process.env.LOGIN_TOKEN_SECRET ?? '',
    );

    const [device] = await dbClient
      .insert(core_sessions_known_devices)
      .values({
        ip_address: getUserIp(c.req),
        user_agent: c.req.header('User-Agent') ?? 'node',
      })
      .returning();

    await dbClient.insert(core_sessions).values({
      token,
      user_id: userId,
      expires_at: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30), // 30 days
      device_id: device.id,
    });

    setCookie(c, CONFIG.cookie_session, token, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      path: '/',
      domain: CONFIG.frontend.hostname,
    });

    return { token, deviceId: device.id };
  },
  verifySession: async ({ token }: { token: string }) => {
    try {
      const secret = new TextEncoder().encode(
        process.env.LOGIN_TOKEN_SECRET ?? '',
      );

      const data = await jwtVerify<SessionJWTPayload>(token, secret);

      return data;
    } catch (_) {
      throw new HTTPException(403);
    }
  },
};

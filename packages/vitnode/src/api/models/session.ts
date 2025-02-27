import { getUserIp } from '@/api/lib/get-user-ip';
import { dbClient } from '@/database/client';
import {
  core_sessions,
  core_sessions_known_devices,
} from '@/database/schema/sessions';
import { CONFIG } from '@/lib/config';
import crypto from 'crypto';
import { eq } from 'drizzle-orm';
import { Context, Env, Input } from 'hono';
import { deleteCookie, getCookie, setCookie } from 'hono/cookie';

import { UserModel } from './user';

export const SessionModel = {
  createSession: async (
    { userId }: { userId: string },
    c: Context<Env, '/', Input>,
  ) => {
    const token = crypto.randomBytes(64).toString('hex').normalize();

    const [device] = await dbClient
      .insert(core_sessions_known_devices)
      .values({
        ip_address: getUserIp(c.req),
        user_agent: c.req.header('User-Agent') ?? 'nod  e',
      })
      .returning();

    await dbClient.insert(core_sessions).values({
      token,
      user_id: userId,
      expires_at: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30), // 30 days
      device_id: device.id,
    });

    setCookie(c, c.get('core').authorization.cookie_name, token, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      path: '/',
      expires:
        c.get('core').authorization.cookie_expires > 0
          ? new Date(Date.now() + c.get('core').authorization.cookie_expires)
          : undefined,
      domain: CONFIG.frontend.hostname,
    });

    return { token, deviceId: device.id };
  },
  verifySession: async (c: Context<Env, '/', Input>) => {
    const token = getCookie(c, c.get('core').authorization.cookie_name);
    if (!token) return null;

    const [session] = await dbClient
      .select({
        token: core_sessions.token,
        user_id: core_sessions.user_id,
      })
      .from(core_sessions)
      .where(eq(core_sessions.token, token))
      .limit(1);

    if (!session || session.token !== token) {
      return null;
    }
    const user = await UserModel.getUserById(session.user_id);
    if (!user) return null;

    return user;
  },
  deleteSession: async (c: Context<Env, '/', Input>) => {
    const token = getCookie(c, c.get('core').authorization.cookie_name);
    if (!token) return;

    await dbClient.delete(core_sessions).where(eq(core_sessions.token, token));
    deleteCookie(c, c.get('core').authorization.cookie_name);
  },
};

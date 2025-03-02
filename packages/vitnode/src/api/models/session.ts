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

export class SessionModel<T extends Env> {
  constructor(c: Context<T, '/', Input>) {
    this.c = c;
  }
  private readonly c: Context<T, '/', Input>;

  async createSessionByUserId(userId: string) {
    const token = crypto.randomBytes(64).toString('hex').normalize();

    const [device] = await dbClient
      .insert(core_sessions_known_devices)
      .values({
        ip_address: getUserIp(this.c.req),
        user_agent: this.c.req.header('User-Agent') ?? 'nod  e',
      })
      .returning({ id: core_sessions_known_devices.id });

    await dbClient.insert(core_sessions).values({
      token,
      user_id: userId,
      expires_at: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30), // 30 days
      device_id: device.id,
    });

    setCookie(this.c, this.c.get('core').authorization.cookie_name, token, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      path: '/',
      expires:
        this.c.get('core').authorization.cookie_expires > 0
          ? new Date(
              Date.now() + this.c.get('core').authorization.cookie_expires,
            )
          : undefined,
      domain: CONFIG.frontend.hostname,
    });

    return { token, deviceId: device.id };
  }

  async deleteSession() {
    const token = getCookie(
      this.c,
      this.c.get('core').authorization.cookie_name,
    );
    if (!token) return;

    await dbClient.delete(core_sessions).where(eq(core_sessions.token, token));
    deleteCookie(this.c, this.c.get('core').authorization.cookie_name);
  }

  async verifySession() {
    const token = getCookie(
      this.c,
      this.c.get('core').authorization.cookie_name,
    );
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
    const user = await new UserModel().getUserById(session.user_id);
    if (!user) return null;

    return user;
  }
}

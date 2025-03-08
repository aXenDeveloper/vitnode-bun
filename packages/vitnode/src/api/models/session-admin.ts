import { dbClient } from '@/database/client';
import { core_admin_sessions } from '@/database/schema/admins';
import { CONFIG } from '@/lib/config';
import crypto from 'crypto';
import { Context, Env, Input } from 'hono';
import { setCookie } from 'hono/cookie';

import { DeviceModel } from './device';

export class SessionAdminModel<T extends Env> extends DeviceModel<T> {
  constructor(c: Context<T, '/', Input>) {
    super(c);
  }

  async createSessionByUserId(userId: string) {
    const token = crypto.randomBytes(64).toString('hex').normalize();
    const deviceId = await this.getDeviceId();

    await dbClient.insert(core_admin_sessions).values({
      token,
      user_id: userId,
      expires_at: new Date(
        Date.now() + this.c.get('core').authorization.admin_cookie_expires,
      ),
      device_id: deviceId,
    });

    setCookie(
      this.c,
      this.c.get('core').authorization.admin_cookie_name,
      token,
      {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        path: '/admin',
        expires: new Date(
          Date.now() + this.c.get('core').authorization.admin_cookie_expires,
        ),
        domain: CONFIG.frontend.hostname,
      },
    );

    return { token, deviceId };
  }
}

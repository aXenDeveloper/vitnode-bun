import { CONFIG } from '@/lib/config';
import { z } from 'zod';

export class SSOModelPlugin {
  protected readonly redirectUri = (code: string) =>
    new URL(`${CONFIG.frontend.href}login/sso/${code}`).toString();

  protected readonly tokenSchema = z.object({
    access_token: z.string(),
    token_type: z.string(),
  });

  protected readonly userSchema = z.object({
    id: z.string(),
    email: z.string(),
    username: z.string().optional(),
  });
}

'use server';

import { cookieFromStringToObject } from '@/lib/cookie-from-string-to-object';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';

export const mutationApi = async (cookiesToSave: string[]) => {
  // Save cookies to the client
  await Promise.all(
    cookieFromStringToObject(cookiesToSave).map(async cookie => {
      const key = Object.keys(cookie)[0];
      const value = Object.values(cookie)[0];

      if (typeof value !== 'string' || typeof key !== 'string') return;

      (await cookies()).set(key, value, {
        domain: cookie.Domain,
        path: cookie.Path,
        expires: new Date(cookie.Expires),
        secure: cookie.Secure,
        httpOnly: cookie.HttpOnly,
        sameSite: cookie.SameSite,
      });
    }),
  );

  revalidatePath('/[locale]/(main)', 'layout');
};

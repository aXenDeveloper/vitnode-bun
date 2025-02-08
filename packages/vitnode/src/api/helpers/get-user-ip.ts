import { HonoRequest } from 'hono';

export const getUserIp = (req: HonoRequest): string => {
  const ip: string = req.header['x-forwarded-for']?.toString();
  if (ip) {
    return ip;
  }

  // eslint-disable-next-line no-console
  console.error(
    'No IP found in request. Please check if you passed `x-forwarded-for` header.',
  );

  return '127.0.0.1';
};

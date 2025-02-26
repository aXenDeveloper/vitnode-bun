import { JWTPayload, SignJWT } from 'jose';

export async function signJWT(
  payload: JWTPayload,
  secret: string,
  expiresIn = 3600,
): Promise<string> {
  const jwt = await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(Math.floor(Date.now() / 1000) + expiresIn)
    .sign(new TextEncoder().encode(secret));

  return jwt;
}

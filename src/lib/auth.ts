import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'default-secret-change-me');
const ALG = 'HS256';

export async function signSession(payload: Record<string, unknown>) {
  const iat = Math.floor(Date.now() / 1000);
  const exp = iat + 60 * 60 * 24 * 7; // 7 days

  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: ALG })
    .setIssuedAt(iat)
    .setExpirationTime(exp)
    .sign(secret);
}

export async function verifySession() {
  const cookieStore = cookies();
  const token = cookieStore.get('session')?.value;

  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, secret, {
      algorithms: [ALG],
    });
    return payload;
  } catch {
    return null;
  }
}

export async function getSession() {
    return await verifySession();
}

export function setSessionCookie(token: string) {
  const cookieStore = cookies();
  cookieStore.set('session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

export function clearSessionCookie() {
  const cookieStore = cookies();
  cookieStore.delete('session');
}

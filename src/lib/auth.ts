import { SignJWT, jwtVerify } from 'jose';
import { cookies, headers } from 'next/headers';

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
  let token = cookieStore.get('session')?.value;

  // 如果 cookie 中没有 token，尝试从 Authorization header 中获取
  if (!token) {
    const authHeader = headers().get('authorization');
    if (authHeader?.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    }
  }

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
  const isProd = process.env.NODE_ENV === 'production';
  
  cookieStore.set('session', token, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

export function clearSessionCookie() {
  const cookieStore = cookies();
  cookieStore.delete('session');
}

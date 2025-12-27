import { NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import { db } from '@/db';
import { users, emailVerifications } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { signSession, setSessionCookie } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const { email, password, code } = await req.json();

    if (!email || !password || !code) {
      return NextResponse.json({ error: 'Missing email, password, or verification code' }, { status: 400 });
    }

    // Verify code
    const verification = await db.query.emailVerifications.findFirst({
      where: and(
        eq(emailVerifications.email, email),
        eq(emailVerifications.code, code)
      ),
    });

    if (!verification) {
      return NextResponse.json({ error: 'Invalid verification code' }, { status: 400 });
    }

    if (new Date() > verification.expiresAt) {
      return NextResponse.json({ error: 'Verification code expired' }, { status: 400 });
    }

    // Check if user exists
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 409 });
    }

    // Hash password
    const passwordHash = await hash(password, 10);

    // Create user
    const [newUser] = await db.insert(users).values({
      email,
      password: passwordHash,
      creditBalance: 10, // Default credits
      creditsExpiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days validity
    }).returning();

    // Delete verification code after successful registration
    await db.delete(emailVerifications).where(eq(emailVerifications.email, email));

    // Create session
    const token = await signSession({ userId: newUser.id, email: newUser.email });
    setSessionCookie(token);

    return NextResponse.json({
      user: {
        id: newUser.id,
        email: newUser.email,
        creditBalance: newUser.creditBalance,
        plan: newUser.plan,
        aiReadingsUsage: newUser.aiReadingsUsage,
        consultationUsage: newUser.consultationUsage,
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

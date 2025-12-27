import { NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { signSession, setSessionCookie } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Missing email or password' }, { status: 400 });
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

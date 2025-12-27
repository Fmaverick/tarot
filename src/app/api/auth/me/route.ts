import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await getSession();

    if (!session || !session.userId) {
      return NextResponse.json({ user: null });
    }

    const user = await db.query.users.findFirst({
      where: eq(users.id, Number(session.userId)),
      columns: {
        id: true,
        email: true,
        creditBalance: true,
        creditsExpiresAt: true,
        plan: true,
        aiReadingsUsage: true,
        consultationUsage: true,
      }
    });

    if (!user) {
      return NextResponse.json({ user: null });
    }

    // Check expiration and clear if needed
    if (user.creditsExpiresAt && new Date(user.creditsExpiresAt) < new Date() && user.creditBalance > 0) {
        await db.update(users)
          .set({ creditBalance: 0 })
          .where(eq(users.id, user.id));
        
        // Update local user object to reflect changes
        user.creditBalance = 0;
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error('Me error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

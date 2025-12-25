import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { db } from '@/db';
import { sessions } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';

export async function GET() {
  const session = await getSession();
  if (!session || !session.userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const userSessions = await db.query.sessions.findMany({
      where: eq(sessions.userId, Number(session.userId)),
      orderBy: [desc(sessions.createdAt)],
      with: {
        cardsDrawn: true,
      }
    });

    return NextResponse.json({ sessions: userSessions });
  } catch (error) {
    console.error('Sessions error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

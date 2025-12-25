import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { db } from '@/db';
import { sessions, messages } from '@/db/schema';
import { eq, and, asc } from 'drizzle-orm';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getSession();
  if (!session || !session.userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const sessionId = params.id;
  const userId = Number(session.userId);

  try {
    // Fetch session and verify ownership
    const userSession = await db.query.sessions.findFirst({
      where: and(
        eq(sessions.id, sessionId),
        eq(sessions.userId, userId)
      ),
      with: {
        cardsDrawn: true,
      }
    });

    if (!userSession) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    // Fetch messages
    const sessionMessages = await db.query.messages.findMany({
      where: eq(messages.sessionId, sessionId),
      orderBy: [asc(messages.createdAt)],
    });

    return NextResponse.json({
      session: userSession,
      messages: sessionMessages,
    });
  } catch (error) {
    console.error('Session details error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { db } from '@/db';
import { sessions, messages, cardsDrawn } from '@/db/schema';
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

export async function DELETE(
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
    // Verify ownership
    const userSession = await db.query.sessions.findFirst({
      where: and(
        eq(sessions.id, sessionId),
        eq(sessions.userId, userId)
      ),
    });

    if (!userSession) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    // Delete related data and session in transaction
    await db.transaction(async (tx) => {
      // Delete messages
      await tx.delete(messages)
        .where(eq(messages.sessionId, sessionId));

      // Delete drawn cards
      await tx.delete(cardsDrawn)
        .where(eq(cardsDrawn.sessionId, sessionId));

      // Delete session
      await tx.delete(sessions)
        .where(eq(sessions.id, sessionId));
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete session error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

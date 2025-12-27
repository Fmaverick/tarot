import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { db } from '@/db';
import { users, redemptionCodes } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session || !session.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { code } = await req.json();
    if (!code) {
      return NextResponse.json({ error: 'Code is required' }, { status: 400 });
    }

    // Find the code
    const redemptionCode = await db.query.redemptionCodes.findFirst({
      where: eq(redemptionCodes.code, code),
    });

    if (!redemptionCode) {
      return NextResponse.json({ error: 'Invalid code' }, { status: 404 });
    }

    if (redemptionCode.isUsed) {
      return NextResponse.json({ error: 'Code already used' }, { status: 400 });
    }

    const userId = Number(session.userId);

    // Perform redemption in a transaction
    const result = await db.transaction(async (tx) => {
      // 1. Mark code as used
      await tx.update(redemptionCodes)
        .set({
          isUsed: true,
          usedBy: userId,
          usedAt: new Date(),
        })
        .where(eq(redemptionCodes.id, redemptionCode.id));

      // 2. Add credits to user
      const [updatedUser] = await tx.update(users)
        .set({
          creditBalance: (await tx.query.users.findFirst({
            where: eq(users.id, userId),
            columns: { creditBalance: true }
          }))!.creditBalance + redemptionCode.points
        })
        .where(eq(users.id, userId))
        .returning({ creditBalance: users.creditBalance });

      return updatedUser;
    });

    return NextResponse.json({ 
      success: true, 
      pointsAdded: redemptionCode.points,
      newBalance: result.creditBalance 
    });

  } catch (error) {
    console.error('Redemption error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

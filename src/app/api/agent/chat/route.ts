import { createOpenAI } from "@ai-sdk/openai";
import { streamText } from "ai";
import { PlacedCard } from "@/types/tarot";
import { getSession } from "@/lib/auth";
import { db } from "@/db";
import { users, sessions, messages as messagesTable, cardsDrawn } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getOrGenerateSephirothData } from "@/lib/sephiroth";
import { generateChatSystemPrompt } from "@/lib/agent/prompts";

export const maxDuration = 300;

export async function POST(req: Request) {
  const { messages, context, sessionId } = await req.json();
  const { spread, cards, question } = context || {};

  console.log("Agent Chat POST spread:", spread?.name);

  // Auth check
  const session = await getSession();
  if (!session || !session.userId) {
    return new Response("Unauthorized", { status: 401 });
  }

  const userId = Number(session.userId);

  // Check/Create Session
  if (!sessionId) {
     return new Response("Session ID required", { status: 400 });
  }

  const dbSession = await db.query.sessions.findFirst({
    where: eq(sessions.id, sessionId),
  });

  if (!dbSession) {
    // New Session - Deduct Credit
    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
    });

    if (!user || user.creditBalance < 1) {
      return new Response("Insufficient credits", { status: 402 });
    }

    // Check expiration
    if (user.creditsExpiresAt && new Date(user.creditsExpiresAt) < new Date()) {
      // Clear expired credits
      await db.update(users)
        .set({ creditBalance: 0 })
        .where(eq(users.id, userId));
      return new Response("Credits expired", { status: 402 });
    }

    // Start Transaction
    await db.transaction(async (tx) => {
      // Deduct credit
      await tx.update(users)
        .set({ creditBalance: user.creditBalance - 1 })
        .where(eq(users.id, userId));

      // Create session
      await tx.insert(sessions).values({
        id: sessionId,
        userId,
        spreadId: spread.id,
        question: question,
        mode: 'custom', // Mark as custom mode
        customSpreadConfig: JSON.stringify(spread), // Save spread config for custom mode
      });

      // Save cards
      if (cards && cards.length > 0) {
        for (const card of cards) {
           await tx.insert(cardsDrawn).values({
             sessionId,
             cardId: card.card.id,
             positionId: card.positionId,
             isReversed: card.isReversed,
           });
        }
      }
    });
  } else {
      // Session exists, but check if we need to save cards (e.g. for custom mode where cards are drawn later)
      if (cards && cards.length > 0) {
          // We should check if cards are already saved to avoid duplicates
          const existingCards = await db.query.cardsDrawn.findMany({
              where: eq(cardsDrawn.sessionId, sessionId)
          });
          
          if (existingCards.length === 0) {
              await db.transaction(async (tx) => {
                  for (const card of cards) {
                      await tx.insert(cardsDrawn).values({
                          sessionId,
                          cardId: card.card.id,
                          positionId: card.positionId,
                          isReversed: card.isReversed,
                      });
                  }
              });
          }
      }
  }

  // Save User Message
  const lastMessage = messages[messages.length - 1];
  if (lastMessage.role === 'user') {
    await db.insert(messagesTable).values({
      sessionId,
      role: 'user',
      content: lastMessage.content,
    });
  }

  // Update the latest spread_design message with the placed cards if provided
  if (cards && cards.length > 0) {
    try {
        const lastDesignMsg = await db.query.messages.findFirst({
            where: (m, { and, eq }) => and(
                eq(m.sessionId, sessionId),
                eq(m.role, 'assistant')
            ),
            orderBy: (m, { desc }) => [desc(m.createdAt)],
        });

        if (lastDesignMsg && lastDesignMsg.data) {
            const data = JSON.parse(lastDesignMsg.data);
            if (data.type === 'spread_design') {
                // Map cards back to the format expected in data.placedCards
                const placedCardsRecord: Record<string, PlacedCard> = {};
                cards.forEach((c: PlacedCard) => {
                    placedCardsRecord[c.positionId] = c;
                });

                await db.update(messagesTable)
                    .set({ 
                        data: JSON.stringify({ 
                            ...data, 
                            placedCards: placedCardsRecord 
                        }) 
                    })
                    .where(eq(messagesTable.id, lastDesignMsg.id));
            }
        }
    } catch (e) {
        console.error("Failed to update last design message with cards:", e);
    }
  }

  // Use environment variables for configuration
  const openai = createOpenAI({
    baseURL: process.env.OPENAI_BASE_URL,
    apiKey: process.env.OPENAI_API_KEY,
  });

  // Prepare Sephiroth Data if needed
  let sephirothDataObj = undefined;
  if (spread?.id === 'life-tree') {
      try {
          sephirothDataObj = await getOrGenerateSephirothData(sessionId, cards, question);
      } catch (e) {
          console.error("Failed to inject sephiroth data:", e);
      }
  }

  const systemPrompt = generateChatSystemPrompt(spread, cards, question, messages, sephirothDataObj);

  const result = await streamText({
    model: openai(process.env.OPENAI_MODEL || 'gpt-4o'),
    messages: [
      { role: "system", content: systemPrompt },
      ...messages,
    ],
    onFinish: async (completion) => {
        await db.insert(messagesTable).values({
            sessionId,
            role: 'assistant',
            content: completion.text,
        });
    }
  });

  return result.toDataStreamResponse();
}

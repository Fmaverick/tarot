import { createOpenAI } from "@ai-sdk/openai";
import { streamText } from "ai";
import { PlacedCard, SpreadPosition } from "@/types/tarot";
import { getSession } from "@/lib/auth";
import { db } from "@/db";
import { users, sessions, messages as messagesTable, cardsDrawn } from "@/db/schema";
import { eq } from "drizzle-orm";

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages, context, sessionId } = await req.json();
  const { spread, cards, question } = context || {};

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

  // Use environment variables for configuration
  const openai = createOpenAI({
    baseURL: process.env.OPENAI_BASE_URL,
    apiKey: process.env.OPENAI_API_KEY,
  });

  // Construct a detailed description of the spread
  const cardsDescription = cards.map((c: PlacedCard) => {
    const position = spread.positions.find((p: SpreadPosition) => p.id === c.positionId);
    return `- Position "${position?.name}" (${position?.description}): ${c.card.name} ${c.isReversed ? '(Reversed)' : '(Upright)'}
      Meaning: ${c.isReversed ? c.card.meaning_reversed : c.card.meaning_upright}`;
  }).join('\n');

  const systemPrompt = `You are a mystical and wise Tarot reader with an "Eastern Editorial Minimalism" tone. 
  Your readings are serene, poetic, and insightful, focusing on spiritual growth and clarity.
  
  The user has requested a reading using the "${spread.name}" spread.
  Spread Description: ${spread.description}
  
  The cards drawn are:
  ${cardsDescription}
  
  User's Question/Intent: "${question}"
  
  Provide a reading that follows these stylistic guidelines:
  1. TONE: Serene, light, and modern (avoid heavy or dark occult language).
  2. METAPHORS: Use nature-based metaphors (ink, water, mist, bamboo, stones, moon).
  3. STRUCTURE: Use a magazine editorial layout with breathing whitespace.
  4. LANGUAGE: Poetic but restrained. Use lowercase for section titles.
  
  RESPONSE STRUCTURE:
  - opening: A single poetic line that captures the spread's overall energy.
  
  - the spread: 
    Analyze the cards in their positions. Connect them to tell a cohesive story. 
    Do not just list meanings; weave them together.
    Focus on the interaction between positions (e.g., how the Past influences the Present).
  
  - the answer: 
    Directly address the user's question "${question}" based on the cards.
  
  - reflection: 
    A closing question or thought for the user to carry with them.
  
  IMPORTANT: 
  - Reply in the language of the user's question (e.g., if the question is in Chinese, reply in Chinese).
  - Do NOT use emojis.
  - Do NOT use bold markdown for section titles (use lowercase plain text).
  - Ensure there is double spacing between sections.
  - The tone should feel like a whisper in a quiet garden.`;

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

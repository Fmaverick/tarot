import { createOpenAI } from "@ai-sdk/openai";
import { generateObject } from "ai";
import { z } from "zod";
import { getSession } from "@/lib/auth";

export const maxDuration = 30;

export async function POST(req: Request) {
  // Auth check
  const session = await getSession();
  if (!session || !session.userId) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { messages, context } = await req.json();
  const { question } = context || {};

  const openai = createOpenAI({
    baseURL: process.env.OPENAI_BASE_URL,
    apiKey: process.env.OPENAI_API_KEY,
  });

  try {
    const result = await generateObject({
      model: openai(process.env.OPENAI_MODEL || 'gpt-4o'),
      schema: z.object({
        questions: z.array(z.string()).describe('3 short follow-up questions relevant to the reading'),
      }),
      system: `You are a helpful Tarot assistant.
      The user has received a reading for "${question}".
      Based on the conversation history and the reading, suggest 3 relevant follow-up questions the user might want to ask.
      Keep them short, concise, and in the same language as the conversation.
      Do not repeat the user's original question.`,
      messages: messages.map((m: { role: string; content: string }) => ({
        role: m.role,
        content: m.content,
      })),
    });

    return Response.json(result.object);
  } catch (error) {
    console.error('Suggestion generation error:', error);
    return Response.json({ questions: [] });
  }
}

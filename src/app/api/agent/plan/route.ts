import { createOpenAI } from "@ai-sdk/openai";
import { generateObject } from "ai";
import { z } from "zod";
import { getSession } from "@/lib/auth";
import { AgentPlanRequest } from "@/types/agent";
import { AGENT_PLAN_SYSTEM_PROMPT } from "@/lib/agent/prompts";
import { db } from "@/db";
import { messages as messagesTable, sessions, users } from "@/db/schema";
import { eq } from "drizzle-orm";

export const maxDuration = 60;

export async function POST(req: Request) {
  const body: AgentPlanRequest = await req.json();
  const { messages, sessionId, mode, currentSpread } = body;

  const session = await getSession();
  if (!session || !session.userId) {
    return new Response("Unauthorized", { status: 401 });
  }

  // Ensure session exists
  if (sessionId) {
    // Session existence check is handled below after generating the plan
  }

  const openai = createOpenAI({
    baseURL: process.env.OPENAI_BASE_URL,
    apiKey: process.env.OPENAI_API_KEY,
  });

  // Define the schema for the output
  const schema = z.object({
    action: z.enum(['DESIGN_SPREAD', 'DIRECT_REPLY']),
    spread: z.object({
      name: z.string(),
      description: z.string(),
      positions: z.array(z.object({
        id: z.string(),
        name: z.string(),
        description: z.string(),
      })),
    }).optional(),
    reasoning: z.string(),
  });

  const systemPrompt = AGENT_PLAN_SYSTEM_PROMPT(mode || 'macro', messages, currentSpread);

  try {
    const result = await generateObject({
      model: openai(process.env.OPENAI_MODEL || 'gpt-4o-mini'),
      schema: schema,
      prompt: systemPrompt,
      mode: 'json',
    });

    const plan = result.object;

    // --- Session Creation / Message Saving Logic ---
    if (sessionId) {
        // Check if session exists
        const existingSession = await db.query.sessions.findFirst({
            where: eq(sessions.id, sessionId),
        });

        // 1. Create Session if needed (and if we have a spread from the plan)
        if (!existingSession && plan.action === 'DESIGN_SPREAD' && plan.spread) {
             const userId = Number(session.userId);
             
             // Deduct Credit & Create Session
             const user = await db.query.users.findFirst({ where: eq(users.id, userId) });
             
             if (user && user.creditBalance > 0) {
                 await db.transaction(async (tx) => {
                     // Deduct credit
                     await tx.update(users)
                         .set({ creditBalance: user.creditBalance - 1 })
                         .where(eq(users.id, userId));

                     // Create session
                     await tx.insert(sessions).values({
                         id: sessionId,
                         userId,
                         spreadId: generateId(), // Generate a random ID for the custom spread
                         question: messages[messages.length - 1].content.toString(), // Use the last message as question
                         mode: 'custom',
                         customSpreadConfig: JSON.stringify(plan.spread),
                     });
                 });
             }
        }

        // 2. Save User Message
        // Now that session might be created, we can try saving the message.
        // We need to re-check session existence because we might have just created it.
        const dbSession = await db.query.sessions.findFirst({ where: eq(sessions.id, sessionId) });
        
        if (dbSession && messages.length > 0) {
             const lastMessage = messages[messages.length - 1];
             if (lastMessage.role === 'user') {
                 // Check if message already exists to avoid duplicates?
                 // Since 'plan' is usually called once per turn, it's safer.
                 // But 'chat' also saves user message. We need to prevent double saving.
                 // We can check if the last message in DB is same as this one.
                 
                 const lastDbMsg = await db.query.messages.findFirst({
                     where: eq(messagesTable.sessionId, sessionId),
                     orderBy: (messages, { desc }) => [desc(messages.createdAt)],
                 });

                 if (!lastDbMsg || lastDbMsg.content !== lastMessage.content) {
                     // Handle content
                     let contentStr = '';
                     if (typeof lastMessage.content === 'string') {
                        contentStr = lastMessage.content;
                    } else if (Array.isArray(lastMessage.content)) {
                        contentStr = (lastMessage.content as Array<{ type: string; text?: string }>)
                            .filter((part) => part.type === 'text')
                            .map((part) => part.text || '')
                            .join('\n');
                    }

                     if (contentStr) {
                         await db.insert(messagesTable).values({
                             sessionId,
                             role: 'user',
                             content: contentStr,
                         });
                     }
                 }
             }
        }

        // 3. Save Assistant Message (Plan Result)
        // We save the reasoning as the assistant's response so it appears in history.
        // For DESIGN_SPREAD, this message will be detected by frontend to attach the spread UI.
        if (plan.reasoning) {
            let content = plan.reasoning;
            
            // Ensure spread name is in the content for frontend detection logic
            if (plan.action === 'DESIGN_SPREAD' && plan.spread && !content.includes(plan.spread.name)) {
                content += `\n\n(Spread Designed: ${plan.spread.name})`;
            }

            await db.insert(messagesTable).values({
                sessionId,
                role: 'assistant',
                content: content,
                data: plan.action === 'DESIGN_SPREAD' ? JSON.stringify({ type: 'spread_design', spread: plan.spread }) : null,
            });
        }
    }
    // -----------------------------------------------

    return Response.json(result.object);
  } catch (error) {
    console.error("Agent Plan Error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}

function generateId() {
  return Math.random().toString(36).substring(2, 15);
}

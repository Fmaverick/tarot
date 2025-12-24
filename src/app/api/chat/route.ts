import { createOpenAI } from "@ai-sdk/openai";
import { streamText } from "ai";
import { PlacedCard, SpreadPosition } from "@/types/tarot";

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages, context, config } = await req.json();
  const { spread, cards, question } = context || {};
  const { baseUrl, apiKey, model } = config || {};

  // Use custom config if provided, otherwise fallback to environment variables
  const openai = createOpenAI({
    baseURL: baseUrl || process.env.OPENAI_BASE_URL,
    apiKey: apiKey || process.env.OPENAI_API_KEY,
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
    model: openai(model || process.env.OPENAI_MODEL || 'gpt-4o'),
    messages: [
      { role: "system", content: systemPrompt },
      ...messages,
    ],
  });

  return result.toDataStreamResponse();
}

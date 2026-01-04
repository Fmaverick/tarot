import { createOpenAI } from "@ai-sdk/openai";
import { generateText } from "ai";
import { NextResponse } from "next/server";
import { KLINE_TEMPLATE } from "@/lib/kline-template";

export const maxDuration = 300;

export async function POST(req: Request) {
  try {
    const { spread, cards, question } = await req.json();

    if (spread?.id !== "life-tree") {
      return NextResponse.json({ error: "Invalid spread for K-line chart" }, { status: 400 });
    }

    const openai = createOpenAI({
      baseURL: process.env.OPENAI_BASE_URL,
      apiKey: process.env.OPENAI_API_KEY,
    });

interface Card {
  name: string;
  meaning_upright: string;
  meaning_reversed: string;
}

interface PlacedCard {
  positionId: number;
  card: Card;
  isReversed: boolean;
}

    const cardsDescription = cards.map((c: PlacedCard) => {
      return `- 位置 ${c.positionId}: ${c.card.name} (${c.isReversed ? '逆位' : '正位'})
      含义: ${c.isReversed ? c.card.meaning_reversed : c.card.meaning_upright}`;
    }).join('\n');

    const systemPrompt = `你是一位精通塔罗与命运解读的大师。
当前使用的牌阵是“生命之树”（Tree of Life）。
用户的问题是：“${question}”

抽出的卡牌如下：
${cardsDescription}

你的任务是基于这些卡牌的解读，生成“人生K线图”所需的数据。
我们需要填充 10 个卡巴拉生命之树源质（Sephiroth）的数据。

请返回一个标准的 JSON 对象，不要包含任何 Markdown 格式。
JSON 结构如下：
{
  "sephirothData": [
    {
      "id": 1, // 1-10 对应十个源质
      "name": "源质名称(中文)",
      "energy": 8.5, // 能量值 1.0 - 10.0
      "volatility": 0.3, // 波动率 0.1 - 1.0
      "age": 65, // 关键影响年龄 0 - 80
      "color": "rgba(180, 180, 180, 0.9)" // 建议颜色
    },
    ... // 共10个对象
  ],
  "sephirothDescriptions": {
    "1": "针对该源质的简短解读（约50字），结合用户的牌面。",
    ... // 共10个键值对
  }
}

源质参考（你可以根据牌面调整能量和解读，但请保留这10个基本结构）：
1. Kether (王冠) - 灵性目标
2. Chokmah (智慧) - 创造力
3. Binah (理解) - 结构与接纳
4. Chesed (仁慈) - 扩张与恩典
5. Geburah (严厉) - 力量与判断
6. Tiphareth (美丽) - 核心与平衡
7. Netzach (胜利) - 情感与本能
8. Hod (荣耀) - 心智与沟通
9. Yesod (基础) - 潜意识
10. Malkuth (王国) - 物质结果

请确保 JSON 格式合法。`;

    let { text } = await generateText({
      model: openai(process.env.OPENAI_MODEL || "gpt-4o-mini"),
      prompt: systemPrompt,
    });

    // Strip markdown code blocks if present
    if (text.includes('```json')) {
      text = text.split('```json')[1].split('```')[0].trim();
    } else if (text.includes('```')) {
      text = text.split('```')[1].split('```')[0].trim();
    }

    // Parse JSON to validate
    const data = JSON.parse(text);
    
    // Inject data into template
    let html = KLINE_TEMPLATE.replace(
      '__SEPHIROTH_DATA__', 
      JSON.stringify(data.sephirothData, null, 2)
    );
    
    html = html.replace(
      '__SEPHIROTH_DESCRIPTIONS__',
      JSON.stringify(data.sephirothDescriptions, null, 2)
    );

    return NextResponse.json({ html });
  } catch (error) {
    console.error("Error generating K-line chart:", error);
    return NextResponse.json({ error: "Failed to generate K-line chart" }, { status: 500 });
  }
}

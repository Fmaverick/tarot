import { NextResponse } from "next/server";
import { KLINE_TEMPLATE } from "@/lib/kline-template";
import { getOrGenerateSephirothData } from "@/lib/sephiroth";

export const maxDuration = 300;

export async function POST(req: Request) {
  try {
    const { spread, cards, question, sessionId } = await req.json();

    if (spread?.id !== "life-tree") {
      return NextResponse.json({ error: "Invalid spread for K-line chart" }, { status: 400 });
    }

    const data = await getOrGenerateSephirothData(sessionId, cards, question);

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

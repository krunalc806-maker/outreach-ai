import { NextRequest, NextResponse } from "next/server";
import { replyIntelligence } from "@/lib/agent/replyIntelligence";

export async function GET() {
  return NextResponse.json({
    success: true,
    status: "HEALTHY",
    service: "Carrier & Nodal Webhook Ingestion",
    mode: "STANDBY_LISTENING",
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);
    if (!body) {
      return NextResponse.json({ success: false, error: "Empty webhook body" }, { status: 400 });
    }

    const eventType = body.event || body.type || "GENERAL_NOTIFICATION";
    const rawContent = typeof body.message === "string" ? body.message : JSON.stringify(body);
    const classification = replyIntelligence.analyzeMerchantReply(rawContent);

    return NextResponse.json({
      success: true,
      processedAt: new Date().toISOString(),
      eventType,
      classification: {
        category: classification.category,
        sentiment: classification.sentiment,
        extractedUtr: classification.extractedUtr,
        extractedTicketId: classification.extractedTicketId,
        isIssueResolved: classification.isIssueResolved,
        recommendedAction: classification.recommendedAction,
        summary: classification.summary,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message }, { status: 500 });
  }
}


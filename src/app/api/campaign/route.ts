import { NextRequest, NextResponse } from "next/server";
import { createDbCampaign, getDbOutreachSnapshot } from "@/lib/db/campaigns";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const snapshot = await getDbOutreachSnapshot(user?.id);
    return NextResponse.json({
      success: true,
      campaigns: snapshot.campaigns,
      stats: {
        totalSent: snapshot.campaigns.reduce((sum, c) => sum + c.sent, 0),
        totalReplies: snapshot.campaigns.reduce((sum, c) => sum + c.replies, 0),
      },
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);
    if (!body || !body.name) {
      return NextResponse.json({ success: false, error: "Batch name is required" }, { status: 400 });
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const result = await createDbCampaign({
      name: body.name,
      objective: body.objective,
      audience: body.audience,
      userId: user?.id,
    });

    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      createdBatch: result.campaign,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message }, { status: 500 });
  }
}

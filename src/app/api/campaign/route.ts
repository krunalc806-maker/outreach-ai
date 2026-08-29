import { NextRequest, NextResponse } from "next/server";
import { createDbCampaign, getDbOutreachSnapshot } from "@/lib/db/campaigns";
import { createClient } from "@/lib/supabase/server";
import { getDbProfile } from "@/lib/db/profiles";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    let { data: { user } } = await supabase.auth.getUser();

    let userId = user?.id;
    if (!userId) {
      const activeProfile = await getDbProfile();
      if (activeProfile && activeProfile.id && activeProfile.id !== "guest-user-evaluator") {
        userId = activeProfile.id;
      }
    }

    const snapshot = await getDbOutreachSnapshot(userId);
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
    let { data: { user } } = await supabase.auth.getUser();

    let userId = user?.id;
    if (!userId) {
      const activeProfile = await getDbProfile();
      if (activeProfile && activeProfile.id && activeProfile.id !== "guest-user-evaluator") {
        userId = activeProfile.id;
      }
    }

    const result = await createDbCampaign({
      name: body.name,
      objective: body.objective,
      audience: body.audience,
      userId: userId,
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

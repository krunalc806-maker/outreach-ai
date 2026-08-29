import { NextRequest, NextResponse } from "next/server";
import { getDbProfile, upsertDbProfile } from "@/lib/db/profiles";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  try {
    const profile = await getDbProfile();
    return NextResponse.json({
      success: true,
      user: {
        id: profile.id,
        email: profile.email,
        fullName: profile.full_name,
        role: profile.role,
        organization: profile.city,
        primaryObjective: profile.primary_objective,
        isOnboarded: profile.onboarding_completed,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const userId = user.id;
    const email = user.email || "";

    const result = await upsertDbProfile({
      id: userId,
      email,
      full_name: body?.fullName || user.user_metadata?.full_name || "Consumer",
      role: body?.role || "Individual Consumer",
      city: body?.organization || "Not provided",
      primary_objective: body?.primaryObjective || "ECOMMERCE_NDR_REFUND",
      onboarding_completed: true,
    });

    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Profile persisted successfully" });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message }, { status: 500 });
  }
}

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
    let { data: { user } } = await supabase.auth.getUser();

    let userId = user?.id;
    let email = user?.email;
    let defaultName = user?.user_metadata?.full_name || "Consumer";

    if (!user) {
      const activeProfile = await getDbProfile();
      if (activeProfile && activeProfile.id && activeProfile.id !== "guest-user-evaluator") {
        userId = activeProfile.id;
        email = activeProfile.email;
        defaultName = activeProfile.full_name;
      }
    }

    if (!userId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const updatedProfile = {
      id: userId,
      email: email || "",
      full_name: body?.fullName || defaultName,
      role: body?.role || "Individual Consumer",
      city: body?.organization || "Not provided",
      primary_objective: body?.primaryObjective || "ECOMMERCE_NDR_REFUND",
      onboarding_completed: true,
    };

    const result = await upsertDbProfile(updatedProfile);

    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: "Profile persisted successfully",
      user: {
        id: updatedProfile.id,
        email: updatedProfile.email,
        fullName: updatedProfile.full_name,
        role: updatedProfile.role,
        organization: updatedProfile.city,
        primaryObjective: updatedProfile.primary_objective,
        isOnboarded: updatedProfile.onboarding_completed,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message }, { status: 500 });
  }
}

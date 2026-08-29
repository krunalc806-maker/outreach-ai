import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";

export interface DbProfile {
  id: string;
  full_name: string;
  email: string;
  city: string;
  avatar_url?: string | null;
  role: string;
  primary_objective: string;
  onboarding_completed: boolean;
  created_at: string;
  updated_at: string;
}

const GUEST_PROFILE: DbProfile = {
  id: "guest-user-evaluator",
  email: "evaluator@outreachai.app",
  full_name: "Evaluator / Guest",
  city: "Not provided",
  avatar_url: null,
  role: "Judge / Evaluator",
  primary_objective: "ECOMMERCE_NDR_REFUND",
  onboarding_completed: true,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

/**
 * Fetch profile from Supabase 'profiles' table with authenticated user as source of truth
 */
export async function getDbProfile(userId?: string): Promise<DbProfile> {
  try {
    const supabase = await createClient();
    let targetUserId = userId;
    let authUser: any = null;

    const { data: { user } } = await supabase.auth.getUser();
    authUser = user;

    if (!authUser) {
      try {
        const cookieStore = await cookies();
        const sessionCookie = cookieStore.get("outreachai-user-session")?.value;
        if (sessionCookie) {
          const decoded = JSON.parse(Buffer.from(sessionCookie, "base64").toString("utf-8"));
          if (decoded?.email) {
            authUser = {
              id: decoded.id || `user-${Buffer.from(decoded.email).toString("hex").slice(0, 16)}`,
              email: decoded.email,
              user_metadata: {
                full_name: decoded.fullName,
                name: decoded.fullName,
                avatar_url: decoded.avatarUrl,
                is_onboarded: true,
              },
            };
          }
        }
      } catch {}
    }

    if (!targetUserId) {
      if (!authUser) return GUEST_PROFILE;
      targetUserId = authUser.id;
    }

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", targetUserId)
      .single();

    if (error || !data) {
      if (authUser && authUser.id === targetUserId) {
        const metadata = authUser.user_metadata || {};
        const realName = metadata.full_name || metadata.name || (authUser.email ? authUser.email.split("@")[0] : "Consumer");
        const realAvatar = metadata.avatar_url || metadata.picture || null;
        
        return {
          id: authUser.id,
          email: authUser.email || "",
          full_name: realName,
          city: metadata.organization || metadata.city || "Not provided",
          avatar_url: realAvatar,
          role: metadata.role || "Individual Consumer",
          primary_objective: metadata.primary_objective || "ECOMMERCE_NDR_REFUND",
          onboarding_completed: Boolean(metadata.is_onboarded),
          created_at: authUser.created_at || new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
      }
      return GUEST_PROFILE;
    }

    return {
      id: data.id,
      full_name: data.full_name || (authUser?.email ? authUser.email.split("@")[0] : "Consumer"),
      email: data.email || authUser?.email || "",
      city: data.city || "Not provided",
      avatar_url: data.avatar_url || authUser?.user_metadata?.avatar_url || authUser?.user_metadata?.picture || null,
      role: data.role || "Individual Consumer",
      primary_objective: data.primary_objective || "ECOMMERCE_NDR_REFUND",
      onboarding_completed: Boolean(data.onboarding_completed),
      created_at: data.created_at,
      updated_at: data.updated_at,
    };
  } catch {
    return GUEST_PROFILE;
  }
}

/**
 * Upsert profile in Supabase 'profiles' table
 */
export async function upsertDbProfile(profile: Partial<DbProfile> & { id: string }): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();
    const payload = {
      id: profile.id,
      full_name: profile.full_name || "",
      email: profile.email || "",
      city: profile.city || "Not provided",
      avatar_url: profile.avatar_url || null,
      role: profile.role || "Individual Consumer",
      primary_objective: profile.primary_objective || "ECOMMERCE_NDR_REFUND",
      onboarding_completed: profile.onboarding_completed ?? true,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase.from("profiles").upsert(payload, { onConflict: "id" });
    if (error) {
      console.warn("[upsertDbProfile Warning]:", error.message);
    }

    // Sync to auth.users metadata
    await supabase.auth.updateUser({
      data: {
        full_name: profile.full_name,
        role: profile.role,
        organization: profile.city,
        city: profile.city,
        primary_objective: profile.primary_objective,
        avatar_url: profile.avatar_url,
        is_onboarded: profile.onboarding_completed ?? true,
      },
    }).catch(() => null);

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || "Failed to persist profile" };
  }
}

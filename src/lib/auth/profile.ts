import { getDbProfile, upsertDbProfile } from "@/lib/db/profiles";
import { createClient } from "@/lib/supabase/server";

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
  role: string;
  organization?: string;
  primaryObjective: string;
  isOnboarded: boolean;
  createdAt: string;
  updatedAt: string;
}

export const DEFAULT_PROFILE: UserProfile = {
  id: "guest-user-evaluator",
  email: "",
  fullName: "Evaluator / Guest",
  avatarUrl: undefined,
  role: "Judge / Evaluator",
  organization: "Not provided",
  primaryObjective: "ECOMMERCE_NDR_REFUND",
  isOnboarded: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

/**
 * Fetch current authenticated profile from Supabase profiles table
 */
export async function getCurrentProfile(): Promise<UserProfile> {
  const dbProfile = await getDbProfile();
  return {
    id: dbProfile.id,
    email: dbProfile.email,
    fullName: dbProfile.full_name,
    avatarUrl: dbProfile.avatar_url || undefined,
    role: dbProfile.role,
    organization: dbProfile.city,
    primaryObjective: dbProfile.primary_objective,
    isOnboarded: dbProfile.onboarding_completed,
    createdAt: dbProfile.created_at,
    updatedAt: dbProfile.updated_at,
  };
}

/**
 * Update authenticated profile in Supabase profiles table
 */
export async function updateProfile(data: {
  fullName: string;
  role: string;
  organization?: string;
  primaryObjective: string;
  avatarUrl?: string;
}): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Authentication required to update profile." };
    }

    const result = await upsertDbProfile({
      id: user.id,
      email: user.email || "",
      full_name: data.fullName,
      role: data.role,
      city: data.organization || "Not provided",
      primary_objective: data.primaryObjective,
      avatar_url: data.avatarUrl || user.user_metadata?.avatar_url || user.user_metadata?.picture || null,
      onboarding_completed: true,
    });

    return result;
  } catch (err: any) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Unable to save profile in database.",
    };
  }
}

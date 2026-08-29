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

const inMemoryProfiles = new Map<string, DbProfile>();

function toValidUuid(id?: string | null): string | null {
  if (!id) return null;
  if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) {
    return id;
  }
  const hex = Buffer.from(id).toString("hex").padEnd(32, "0").slice(0, 32);
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-4${hex.slice(13, 16)}-a${hex.slice(17, 20)}-${hex.slice(20, 32)}`;
}

/**
 * Fetch profile from Supabase 'profiles' table with authenticated user as source of truth
 */
export async function getDbProfile(userId?: string): Promise<DbProfile> {
  try {
    const supabase = await createClient();
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
                role: decoded.role,
                city: decoded.city || decoded.organization,
                organization: decoded.organization || decoded.city,
                is_onboarded: true,
              },
            };
          }
        }
      } catch {}
    }

    const finalUserId = userId || authUser?.id;
    if (!finalUserId) {
      return GUEST_PROFILE;
    }

    // Check in-memory store
    const memProfile = inMemoryProfiles.get(finalUserId) || (authUser?.email ? inMemoryProfiles.get(authUser.email) : null);

    const uuid = toValidUuid(finalUserId);

    let dbProfileData: any = null;
    if (uuid) {
      try {
        const { data } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", uuid)
          .single();
        if (data) dbProfileData = data;
      } catch {}
    }

    if (dbProfileData) {
      return {
        id: finalUserId,
        full_name: dbProfileData.full_name || (authUser?.email ? authUser.email.split("@")[0] : "Consumer"),
        email: dbProfileData.email || authUser?.email || "",
        city: dbProfileData.city || "Not provided",
        avatar_url: dbProfileData.avatar_url || authUser?.user_metadata?.avatar_url || null,
        role: dbProfileData.role || "Individual Consumer",
        primary_objective: dbProfileData.primary_objective || "ECOMMERCE_NDR_REFUND",
        onboarding_completed: Boolean(dbProfileData.onboarding_completed),
        created_at: dbProfileData.created_at || new Date().toISOString(),
        updated_at: dbProfileData.updated_at || new Date().toISOString(),
      };
    }

    if (memProfile) {
      return memProfile;
    }

    if (authUser && authUser.id === finalUserId) {
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
    const uuid = toValidUuid(profile.id);

    const savedProfile: DbProfile = {
      id: profile.id,
      full_name: profile.full_name || "",
      email: profile.email || "",
      city: profile.city || "Not provided",
      avatar_url: profile.avatar_url || null,
      role: profile.role || "Individual Consumer",
      primary_objective: profile.primary_objective || "ECOMMERCE_NDR_REFUND",
      onboarding_completed: profile.onboarding_completed ?? true,
      created_at: profile.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    inMemoryProfiles.set(profile.id, savedProfile);
    if (profile.email) {
      inMemoryProfiles.set(profile.email, savedProfile);
    }

    if (uuid) {
      try {
        await supabase.from("profiles").upsert(
          {
            id: uuid,
            full_name: savedProfile.full_name,
            email: savedProfile.email,
            city: savedProfile.city,
            avatar_url: savedProfile.avatar_url,
            role: savedProfile.role,
            primary_objective: savedProfile.primary_objective,
            onboarding_completed: savedProfile.onboarding_completed,
            updated_at: savedProfile.updated_at,
          },
          { onConflict: "id" }
        );
      } catch (err: any) {
        console.warn("[upsertDbProfile Warning]:", err?.message);
      }
    }

    // Update session cookie if available
    try {
      const cookieStore = await cookies();
      const sessionData = {
        id: savedProfile.id,
        email: savedProfile.email,
        fullName: savedProfile.full_name,
        role: savedProfile.role,
        city: savedProfile.city,
        organization: savedProfile.city,
        avatarUrl: savedProfile.avatar_url,
      };
      cookieStore.set({
        name: "outreachai-user-session",
        value: Buffer.from(JSON.stringify(sessionData)).toString("base64"),
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      });
    } catch {}

    // Sync to auth.users metadata
    try {
      await supabase.auth.updateUser({
        data: {
          full_name: savedProfile.full_name,
          role: savedProfile.role,
          organization: savedProfile.city,
          city: savedProfile.city,
          primary_objective: savedProfile.primary_objective,
          avatar_url: savedProfile.avatar_url,
          is_onboarded: savedProfile.onboarding_completed,
        },
      });
    } catch {}

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || "Failed to persist profile" };
  }
}

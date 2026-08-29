"use server";

import { redirect } from "next/navigation";
import { headers, cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { updateProfile } from "@/lib/auth/profile";

export type AuthActionState = {
  error?: string;
  success?: string;
} | null;

/**
 * Sign in with email and password via Supabase server client
 */
export async function signInWithPasswordAction(
  email: string,
  password: string
): Promise<{ success: boolean; error?: string; errorCode?: string }> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (error) {
      if (
        error.message.toLowerCase().includes("email not confirmed") ||
        (error as any).code === "email_not_confirmed"
      ) {
        return {
          success: false,
          error:
            "Your email address has not been confirmed yet. Please check your inbox for the confirmation email, or click 'Resend Confirmation' below.",
          errorCode: "email_not_confirmed",
        };
      }
      if (error.message.toLowerCase().includes("invalid login credentials")) {
        return {
          success: false,
          error:
            "Invalid email or password credentials. If you just registered, please ensure your email is confirmed.",
          errorCode: "invalid_credentials",
        };
      }
      return { success: false, error: error.message };
    }

    if (!data.user) {
      return { success: false, error: "Authentication failed. No user returned." };
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || "Failed to sign in." };
  }
}

/**
 * Sign up with email and password via Supabase server client
 */
export async function signUpWithPasswordAction(
  fullName: string,
  email: string,
  password: string
): Promise<{ success: boolean; requiresEmailConfirmation?: boolean; error?: string }> {
  try {
    const supabase = await createClient();
    const origin = (await headers()).get("origin") || "http://localhost:3000";
    const emailRedirectTo = `${origin}/auth/confirm`;

    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        emailRedirectTo,
        data: {
          full_name: fullName.trim(),
          name: fullName.trim(),
        },
      },
    });

    if (error) {
      return { success: false, error: error.message };
    }

    if (data.user && !data.session) {
      return {
        success: true,
        requiresEmailConfirmation: true,
      };
    }

    return { success: true, requiresEmailConfirmation: false };
  } catch (err: any) {
    return { success: false, error: err?.message || "Failed to sign up." };
  }
}

/**
 * Resend confirmation email
 */
export async function resendConfirmationEmailAction(
  email: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();
    const origin = (await headers()).get("origin") || "http://localhost:3000";
    const emailRedirectTo = `${origin}/auth/confirm`;

    const { error } = await supabase.auth.resend({
      type: "signup",
      email: email.trim(),
      options: {
        emailRedirectTo,
      },
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || "Failed to resend confirmation email." };
  }
}

/**
 * Initiates Google OAuth via Supabase Auth
 */
export async function getGoogleOAuthUrl(nextPath = "/onboarding"): Promise<{ url?: string; error?: string }> {
  try {
    const supabase = await createClient();
    const origin = (await headers()).get("origin") || "http://localhost:3000";
    const redirectTo = `${origin}/auth/callback?next=${encodeURIComponent(nextPath)}`;

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo,
        queryParams: {
          access_type: "offline",
          prompt: "consent",
        },
      },
    });

    if (error) {
      return { error: error.message };
    }

    return { url: data.url };
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : "Unable to initiate Google authentication.",
    };
  }
}

/**
 * Save / Complete Onboarding Profile
 */
export async function saveOnboardingProfile(
  _prevState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const fullName = String(formData.get("fullName") || "").trim();
  const role = String(formData.get("role") || "").trim();
  const organization = String(formData.get("organization") || "").trim();
  const primaryObjective = String(formData.get("primaryObjective") || "").trim();
  const avatarUrl = String(formData.get("avatarUrl") || "").trim();

  if (!fullName || fullName.length < 2) {
    return { error: "Please enter your full name (at least 2 characters)." };
  }

  if (!role) {
    return { error: "Please select your primary role or use case." };
  }

  if (!primaryObjective) {
    return { error: "Please select what you are trying to resolve." };
  }

  const result = await updateProfile({
    fullName,
    role,
    organization,
    primaryObjective,
    avatarUrl,
  });

  if (!result.success) {
    return { error: result.error || "Failed to update profile." };
  }

  redirect("/dashboard");
}

/**
 * Server-side logout action that terminates session and explicitly wipes auth cookies
 */
export async function signOutAction(): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();
    await supabase.auth.signOut({ scope: "global" });
  } catch (err: any) {
    console.warn("[SignOutAction] Supabase signOut warning:", err?.message);
  }

  try {
    const cookieStore = await cookies();
    const allCookies = cookieStore.getAll();
    for (const cookie of allCookies) {
      if (
        cookie.name.startsWith("sb-") ||
        cookie.name.includes("auth-token") ||
        cookie.name.includes("supabase")
      ) {
        try {
          cookieStore.delete({ name: cookie.name, path: "/" });
          cookieStore.set(cookie.name, "", { maxAge: 0, path: "/", expires: new Date(0) });
        } catch {}
      }
    }
  } catch {}

  return { success: true };
}

/**
 * Complete sign out - clears Supabase session, destroys cookies, and redirects to /login
 */
export async function signOut() {
  await signOutAction();
  redirect("/login");
}

import { type NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = requestUrl.searchParams.get("next") || "/dashboard";
  const error = requestUrl.searchParams.get("error");
  const errorDescription = requestUrl.searchParams.get("error_description");
  const errorCode = requestUrl.searchParams.get("error_code");

  // 1. Handle explicit OAuth provider errors
  if (error || errorCode) {
    console.error(`[Auth Callback Error] Code: ${errorCode || error}, Description: ${errorDescription}`);
    const loginUrl = new URL("/login", requestUrl.origin);

    let userMessage = "Google sign-in could not be completed. Please try again.";
    if (error === "access_denied") {
      userMessage = "Google sign-in was cancelled or access was denied.";
    } else if (error === "redirect_uri_mismatch" || errorDescription?.includes("redirect_uri")) {
      userMessage = "OAuth Redirect URI configuration mismatch. Verify the callback URL in Google Cloud Console & Supabase.";
    } else if (errorDescription) {
      userMessage = errorDescription;
    }

    loginUrl.searchParams.set("error", userMessage);
    return NextResponse.redirect(loginUrl);
  }

  // 2. Process authorization code exchange
  if (code) {
    try {
      const supabase = await createClient();
      const { data: sessionData, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

      if (!exchangeError && sessionData?.user) {
        const user = sessionData.user;
        const isOnboarded = Boolean(user.user_metadata?.is_onboarded);
        const targetPath = isOnboarded ? next : "/onboarding";

        const redirectUrl = new URL(targetPath, requestUrl.origin);
        const response = NextResponse.redirect(redirectUrl);

        // Explicitly forward all cookies set by supabase.auth.exchangeCodeForSession onto the redirect response
        const cookieStore = await cookies();
        const allCookies = cookieStore.getAll();
        for (const cookie of allCookies) {
          response.cookies.set(cookie.name, cookie.value, {
            path: "/",
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production",
          });
        }

        return response;
      } else {
        console.error("[Auth Callback Exchange Error]:", exchangeError?.message || "No user returned from exchange");
      }
    } catch (err: any) {
      console.error("[Auth Callback Exception]:", err?.message);
    }
  }

  // 3. Fallback if missing code or exchange failure
  const loginUrl = new URL("/login", requestUrl.origin);
  loginUrl.searchParams.set("error", "Unable to establish authenticated Google session. Please try signing in again.");
  return NextResponse.redirect(loginUrl);
}

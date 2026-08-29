"use client";

import { createClient } from "@/lib/supabase/client";
import { signOutAction } from "@/actions/auth";

/**
 * Performs a comprehensive, full-stack sign out:
 * 1. Signs out client-side Supabase session (clearing memory singletons).
 * 2. Clears all localStorage and sessionStorage tokens matching sb-* and supabase.
 * 3. Clears document.cookie entries.
 * 4. Calls server-side signOutAction & /api/auth POST to destroy server cookies.
 * 5. Performs a clean window.location redirect to /login.
 */
export async function logoutUser(): Promise<void> {
  try {
    // 1. Client-side Supabase signOut
    try {
      const supabase = createClient();
      await supabase.auth.signOut({ scope: "local" });
    } catch (e) {
      console.warn("Client Supabase signOut:", e);
    }

    // 2. Clear browser storage tokens
    if (typeof window !== "undefined") {
      try {
        const localKeysToRemove: string[] = [];
        for (let i = 0; i < window.localStorage.length; i++) {
          const key = window.localStorage.key(i);
          if (key && (key.startsWith("sb-") || key.includes("supabase") || key.includes("auth-token"))) {
            localKeysToRemove.push(key);
          }
        }
        localKeysToRemove.forEach((key) => window.localStorage.removeItem(key));

        const sessionKeysToRemove: string[] = [];
        for (let i = 0; i < window.sessionStorage.length; i++) {
          const key = window.sessionStorage.key(i);
          if (key && (key.startsWith("sb-") || key.includes("supabase") || key.includes("auth-token"))) {
            sessionKeysToRemove.push(key);
          }
        }
        sessionKeysToRemove.forEach((key) => window.sessionStorage.removeItem(key));

        // Expire document.cookie entries
        const cookieNames = document.cookie.split(";").map((c) => c.trim().split("=")[0]);
        for (const name of cookieNames) {
          if (
            name.startsWith("sb-") ||
            name.includes("auth-token") ||
            name.includes("supabase") ||
            name === "outreachai-user-session"
          ) {
            document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; max-age=0; SameSite=Lax`;
          }
        }
      } catch (storageErr) {
        console.warn("Storage cleanup warning:", storageErr);
      }
    }

    // 3. Server-side cleanup via API and server action
    try {
      await fetch("/api/auth", { method: "POST" });
    } catch {}

    try {
      await signOutAction();
    } catch {}

    // 4. Clean navigation to /login
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
  } catch (err) {
    console.error("Logout exception:", err);
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
  }
}


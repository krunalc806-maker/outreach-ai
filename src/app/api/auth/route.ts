import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      return NextResponse.json({
        authenticated: true,
        user: {
          id: user.id,
          email: user.email,
          fullName: user.user_metadata?.full_name || user.email?.split("@")[0] || "Consumer",
          avatarUrl: user.user_metadata?.avatar_url || user.user_metadata?.picture || null,
        },
      });
    }

    // Check custom session cookie
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("outreachai-user-session")?.value;
    if (sessionCookie) {
      try {
        const decoded = JSON.parse(Buffer.from(sessionCookie, "base64").toString("utf-8"));
        if (decoded?.email) {
          return NextResponse.json({
            authenticated: true,
            user: {
              id: decoded.id || "user-direct",
              email: decoded.email,
              fullName: decoded.fullName || decoded.email.split("@")[0] || "Consumer",
              avatarUrl: decoded.avatarUrl || null,
            },
          });
        }
      } catch {}
    }

    return NextResponse.json({ authenticated: false, user: null });
  } catch (err: any) {
    return NextResponse.json({ authenticated: false, error: err?.message || "Internal error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    await supabase.auth.signOut({ scope: "global" });
  } catch (err: any) {
    console.warn("[API Auth POST] Supabase signOut warning:", err?.message);
  }

  const cookieStore = await cookies();
  const allCookies = cookieStore.getAll();
  const deletedCookies: string[] = [];

  for (const cookie of allCookies) {
    if (
      cookie.name.startsWith("sb-") ||
      cookie.name.includes("auth-token") ||
      cookie.name.includes("supabase") ||
      cookie.name === "outreachai-user-session"
    ) {
      try {
        cookieStore.delete({ name: cookie.name, path: "/" });
        cookieStore.set(cookie.name, "", { maxAge: 0, path: "/", expires: new Date(0) });
        deletedCookies.push(cookie.name);
      } catch {}
    }
  }

  const response = NextResponse.json({
    success: true,
    authenticated: false,
    message: "Signed out successfully",
  });

  for (const name of deletedCookies) {
    response.cookies.set(name, "", {
      maxAge: 0,
      path: "/",
      expires: new Date(0),
      sameSite: "lax",
    });
  }

  response.cookies.set("outreachai-user-session", "", {
    maxAge: 0,
    path: "/",
    expires: new Date(0),
    sameSite: "lax",
  });

  return response;
}

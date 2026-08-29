import { NextResponse, type NextRequest } from "next/server";

const PUBLIC_PATHS = new Set([
  "/",
  "/login",
  "/register",
  "/auth/callback",
  "/auth/confirm",
  "/demo",
  "/evidence",
  "/privacy",
  "/terms",
  "/favicon.ico",
]);

function hasValidSupabaseSession(cookies: { name: string; value: string }[]): boolean {
  return cookies.some((c) => {
    // Ignore PKCE verifier, csrf, provider tokens, and empty/deleted cookies
    if (
      c.name.includes("-code-verifier") ||
      c.name.includes("-csrf") ||
      c.name.includes("provider") ||
      !c.value ||
      c.value === "deleted" ||
      c.value === '""' ||
      c.value.trim().length < 20
    ) {
      return false;
    }

    // Must be an actual Supabase session token or direct auth session
    const isSessionCookieName =
      (c.name.startsWith("sb-") && c.name.includes("-auth-token")) ||
      c.name === "supabase-auth-token" ||
      c.name === "outreachai-user-session" ||
      c.name.includes("sb-access-token");

    return isSessionCookieName;
  });
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Immediately pass through Next.js internals, static files, and APIs
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // 2. Synchronous cookie check for authenticated Supabase session
  const cookies = request.cookies.getAll();
  const isAuthenticated = hasValidSupabaseSession(cookies);

  // 3. If authenticated user attempts to visit login/register, redirect to dashboard
  if ((pathname === "/login" || pathname === "/register") && isAuthenticated) {
    const dashboardUrl = request.nextUrl.clone();
    dashboardUrl.pathname = "/dashboard";
    dashboardUrl.search = "";
    return NextResponse.redirect(dashboardUrl);
  }

  // 4. If public path, allow access
  if (PUBLIC_PATHS.has(pathname)) {
    return NextResponse.next();
  }

  // 5. If unauthenticated trying to access protected workspace, redirect to login
  if (!isAuthenticated) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

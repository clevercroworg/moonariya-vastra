import { NextResponse } from "next/server";
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isLoginPage = createRouteMatcher(["/admin/login(.*)"]);

// Only the admin area runs through Clerk — the shop stays fully static and fast.
// Signed-out visitors are sent to the branded login page; API calls get a 401.
// (The email allowlist is enforced on the server in src/lib/admin-auth.ts.)
export default clerkMiddleware(async (auth, req) => {
  if (isLoginPage(req)) return;
  const { userId } = await auth();
  if (userId) return;

  if (req.nextUrl.pathname.startsWith("/api/")) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }
  const login = new URL("/admin/login", req.url);
  login.searchParams.set("redirect_url", req.nextUrl.pathname);
  return NextResponse.redirect(login);
});

export const config = {
  matcher: ["/admin", "/admin/:path*", "/api/admin/:path*"],
};

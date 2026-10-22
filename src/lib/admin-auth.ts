import "server-only";
import { auth, currentUser } from "@clerk/nextjs/server";

/** Comma-separated list of email addresses allowed into the admin (env ADMIN_EMAILS). */
export const adminEmails = () =>
  (process.env.ADMIN_EMAILS ?? "")
    .split(/[\s,;]+/)
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);

export type AdminState =
  | { status: "signed-out" }
  | { status: "forbidden"; email: string | null; configured: boolean }
  | { status: "ok"; email: string; name: string; imageUrl: string };

/**
 * Signed in with Clerk AND a verified email on the ADMIN_EMAILS allowlist.
 * Anyone else — even with a Clerk account — is refused.
 */
export async function getAdminState(): Promise<AdminState> {
  const { userId } = await auth();
  if (!userId) return { status: "signed-out" };
  const user = await currentUser();
  if (!user) return { status: "signed-out" };

  const verified = user.emailAddresses
    .filter((e) => e.verification?.status === "verified")
    .map((e) => e.emailAddress.toLowerCase());
  const allowed = adminEmails();
  const match = verified.find((e) => allowed.includes(e));
  if (!match) {
    return {
      status: "forbidden",
      email: user.primaryEmailAddress?.emailAddress ?? verified[0] ?? null,
      configured: allowed.length > 0,
    };
  }
  return {
    status: "ok",
    email: match,
    name: user.firstName || user.fullName || match.split("@")[0],
    imageUrl: user.imageUrl,
  };
}

/** Guard for every admin Server Action and API route. */
export async function requireAdmin() {
  const state = await getAdminState();
  if (state.status !== "ok") throw new Error("You are not authorised to make changes.");
  return state;
}

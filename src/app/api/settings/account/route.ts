import { NextResponse } from "next/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { verifySameOriginRequest } from "@/lib/security/request-origin";
import { checkSettingsRateLimit } from "@/lib/security/settings-rate-limit";

export async function DELETE(request: Request) {
  const originCheck = verifySameOriginRequest(request);
  if (!originCheck.ok) return originCheck.response;

  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Very strict rate limit: 3 attempts per hour
  const rateLimited = checkSettingsRateLimit(user.id, "account-delete", 3, 3_600_000);
  if (rateLimited) return rateLimited;

  // Require password verification before irreversible account deletion
  let body: Record<string, unknown> = {};
  try {
    body = await request.json();
  } catch {
    // DELETE requests may not always have a body — require it here
  }

  const { password } = body as { password?: string };
  if (!password || typeof password !== "string") {
    return NextResponse.json(
      { error: "Password is required to delete your account" },
      { status: 400 }
    );
  }

  // Verify password
  const { error: verifyError } = await supabase.auth.signInWithPassword({
    email: user.email!,
    password,
  });

  if (verifyError) {
    return NextResponse.json(
      { error: "Incorrect password" },
      { status: 403 }
    );
  }

  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceRoleKey) {
    return NextResponse.json(
      { error: "Server configuration error" },
      { status: 500 }
    );
  }

  // Admin client with service_role key to delete from auth.users
  const supabaseAdmin = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    serviceRoleKey
  );

  // Sign out first so the session cookie is cleared
  await supabase.auth.signOut();

  // Delete the auth user — cascades to profiles and reviews via FK
  const { error } = await supabaseAdmin.auth.admin.deleteUser(user.id);

  if (error) {
    console.error("Failed to delete user:", user.id, error.message);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}

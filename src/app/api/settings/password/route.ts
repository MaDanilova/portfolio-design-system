import { NextResponse } from "next/server";
import { verifySameOriginRequest } from "@/lib/security/request-origin";
import { validatePasswordStrength } from "@/lib/security/password";
import { checkSettingsRateLimit } from "@/lib/security/settings-rate-limit";

export async function PATCH(request: Request) {
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

  // Stricter rate limit for password changes (5 req/min)
  const rateLimited = checkSettingsRateLimit(user.id, "password", 5);
  if (rateLimited) return rateLimited;

  const body = await request.json();
  const { current_password, password } = body;

  // Require current password to prevent session-theft account takeover
  if (!current_password || typeof current_password !== "string") {
    return NextResponse.json(
      { error: "Current password is required" },
      { status: 400 }
    );
  }

  if (!password || typeof password !== "string") {
    return NextResponse.json(
      { error: "New password is required" },
      { status: 400 }
    );
  }

  // Verify current password before allowing change
  const { error: verifyError } = await supabase.auth.signInWithPassword({
    email: user.email!,
    password: current_password,
  });

  if (verifyError) {
    return NextResponse.json(
      { error: "Current password is incorrect" },
      { status: 403 }
    );
  }

  // Validate new password strength
  const strength = validatePasswordStrength(password);
  if (!strength.valid) {
    return NextResponse.json(
      { error: strength.errors[0] },
      { status: 400 }
    );
  }

  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    console.error("Password update failed:", error.message);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}

import { NextResponse } from "next/server";
import { verifySameOriginRequest } from "@/lib/security/request-origin";
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

  const rateLimited = checkSettingsRateLimit(user.id, "profile");
  if (rateLimited) return rateLimited;

  const body = await request.json();
  const { full_name } = body;

  if (!full_name || typeof full_name !== "string" || full_name.trim().length === 0) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }

  const trimmedName = full_name.trim();
  if (trimmedName.length > 100) {
    return NextResponse.json({ error: "Name must be 100 characters or fewer" }, { status: 400 });
  }

  const { error } = await supabase
    .from("profiles")
    .update({ full_name: trimmedName })
    .eq("id", user.id);

  if (error) {
    console.error("Profile update failed:", error.message);
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 });
  }

  // Also update user metadata so it stays in sync
  await supabase.auth.updateUser({
    data: { full_name: trimmedName },
  });

  return NextResponse.json({ success: true });
}

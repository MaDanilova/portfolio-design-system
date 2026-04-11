import { NextResponse } from "next/server";
import { verifySameOriginRequest } from "@/lib/security/request-origin";
import { settingsFocusValues } from "@/lib/constants";
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

  const rateLimited = checkSettingsRateLimit(user.id, "preferences");
  if (rateLimited) return rateLimited;

  const body = await request.json();
  const { default_focus, typography_audit, storytelling, email_notify } = body;

  // Validate all fields
  if (typeof default_focus !== "string" || !settingsFocusValues.includes(default_focus)) {
    return NextResponse.json(
      { error: "Invalid review focus value" },
      { status: 400 }
    );
  }
  if (typeof typography_audit !== "boolean") {
    return NextResponse.json(
      { error: "typography_audit must be a boolean" },
      { status: 400 }
    );
  }
  if (typeof storytelling !== "boolean") {
    return NextResponse.json(
      { error: "storytelling must be a boolean" },
      { status: 400 }
    );
  }
  if (typeof email_notify !== "boolean") {
    return NextResponse.json(
      { error: "email_notify must be a boolean" },
      { status: 400 }
    );
  }

  const { error } = await supabase
    .from("profiles")
    .update({
      default_focus,
      typography_audit,
      storytelling,
      email_notify,
    })
    .eq("id", user.id);

  if (error) {
    console.error("Preferences update failed:", error.message);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}

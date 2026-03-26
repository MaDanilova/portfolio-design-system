import { NextResponse } from "next/server";

export async function PATCH(request: Request) {
  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { full_name } = body;

  if (!full_name || typeof full_name !== "string" || full_name.trim().length === 0) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }

  const { error } = await supabase
    .from("profiles")
    .update({ full_name: full_name.trim() })
    .eq("id", user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Also update user metadata so it stays in sync
  await supabase.auth.updateUser({
    data: { full_name: full_name.trim() },
  });

  return NextResponse.json({ success: true });
}

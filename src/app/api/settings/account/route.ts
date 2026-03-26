import { NextResponse } from "next/server";

export async function DELETE() {
  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Delete reviews first (cascade should handle this, but be explicit)
  await supabase.from("reviews").delete().eq("user_id", user.id);

  // Delete profile (cascade from auth.users will also handle this)
  await supabase.from("profiles").delete().eq("id", user.id);

  // Sign out the user's session
  await supabase.auth.signOut();

  // Note: Deleting the auth.users row requires a service_role key or
  // Supabase edge function. For now we clear all user data and sign out.
  // The auth row can be cleaned up via Supabase dashboard or a scheduled function.

  return NextResponse.json({ success: true });
}

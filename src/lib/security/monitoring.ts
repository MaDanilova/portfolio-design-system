type SecurityEventDetails = Record<string, string | number | boolean | undefined>;

/**
 * Log a security event. Always writes to console, and attempts to persist
 * to the Supabase `security_logs` table if the server client is available.
 *
 * Persistence is best-effort — failures are caught silently so security
 * logging never blocks or breaks the request it's attached to.
 */
export function logSecurityEvent(
  event: string,
  details: SecurityEventDetails = {}
) {
  const timestamp = new Date().toISOString();

  // Always log to console (available in all environments)
  console.warn("[security]", timestamp, event, details);

  // Best-effort persist to Supabase (non-blocking)
  persistToSupabase(event, details, timestamp).catch(() => {
    // Silently swallow — we already have the console log
  });
}

async function persistToSupabase(
  event: string,
  details: SecurityEventDetails,
  timestamp: string,
) {
  // Only attempt if Supabase is configured
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    return;
  }

  try {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();

    await supabase.from("security_logs").insert({
      event,
      details,
      created_at: timestamp,
    });
  } catch {
    // Best-effort: if table doesn't exist or insert fails, that's OK
  }
}

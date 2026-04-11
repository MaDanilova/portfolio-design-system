import { NextResponse } from "next/server";
import { takeRateLimit } from "@/lib/security/rate-limit";
import { logSecurityEvent } from "@/lib/security/monitoring";

/**
 * Apply rate limiting to a settings endpoint.
 * Returns null if allowed, or a 429 NextResponse if rate limited.
 */
export function checkSettingsRateLimit(
  userId: string,
  endpoint: string,
  limit = 10,
  windowMs = 60_000,
): NextResponse | null {
  const result = takeRateLimit({
    namespace: `settings:${endpoint}`,
    identifier: userId,
    limit,
    windowMs,
  });

  if (!result.allowed) {
    logSecurityEvent("settings_rate_limited", {
      userId,
      endpoint,
      retryAfter: result.retryAfterSeconds,
    });
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      {
        status: 429,
        headers: { "Retry-After": String(result.retryAfterSeconds) },
      },
    );
  }

  return null;
}

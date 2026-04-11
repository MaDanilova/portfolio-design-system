import { NextResponse } from "next/server";
import { takeRateLimit } from "@/lib/security/rate-limit";
import { logSecurityEvent } from "@/lib/security/monitoring";
import { validatePasswordStrength } from "@/lib/security/password";

function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return request.headers.get("x-real-ip") ?? "unknown";
}

export async function POST(request: Request) {
  const clientIp = getClientIp(request);

  // Rate limit: 5 registrations per hour per IP
  const ipCheck = takeRateLimit({
    namespace: "register-ip",
    identifier: clientIp,
    limit: 5,
    windowMs: 3_600_000,
  });

  if (!ipCheck.allowed) {
    logSecurityEvent("register_rate_limited", {
      ip: clientIp,
      retryAfterSeconds: ipCheck.retryAfterSeconds,
    });
    return NextResponse.json(
      { error: "Too many registration attempts. Please try again later." },
      {
        status: 429,
        headers: { "Retry-After": String(ipCheck.retryAfterSeconds) },
      },
    );
  }

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const { full_name, email, password } = body as {
    full_name?: string;
    email?: string;
    password?: string;
  };

  // Validate inputs
  if (!full_name || typeof full_name !== "string" || full_name.trim().length === 0) {
    return NextResponse.json({ error: "Full name is required" }, { status: 400 });
  }
  if (full_name.trim().length > 100) {
    return NextResponse.json({ error: "Name must be 100 characters or fewer" }, { status: 400 });
  }
  if (!email || typeof email !== "string") {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }
  // Basic email format check
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Please enter a valid email" }, { status: 400 });
  }
  if (!password || typeof password !== "string") {
    return NextResponse.json({ error: "Password is required" }, { status: 400 });
  }

  // Validate password strength
  const strength = validatePasswordStrength(password);
  if (!strength.valid) {
    return NextResponse.json({ error: strength.errors[0] }, { status: 400 });
  }

  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();

  const { error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: full_name.trim() },
    },
  });

  if (authError) {
    // Generic message to prevent email enumeration
    console.error("Registration failed:", authError.message);
    return NextResponse.json(
      { error: "Unable to create account. Please try again or use a different email." },
      { status: 400 },
    );
  }

  return NextResponse.json({ success: true });
}

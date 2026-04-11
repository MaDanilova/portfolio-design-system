import { NextResponse } from "next/server";
import { logSecurityEvent } from "@/lib/security/monitoring";

type OriginCheckMode = "monitor" | "enforce";

function getOriginCheckMode(): OriginCheckMode {
  // Default to enforce in production for security; monitor mode only when explicitly opted in
  const mode = process.env.SECURITY_ORIGIN_CHECK_MODE;
  return mode === "monitor" ? "monitor" : "enforce";
}

function isSameOrigin(requestOrigin: string, expectedOrigin: string): boolean {
  return requestOrigin.toLowerCase() === expectedOrigin.toLowerCase();
}

export function verifySameOriginRequest(
  request: Request
): { ok: true } | { ok: false; response: NextResponse } {
  const mode = getOriginCheckMode();
  const expectedOrigin = new URL(request.url).origin;
  const originHeader = request.headers.get("origin");
  const refererHeader = request.headers.get("referer");

  const originOk = originHeader
    ? isSameOrigin(originHeader, expectedOrigin)
    : Boolean(refererHeader?.startsWith(`${expectedOrigin}/`));

  if (originOk) {
    return { ok: true };
  }

  logSecurityEvent("origin_check_failed", {
    mode,
    expectedOrigin,
    originHeader: originHeader ?? "missing",
    refererHeader: refererHeader ?? "missing",
  });

  if (mode === "monitor") {
    return { ok: true };
  }

  return {
    ok: false,
    response: NextResponse.json({ error: "Forbidden" }, { status: 403 }),
  };
}

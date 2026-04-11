import { beforeEach, describe, expect, it, vi } from "vitest";

const mockGetUser = vi.fn();
const mockUpdate = vi.fn();
const mockEq = vi.fn();
const mockFrom = vi.fn();
const mockCreateClient = vi.fn();

vi.mock("@/lib/supabase/server", () => ({
  createClient: mockCreateClient,
}));

import { PATCH as patchProfile } from "@/app/api/settings/profile/route";

describe("settings origin check", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.SECURITY_ORIGIN_CHECK_MODE = "enforce";

    mockEq.mockResolvedValue({ error: null });
    mockUpdate.mockReturnValue({ eq: mockEq });
    mockFrom.mockReturnValue({ update: mockUpdate });
    mockGetUser.mockResolvedValue({ data: { user: { id: "user-1" } } });
    mockCreateClient.mockResolvedValue({
      auth: { getUser: mockGetUser, updateUser: vi.fn() },
      from: mockFrom,
    });
  });

  it("blocks requests from mismatched origins when enforce mode is enabled", async () => {
    const request = new Request("https://app.example.com/api/settings/profile", {
      method: "PATCH",
      headers: {
        "content-type": "application/json",
        origin: "https://evil.example.com",
      },
      body: JSON.stringify({ full_name: "Demo User" }),
    });

    const response = await patchProfile(request);

    expect(response.status).toBe(403);
    expect(mockCreateClient).not.toHaveBeenCalled();
  });

  it("allows same-origin requests in enforce mode", async () => {
    const request = new Request("https://app.example.com/api/settings/profile", {
      method: "PATCH",
      headers: {
        "content-type": "application/json",
        origin: "https://app.example.com",
      },
      body: JSON.stringify({ full_name: "Demo User" }),
    });

    const response = await patchProfile(request);
    const payload = (await response.json()) as { success?: boolean };

    expect(response.status).toBe(200);
    expect(payload.success).toBe(true);
  });
});

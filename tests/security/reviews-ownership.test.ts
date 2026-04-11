import { beforeEach, describe, expect, it, vi } from "vitest";

const mockGetUser = vi.fn();
const mockFrom = vi.fn();

vi.mock("@/lib/supabase/client", () => ({
  createClient: vi.fn(() => ({
    auth: {
      getUser: mockGetUser,
    },
    from: mockFrom,
  })),
}));

import { deleteReview, getReview, listReviews } from "@/lib/reviews";

describe("reviews ownership filters", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("scopes getReview query by user_id", async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: "user-1" } } });
    const secondEq = vi.fn().mockReturnValue({
      single: vi.fn().mockResolvedValue({ data: null, error: null }),
    });
    const eq = vi.fn().mockReturnValue({
      eq: secondEq,
    });

    mockFrom.mockReturnValue({
      select: vi.fn().mockReturnValue({ eq }),
    });

    await getReview("review-1");

    expect(eq).toHaveBeenCalledWith("id", "review-1");
    expect(secondEq).toHaveBeenCalledWith("user_id", "user-1");
  });

  it("returns empty list when user is missing", async () => {
    mockGetUser.mockResolvedValue({ data: { user: null } });

    const reviews = await listReviews();

    expect(reviews).toEqual([]);
    expect(mockFrom).not.toHaveBeenCalled();
  });

  it("throws on deleteReview when not authenticated", async () => {
    mockGetUser.mockResolvedValue({ data: { user: null } });

    await expect(deleteReview("review-1")).rejects.toThrow("Not authenticated");
  });
});

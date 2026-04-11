import { beforeEach, describe, expect, it, vi } from "vitest";
import { resetRateLimitsForTests } from "@/lib/security/rate-limit";

const mockGetUser = vi.fn();
const mockCreateCompletion = vi.fn();

vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(async () => ({
    auth: {
      getUser: mockGetUser,
    },
  })),
}));

vi.mock("openai", () => ({
  default: class OpenAI {
    chat = {
      completions: {
        create: mockCreateCompletion,
      },
    };
  },
}));

import { POST } from "@/app/api/review/route";

function createRequest(body: Record<string, unknown>) {
  return new Request("http://localhost/api/review", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-forwarded-for": "1.2.3.4",
    },
    body: JSON.stringify(body),
  });
}

describe("/api/review security", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    resetRateLimitsForTests();
    process.env.REVIEW_RATE_LIMIT_IP = "100";
    process.env.REVIEW_RATE_LIMIT_IP_WINDOW_MS = "60000";
    process.env.REVIEW_RATE_LIMIT_USER = "100";
    process.env.REVIEW_RATE_LIMIT_USER_WINDOW_MS = "60000";
  });

  it("returns 401 for unauthenticated requests", async () => {
    mockGetUser.mockResolvedValue({ data: { user: null } });

    const response = await POST(createRequest({ url: "https://example.com" }));

    expect(response.status).toBe(401);
    expect(mockCreateCompletion).not.toHaveBeenCalled();
  });

  it("returns structured review for authenticated request", async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: "user-1" } } });
    mockCreateCompletion.mockResolvedValue({
      choices: [
        {
          message: {
            content: JSON.stringify({
              overall: 7,
              scores: {
                positioning: 7,
                caseStudy: 7,
                visualDesign: 7,
                strategicDepth: 7,
                aiTools: 7,
                personality: 7,
                infoArchitecture: 7,
                copywriting: 7,
                accessibility: 7,
              },
              summary: "Solid work.",
              strengths: ["Strong hierarchy"],
              improvements: ["Improve contrast"],
              pages: [
                {
                  id: "home",
                  name: "Homepage",
                  score: 7,
                  feedback: [{ text: "Good structure", severity: "strong" }],
                },
              ],
              recommendations: [
                {
                  priority: 1,
                  title: "Improve CTA contrast",
                  description: "Boost visual clarity.",
                  category: "visual",
                },
              ],
            }),
          },
        },
      ],
    });

    const response = await POST(
      createRequest({
        url: "https://example.com",
        focus: "full",
        pageType: "Homepage",
        level: "Mid",
      })
    );
    const payload = (await response.json()) as Record<string, unknown>;

    expect(response.status).toBe(200);
    expect(payload).toHaveProperty("overall");
    expect(payload).toHaveProperty("scores");
    expect(payload).toHaveProperty("summary");
  });

  it("rate limits repeated requests per user", async () => {
    process.env.REVIEW_RATE_LIMIT_USER = "1";
    mockGetUser.mockResolvedValue({ data: { user: { id: "user-2" } } });
    mockCreateCompletion.mockResolvedValue({
      choices: [
        {
          message: {
            content: JSON.stringify({
              overall: 7,
              scores: {
                positioning: 7,
                caseStudy: 7,
                visualDesign: 7,
                strategicDepth: 7,
                aiTools: 7,
                personality: 7,
                infoArchitecture: 7,
                copywriting: 7,
                accessibility: 7,
              },
              summary: "Good.",
              strengths: ["A"],
              improvements: ["B"],
              pages: [
                {
                  id: "p1",
                  name: "Page",
                  score: 7,
                  feedback: [{ text: "ok", severity: "strong" }],
                },
              ],
              recommendations: [
                {
                  priority: 1,
                  title: "R1",
                  description: "Desc",
                  category: "general",
                },
              ],
            }),
          },
        },
      ],
    });

    const first = await POST(createRequest({ url: "https://example.com" }));
    const second = await POST(createRequest({ url: "https://example.com" }));

    expect(first.status).toBe(200);
    expect(second.status).toBe(429);
  });
});

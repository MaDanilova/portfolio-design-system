export interface FeedbackItem {
  text: string;
  severity: "strong" | "improve" | "issue";
}

export interface ReviewPage {
  id: string;
  name: string;
  score: number;
  feedback: FeedbackItem[];
}

export interface Recommendation {
  priority: number;
  title: string;
  description: string;
  category: string;
}

export interface ReviewData {
  id: string;
  name: string;
  initials: string;
  date: string;
  focus: string;
  overall: number;
  scores: {
    layout: number;
    typography: number;
    hierarchy: number;
    storytelling: number;
  };
  summary: string;
  strengths: string[];
  improvements: string[];
  pages: ReviewPage[];
  recommendations: Recommendation[];
  categories: string[];
}

// --- Validation ---

const VALID_SEVERITIES = new Set(["strong", "improve", "issue"]);

function isNum(v: unknown, min = 0, max = 10): v is number {
  return typeof v === "number" && !Number.isNaN(v) && v >= min && v <= max;
}

export function validateReviewResponse(
  data: unknown
): { valid: true; data: ReviewData } | { valid: false; error: string } {
  if (typeof data !== "object" || data === null) {
    return { valid: false, error: "Response is not an object." };
  }

  const d = data as Record<string, unknown>;

  // Overall score
  if (!isNum(d.overall)) {
    return { valid: false, error: "Missing or invalid overall score." };
  }

  // Sub-scores
  const scores = d.scores as Record<string, unknown> | undefined;
  if (!scores || typeof scores !== "object") {
    return { valid: false, error: "Missing scores object." };
  }
  for (const key of ["layout", "typography", "hierarchy", "storytelling"]) {
    if (!isNum(scores[key])) {
      return { valid: false, error: `Invalid or missing score: ${key}.` };
    }
  }

  // Summary
  if (typeof d.summary !== "string" || d.summary.length === 0) {
    return { valid: false, error: "Missing summary." };
  }

  // Strengths (can be empty for edge cases like blank images)
  if (!Array.isArray(d.strengths)) {
    return { valid: false, error: "Missing strengths array." };
  }

  // Improvements
  if (!Array.isArray(d.improvements)) {
    return { valid: false, error: "Missing improvements array." };
  }

  // Pages
  if (!Array.isArray(d.pages)) {
    return { valid: false, error: "Missing pages array." };
  }
  for (const page of d.pages as Record<string, unknown>[]) {
    if (!page.id || !page.name || !isNum(page.score)) {
      return { valid: false, error: "Invalid page entry." };
    }
    if (!Array.isArray(page.feedback)) {
      return { valid: false, error: "Page missing feedback array." };
    }
    for (const fb of page.feedback as Record<string, unknown>[]) {
      if (typeof fb.text !== "string") {
        return { valid: false, error: "Feedback missing text." };
      }
      if (!VALID_SEVERITIES.has(fb.severity as string)) {
        return { valid: false, error: `Invalid severity: ${fb.severity}` };
      }
    }
  }

  // Recommendations
  if (!Array.isArray(d.recommendations)) {
    return { valid: false, error: "Missing recommendations array." };
  }
  for (const rec of d.recommendations as Record<string, unknown>[]) {
    if (typeof rec.priority !== "number" || typeof rec.title !== "string" || typeof rec.description !== "string") {
      return { valid: false, error: "Invalid recommendation entry." };
    }
  }

  return { valid: true, data: data as unknown as ReviewData };
}

// --- Persistence ---

const STORAGE_KEY = "portfolio-reviews";
const MAX_REVIEWS = 50;

export function saveReview(review: ReviewData): void {
  const reviews = listReviews();
  const existing = reviews.findIndex((r) => r.id === review.id);
  if (existing >= 0) {
    reviews[existing] = review;
  } else {
    reviews.unshift(review);
  }

  // Prune if over limit
  const trimmed = reviews.slice(0, MAX_REVIEWS);

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
  } catch {
    // Quota exceeded — prune more aggressively and retry
    const minimal = trimmed.slice(0, 10);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(minimal));
    } catch {
      // Still failing — clear old data and save just this review
      localStorage.removeItem(STORAGE_KEY);
      localStorage.setItem(STORAGE_KEY, JSON.stringify([review]));
    }
  }
}

export function getReview(id: string): ReviewData | null {
  const reviews = listReviews();
  return reviews.find((r) => r.id === id) ?? null;
}

export function listReviews(): ReviewData[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function generateId(): string {
  return `review-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

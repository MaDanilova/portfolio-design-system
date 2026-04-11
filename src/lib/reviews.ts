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

export interface LevelAssessment {
  apparent: string;
  matches: string;
  advice: string;
}

export interface PositioningRewrite {
  safe: string;
  bold: string;
}

export interface ReviewScores {
  positioning: number;
  caseStudy: number;
  visualDesign: number;
  strategicDepth: number;
  aiTools: number;
  personality: number;
  infoArchitecture: number;
  copywriting: number;
  accessibility: number;
}

export interface ReviewData {
  id: string;
  name: string;
  initials: string;
  date: string;
  focus: string;
  overall: number;
  scores: ReviewScores;
  summary: string;
  strengths: string[];
  improvements: string[];
  pages: ReviewPage[];
  recommendations: Recommendation[];
  categories: string[];
  pageType?: string;
  competitivePosition?: string;
  levelAssessment?: LevelAssessment;
  positioningRewrite?: PositioningRewrite;
  criticalGaps?: string[];
}

// --- Score dimension helpers ---

const SCORE_KEYS: (keyof ReviewScores)[] = [
  "positioning", "caseStudy", "visualDesign", "strategicDepth",
  "aiTools", "personality", "infoArchitecture", "copywriting", "accessibility",
];

export const SCORE_LABELS: Record<string, string> = {
  positioning: "First Impression & Positioning",
  caseStudy: "Case Study & Storytelling",
  visualDesign: "Visual Design & Craft",
  strategicDepth: "Strategic Depth",
  aiTools: "AI & Modern Tools",
  personality: "Personality & Differentiation",
  infoArchitecture: "Information Architecture",
  copywriting: "Copywriting Quality",
  accessibility: "Accessibility",
};

export function getScoreEntries(scores: ReviewScores): [string, number][] {
  return SCORE_KEYS.map((k) => [k, scores[k]]);
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

  if (!isNum(d.overall)) {
    return { valid: false, error: "Missing or invalid overall score." };
  }

  const scores = d.scores as Record<string, unknown> | undefined;
  if (!scores || typeof scores !== "object") {
    return { valid: false, error: "Missing scores object." };
  }

  const hasAll = SCORE_KEYS.every((k) => k in scores);
  if (!hasAll) {
    return { valid: false, error: "Scores must have all 9 dimensions." };
  }

  for (const key of SCORE_KEYS) {
    if (!isNum(scores[key])) {
      return { valid: false, error: `Invalid or missing score: ${key}.` };
    }
  }

  if (typeof d.summary !== "string" || d.summary.length === 0) {
    return { valid: false, error: "Missing summary." };
  }

  if (!Array.isArray(d.strengths)) {
    return { valid: false, error: "Missing strengths array." };
  }

  if (!Array.isArray(d.improvements)) {
    return { valid: false, error: "Missing improvements array." };
  }

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

// --- Persistence (Supabase) ---

import { createClient } from "@/lib/supabase/client";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// Coerce Supabase JSON column (stored as the full ReviewData) back into a
// typed object, preferring DB-level columns for id/name/overall.
function rowToReview(row: Record<string, unknown>): ReviewData {
  const data = row.feedback as Record<string, unknown>;
  return {
    ...data,
    id: row.id as string,
    name: (row.title as string) ?? (data.name as string),
    overall: Number(row.overall_score ?? data.overall ?? 0),
  } as ReviewData;
}

export async function saveReview(review: ReviewData): Promise<void> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { error } = await supabase.from("reviews").upsert({
    id: review.id,
    user_id: user.id,
    title: review.name,
    portfolio_type: review.pageType ?? review.focus,
    overall_score: review.overall,
    status: "completed",
    initials: review.initials,
    focus: review.focus,
    categories: review.categories,
    feedback: review,
  }, { onConflict: "id" });

  if (error) throw new Error(error.message);
}

export async function getReview(id: string): Promise<ReviewData | null> {
  if (!UUID_RE.test(id)) return null;
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from("reviews")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (error || !data) return null;
  return rowToReview(data);
}

export async function listReviews(): Promise<ReviewData[]> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("reviews")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(50);

  if (error || !data) return [];
  return data.map((row) => rowToReview(row as Record<string, unknown>));
}

export async function deleteReview(id: string): Promise<void> {
  if (!UUID_RE.test(id)) throw new Error("Invalid review ID");
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("Not authenticated");
  }

  const { error } = await supabase
    .from("reviews")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);
  if (error) throw new Error(error.message);
}

export function generateId(): string {
  return crypto.randomUUID();
}

export function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function deriveCategories(scores: ReviewScores): string[] {
  const entries = getScoreEntries(scores);
  return [...entries]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 2)
    .map(([key]) => SCORE_LABELS[key] ?? key);
}

export function buildReviewData(
  apiResponse: Record<string, unknown>,
  fileName: string | null,
  focusLabel: string,
): ReviewData {
  const id = generateId();
  const name =
    (apiResponse.name as string) || fileName?.replace(/\.[^.]+$/, "") || "Untitled Portfolio";
  const scores = apiResponse.scores as ReviewScores;

  return {
    id,
    name,
    initials: getInitials(name),
    date: new Date().toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }),
    focus: focusLabel,
    overall: apiResponse.overall as number,
    scores,
    summary: apiResponse.summary as string,
    strengths: apiResponse.strengths as string[],
    improvements: apiResponse.improvements as string[],
    pages: apiResponse.pages as ReviewData["pages"],
    recommendations: apiResponse.recommendations as ReviewData["recommendations"],
    categories: deriveCategories(scores),
    pageType: apiResponse.pageType as string | undefined,
    competitivePosition: apiResponse.competitivePosition as string | undefined,
    levelAssessment: (apiResponse.levelAssessment as ReviewData["levelAssessment"]) ?? undefined,
    positioningRewrite: (apiResponse.positioningRewrite as ReviewData["positioningRewrite"]) ?? undefined,
    criticalGaps: apiResponse.criticalGaps as string[] | undefined,
  };
}

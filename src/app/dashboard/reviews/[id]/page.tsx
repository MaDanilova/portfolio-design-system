"use client";

import { useState, useEffect, use } from "react";
import {
  Check,
  AlertTriangle,
  FileSearch,
  Target,
  ArrowLeft,
  ChevronDown,
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/Badge";
import { Button } from "@/components/Button";
import { Accordion } from "@/components/Accordion";
import { Skeleton } from "@/components/Skeleton";
import { EmptyState } from "@/components/EmptyState";
import { Tooltip } from "@/components/Tooltip";
import { cn } from "@/lib/utils";
import {
  getReview,
  getScoreEntries,
  SCORE_LABELS,
  type ReviewData,
} from "@/lib/reviews";

// ─── Helpers ───────────────────────────────────────────────

const SHORT_LABELS: Record<string, string> = {
  positioning: "Positioning",
  caseStudy: "Storytelling",
  visualDesign: "Visual Design",
  strategicDepth: "Strategy",
  aiTools: "AI & Tools",
  personality: "Personality",
  infoArchitecture: "Info Architecture",
  copywriting: "Copywriting",
  accessibility: "Accessibility",
};

const SCORE_DESCRIPTIONS: Record<string, string> = {
  positioning: "How clearly you communicate who you are and what you do",
  caseStudy: "Quality of narrative structure in your case studies",
  visualDesign: "Typography, color, spacing, and overall visual craft",
  strategicDepth: "Evidence of design thinking and problem-solving",
  aiTools: "Mention and integration of modern tools and AI",
  personality: "What makes your portfolio stand out from others",
  infoArchitecture: "Navigation, structure, and content organization",
  copywriting: "Clarity, tone, and quality of written content",
  accessibility: "Inclusive design practices and considerations",
};

function getScoreLevel(v: number): "high" | "mid" | "low" {
  if (v >= 7) return "high";
  if (v >= 4) return "mid";
  return "low";
}

const severityBadge = {
  strong: { variant: "success" as const, label: "Strong" },
  improve: { variant: "warning" as const, label: "Improve" },
  issue: { variant: "error" as const, label: "Issue" },
};

// ─── Page ──────────────────────────────────────────────────

export default function ReviewDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [review, setReview] = useState<ReviewData | null | undefined>(undefined);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    getReview(id).then(setReview);
  }, [id]);

  // Loading
  if (review === undefined) {
    return (
      <div className="max-w-3xl mx-auto px-6 md:px-8 py-10">
        <Skeleton variant="text" className="w-24 h-4 mb-12" />
        <Skeleton variant="text" className="w-32 h-14 mb-4" />
        <Skeleton variant="text" className="w-full h-5 mb-2" />
        <Skeleton variant="text" className="w-3/4 h-5" />
      </div>
    );
  }

  // Not found
  if (!review) {
    return (
      <div className="max-w-3xl mx-auto px-6 md:px-8 py-10">
        <EmptyState
          icon={FileSearch}
          heading="Review not found"
          description="This review may have been deleted or the link is invalid."
          action={
            <Link href="/dashboard">
              <Button variant="ghost">Back to Dashboard</Button>
            </Link>
          }
        />
      </div>
    );
  }

  const scoreEntries = getScoreEntries(review.scores);

  return (
    <div className="min-h-screen">
      {/* ─── Back ─── */}
      <div className="max-w-3xl mx-auto px-6 md:px-8 pt-8">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-xs text-ink-muted hover:text-ink-secondary transition-colors duration-fast"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back
        </Link>
      </div>

      {/* ─── Hero ─── */}
      <div className="max-w-3xl mx-auto px-6 md:px-8 pt-8 pb-10">
        <div className="flex items-end gap-3 mb-4">
          <span className="font-display font-normal text-7xl md:text-8xl tracking-tightest leading-none text-ink-primary">
            {review.overall.toFixed(1)}
          </span>
          <span className="text-xl text-ink-muted font-display mb-2">
            / 10
          </span>
        </div>
        <h1 className="font-display font-medium text-lg tracking-tight text-ink-primary">
          {review.name}
        </h1>
        <p className="text-sm text-ink-muted mt-1">
          {review.date} · {review.focus}
        </p>
      </div>

      {/* ─── Summary ─── */}
      <div className="border-y border-border bg-diagonal">
        <div className="max-w-3xl mx-auto px-6 md:px-8 py-8">
          <p className="text-base text-ink-secondary leading-relaxed">
            {review.summary}
          </p>
        </div>
      </div>

      {/* ─── What to fix (the actionable part) ─── */}
      {review.recommendations.length > 0 && (
        <div className="max-w-3xl mx-auto px-6 md:px-8 py-10">
          <p className="text-xs font-body font-medium tracking-widest uppercase text-ink-muted mb-8">
            What to fix
          </p>
          {review.recommendations.map((rec, i) => (
            <div
              key={rec.priority}
              className={cn(
                "flex gap-5 py-5",
                i < review.recommendations.length - 1 &&
                  "border-b border-border"
              )}
            >
              <span className="font-display font-normal text-2xl text-ink-muted/20 w-8 shrink-0 tabular-nums">
                {String(rec.priority).padStart(2, "0")}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-ink-primary">
                  {rec.title}
                </p>
                <p className="text-sm text-ink-secondary mt-1 leading-relaxed">
                  {rec.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ─── Show more toggle ─── */}
      <div className="border-t border-border">
        <div className="max-w-3xl mx-auto px-6 md:px-8">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="flex items-center gap-2 w-full py-5 text-xs text-ink-muted hover:text-ink-secondary transition-colors duration-fast"
          >
            <ChevronDown
              className={cn(
                "w-3.5 h-3.5 transition-transform duration-fast",
                showDetails && "rotate-180"
              )}
            />
            {showDetails ? "Hide details" : "Show all scores, strengths & page breakdown"}
          </button>
        </div>
      </div>

      {/* ─── Expanded details ─── */}
      {showDetails && (
        <>
          {/* Scores */}
          <div className="border-t border-border">
            <div className="max-w-3xl mx-auto px-6 md:px-8 py-10">
              <p className="text-xs font-body font-medium tracking-widest uppercase text-ink-muted mb-6">
                All Scores
              </p>
              <div className="grid grid-cols-3 gap-3">
                {scoreEntries.map(([key, value]) => {
                  const level = getScoreLevel(value);
                  return (
                    <Tooltip key={key} content={SCORE_DESCRIPTIONS[key] ?? ""} placement="bottom" className="flex">
                      <div className="bg-surface-base rounded-xl border border-border p-4 cursor-default w-full">
                        <p className="text-xs text-ink-muted mb-2">
                          {SHORT_LABELS[key] ?? key}
                        </p>
                        <span
                          className={cn(
                            "font-display font-normal text-2xl tracking-tight",
                            level === "high" && "text-ink-primary",
                            level === "mid" && "text-ink-secondary",
                            level === "low" && "text-ink-muted"
                          )}
                        >
                          {value.toFixed(1)}
                        </span>
                      </div>
                    </Tooltip>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Strengths & Improvements */}
          <div className="border-t border-border">
            <div className="max-w-3xl mx-auto px-6 md:px-8 py-10">
              <div className="grid md:grid-cols-2 gap-10">
                <div>
                  <p className="text-xs font-body font-medium tracking-widest uppercase text-ink-muted mb-5">
                    Strengths
                  </p>
                  <div className="space-y-3">
                    {review.strengths.map((item, i) => (
                      <div key={i} className="flex items-start gap-2.5">
                        <Check className="w-4 h-4 text-success shrink-0 mt-0.5" />
                        <p className="text-sm text-ink-secondary">{item}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-body font-medium tracking-widest uppercase text-ink-muted mb-5">
                    Improvements
                  </p>
                  <div className="space-y-3">
                    {review.improvements.map((item, i) => (
                      <div key={i} className="flex items-start gap-2.5">
                        <AlertTriangle className="w-4 h-4 text-warning shrink-0 mt-0.5" />
                        <p className="text-sm text-ink-secondary">{item}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Page-by-page */}
          {review.pages.length > 0 && (
            <div className="border-t border-border">
              <div className="max-w-3xl mx-auto px-6 md:px-8 py-10">
                <p className="text-xs font-body font-medium tracking-widest uppercase text-ink-muted mb-6">
                  Page Breakdown
                </p>
                <Accordion
                  multiple
                  items={review.pages.map((page) => ({
                    id: page.id,
                    title: `${page.name} — ${page.score.toFixed(1)}`,
                    content: (
                      <div className="space-y-3 pb-2">
                        {page.feedback.map((fb, j) => {
                          const badge = severityBadge[fb.severity];
                          return (
                            <div key={j} className="flex items-start gap-3">
                              <Badge variant={badge.variant} className="shrink-0 mt-0.5">
                                {badge.label}
                              </Badge>
                              <p className="text-sm text-ink-secondary">{fb.text}</p>
                            </div>
                          );
                        })}
                      </div>
                    ),
                  }))}
                />
              </div>
            </div>
          )}

          {/* Positioning rewrite */}
          {review.positioningRewrite && (
            <div className="border-t border-border">
              <div className="max-w-3xl mx-auto px-6 md:px-8 py-10">
                <p className="text-xs font-body font-medium tracking-widest uppercase text-ink-muted mb-6">
                  Positioning Rewrite
                </p>
                <div className="grid md:grid-cols-2 gap-6">
                  <blockquote className="text-sm text-ink-secondary leading-relaxed border-l-2 border-border pl-4">
                    <span className="text-xs text-ink-muted block mb-2">Safe</span>
                    {review.positioningRewrite.safe}
                  </blockquote>
                  <blockquote className="text-sm text-ink-primary leading-relaxed border-l-2 border-ink-primary pl-4 font-medium">
                    <span className="text-xs text-ink-muted block mb-2 font-normal">Bold</span>
                    {review.positioningRewrite.bold}
                  </blockquote>
                </div>
              </div>
            </div>
          )}

          {/* Level assessment */}
          {review.levelAssessment && (
            <div className="border-t border-border">
              <div className="max-w-3xl mx-auto px-6 md:px-8 py-10">
                <p className="text-xs font-body font-medium tracking-widest uppercase text-ink-muted mb-5">
                  Level Assessment
                </p>
                <p className="font-display font-medium text-lg text-ink-primary mb-2">
                  {review.levelAssessment.apparent}
                </p>
                <p className="text-sm text-ink-secondary leading-relaxed">
                  {review.levelAssessment.matches}
                </p>
                <p className="text-sm text-ink-muted leading-relaxed mt-1">
                  {review.levelAssessment.advice}
                </p>
              </div>
            </div>
          )}
        </>
      )}

      <div className="h-16" />
    </div>
  );
}

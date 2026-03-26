"use client";

import { useState, useEffect, use } from "react";
import { Check, AlertTriangle, FileSearch, Target, User } from "lucide-react";
import Link from "next/link";
import { Breadcrumb } from "@/components/Breadcrumb";
import { Card } from "@/components/Card";
import { Badge } from "@/components/Badge";
import { Score } from "@/components/Score";
import { Button } from "@/components/Button";
import { Tabs } from "@/components/Tabs";
import { Accordion } from "@/components/Accordion";
import { Skeleton } from "@/components/Skeleton";
import { EmptyState } from "@/components/EmptyState";
import {
  getReview,
  getScoreEntries,
  SCORE_LABELS,
  type ReviewData,
} from "@/lib/reviews";

const severityBadge = {
  strong: { variant: "success" as const, label: "Strong" },
  improve: { variant: "warning" as const, label: "Improve" },
  issue: { variant: "error" as const, label: "Issue" },
};

function OverviewTab({ review }: { review: ReviewData }) {
  return (
    <div className="space-y-8">
      <Card>
        <p className="text-sm text-ink-secondary leading-relaxed">
          {review.summary}
        </p>
      </Card>

      {/* Critical Gaps */}
      {review.criticalGaps && review.criticalGaps.length > 0 && (
        <div>
          <h3 className="font-display font-semibold text-base tracking-tight text-ink-primary mb-3">
            Critical Gaps
          </h3>
          <Card className="border-error/30">
            <div className="space-y-2">
              {review.criticalGaps.map((gap, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <Target className="w-4 h-4 text-error shrink-0 mt-0.5" />
                  <p className="text-sm text-ink-secondary">{gap}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      <div>
        <h3 className="font-display font-semibold text-base tracking-tight text-ink-primary mb-3">
          Strengths
        </h3>
        <div className="space-y-2">
          {review.strengths.map((item, i) => (
            <div key={i} className="flex items-start gap-2.5">
              <Check className="w-4 h-4 text-success shrink-0 mt-0.5" />
              <p className="text-sm text-ink-secondary">{item}</p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-display font-semibold text-base tracking-tight text-ink-primary mb-3">
          Areas for Improvement
        </h3>
        <div className="space-y-2">
          {review.improvements.map((item, i) => (
            <div key={i} className="flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-warning shrink-0 mt-0.5" />
              <p className="text-sm text-ink-secondary">{item}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function PageByPageTab({ review }: { review: ReviewData }) {
  return (
    <Accordion
      multiple
      items={review.pages.map((page) => ({
        id: page.id,
        title: page.name,
        content: (
          <div className="space-y-3 pb-2">
            {page.feedback.map((fb, i) => {
              const badge = severityBadge[fb.severity];
              return (
                <div key={i} className="flex items-start gap-3">
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
  );
}

function RecommendationsTab({ review }: { review: ReviewData }) {
  return (
    <div className="space-y-3">
      {/* Positioning Rewrite */}
      {review.positioningRewrite && (
        <Card className="border-acid/30 mb-6">
          <h4 className="font-display font-semibold text-sm tracking-tight text-ink-primary mb-3">
            Positioning Rewrite
          </h4>
          <div className="space-y-3">
            <div>
              <p className="text-xs text-ink-muted uppercase tracking-wider mb-1">Safe / Professional</p>
              <p className="text-sm text-ink-secondary italic">&ldquo;{review.positioningRewrite.safe}&rdquo;</p>
            </div>
            <div>
              <p className="text-xs text-ink-muted uppercase tracking-wider mb-1">Bold / Opinionated</p>
              <p className="text-sm text-ink-secondary italic">&ldquo;{review.positioningRewrite.bold}&rdquo;</p>
            </div>
          </div>
        </Card>
      )}

      {review.recommendations.map((rec) => (
        <Card key={rec.priority} variant="interactive" className="flex items-start gap-4">
          <Badge variant={rec.priority <= 2 ? "acid" : "mist"} className="shrink-0 mt-0.5">
            #{rec.priority}
          </Badge>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-ink-primary">{rec.title}</p>
            <p className="text-sm text-ink-secondary mt-1">{rec.description}</p>
            <Badge variant="default" className="mt-2">{rec.category}</Badge>
          </div>
        </Card>
      ))}
    </div>
  );
}

export default function ReviewDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [review, setReview] = useState<ReviewData | null | undefined>(undefined);

  useEffect(() => {
    getReview(id).then(setReview);
  }, [id]);

  if (review === undefined) {
    return (
      <div>
        <Skeleton variant="text" className="w-48 h-4 mb-6" />
        <Skeleton variant="text" className="w-64 h-8 mb-2" />
        <Skeleton variant="text" className="w-40 h-4 mb-8" />
        <Skeleton variant="card" className="mb-8" />
        <div className="space-y-3">
          <Skeleton variant="text" className="w-full h-4" />
          <Skeleton variant="text" className="w-3/4 h-4" />
          <Skeleton variant="text" className="w-5/6 h-4" />
        </div>
      </div>
    );
  }

  if (!review) {
    return (
      <div>
        <Breadcrumb
          items={[
            { label: "Dashboard", href: "/dashboard" },
            { label: "My Reviews", href: "/dashboard/reviews" },
            { label: "Not Found" },
          ]}
          className="mb-6"
        />
        <EmptyState
          icon={FileSearch}
          heading="Review not found"
          description="This review may have been deleted or the link is invalid."
          action={
            <Link href="/dashboard/reviews">
              <Button variant="ghost">Back to Reviews</Button>
            </Link>
          }
        />
      </div>
    );
  }

  const scoreEntries = getScoreEntries(review.scores);

  return (
    <div>
      <Breadcrumb
        items={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "My Reviews", href: "/dashboard/reviews" },
          { label: review.name },
        ]}
        className="mb-6"
      />

      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display font-bold text-2xl tracking-tight text-ink-primary">
            {review.name}
          </h1>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <p className="text-sm text-ink-muted">{review.date}</p>
            <Badge variant="mist">{review.focus}</Badge>
            {review.pageType && (
              <Badge variant="default">{review.pageType}</Badge>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost">Download PDF</Button>
          <Button variant="ghost">Share</Button>
        </div>
      </div>

      {/* Overall score + competitive position */}
      <Card variant="featured" className="mb-8">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="shrink-0 text-center">
            <Score variant="ring" value={review.overall} className="[&_svg]:w-20 [&_svg]:h-20" />
            <p className="text-xs text-ink-muted mt-2">Overall</p>
            {review.competitivePosition && (
              <Badge variant="acid" className="mt-2">
                {review.competitivePosition}
              </Badge>
            )}
          </div>
          <div className="flex-1 w-full space-y-2.5">
            {scoreEntries.map(([key, value]) => (
              <Score
                key={key}
                variant="bar"
                value={value}
                label={SCORE_LABELS[key] ?? key}
              />
            ))}
          </div>
        </div>
      </Card>

      {/* Level Assessment */}
      {review.levelAssessment && (
        <Card className="mb-8">
          <div className="flex items-start gap-3">
            <User className="w-5 h-5 text-mist shrink-0 mt-0.5" />
            <div className="space-y-1.5">
              <p className="text-sm font-medium text-ink-primary">
                Level Assessment: <span className="text-mist">{review.levelAssessment.apparent}</span>
              </p>
              <p className="text-sm text-ink-secondary">
                {review.levelAssessment.matches}
              </p>
              <p className="text-sm text-ink-muted">
                {review.levelAssessment.advice}
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Detailed feedback tabs */}
      <Tabs
        tabs={[
          { id: "overview", label: "Overview", content: <OverviewTab review={review} /> },
          { id: "pages", label: "Page-by-Page", content: <PageByPageTab review={review} /> },
          { id: "recommendations", label: "Recommendations", content: <RecommendationsTab review={review} /> },
        ]}
      />
    </div>
  );
}

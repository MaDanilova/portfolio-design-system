"use client";

import { useState, useEffect, use } from "react";
import { Check, AlertTriangle, FileSearch } from "lucide-react";
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
import { getReview, type ReviewData } from "@/lib/reviews";

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
    setReview(getReview(id));
  }, [id]);

  // Loading state
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

  // Not found
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
          <div className="flex items-center gap-2 mt-1">
            <p className="text-sm text-ink-muted">{review.date}</p>
            <Badge variant="mist">{review.focus}</Badge>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost">Download PDF</Button>
          <Button variant="ghost">Share</Button>
        </div>
      </div>

      {/* Overall score */}
      <Card variant="featured" className="mb-8">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="shrink-0">
            <Score variant="ring" value={review.overall} className="[&_svg]:w-20 [&_svg]:h-20" />
            <p className="text-xs text-ink-muted text-center mt-2">Overall</p>
          </div>
          <div className="flex-1 w-full space-y-3">
            <Score variant="bar" value={review.scores.layout} label="Layout" />
            <Score variant="bar" value={review.scores.typography} label="Typography" />
            <Score variant="bar" value={review.scores.hierarchy} label="Visual Hierarchy" />
            <Score variant="bar" value={review.scores.storytelling} label="Storytelling" />
          </div>
        </div>
      </Card>

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

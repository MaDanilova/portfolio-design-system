"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FileSearch } from "lucide-react";
import { Breadcrumb } from "@/components/Breadcrumb";
import { Card } from "@/components/Card";
import { Badge } from "@/components/Badge";
import { Score } from "@/components/Score";
import { Avatar } from "@/components/Avatar";
import { Button } from "@/components/Button";
import { EmptyState } from "@/components/EmptyState";
import { listReviews, getScoreEntries, SCORE_LABELS, type ReviewData } from "@/lib/reviews";

function computeStats(reviews: ReviewData[]) {
  const total = reviews.length;
  const avgScore =
    total > 0
      ? (reviews.reduce((sum, r) => sum + r.overall, 0) / total).toFixed(1)
      : "—";

  // Find top category by counting highest-scored category per review
  const catCounts: Record<string, number> = {};
  for (const r of reviews) {
    const entries = getScoreEntries(r.scores);
    const top = entries.sort((a, b) => b[1] - a[1])[0];
    if (top) {
      const label = SCORE_LABELS[top[0]] ?? top[0];
      catCounts[label] = (catCounts[label] || 0) + 1;
    }
  }
  const topCategory =
    Object.entries(catCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "—";

  return [
    { label: "Total Reviews", value: String(total), trend: total > 0 ? `${total} total` : "None yet", trendVariant: total > 0 ? "success" as const : "default" as const },
    { label: "Average Score", value: avgScore, trend: total > 0 ? "Across all reviews" : "No data", trendVariant: "default" as const },
    { label: "Top Category", value: topCategory, trend: total > 0 ? "Highest rated" : "No data", trendVariant: "default" as const },
  ];
}

export default function DashboardPage() {
  const [reviews, setReviews] = useState<ReviewData[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    listReviews().then((data) => {
      setReviews(data);
      setLoaded(true);
    });
  }, []);

  const stats = computeStats(reviews);
  const recent = reviews.slice(0, 5);
  const hasReviews = recent.length > 0;

  if (!loaded) return null;

  return (
    <div>
      <Breadcrumb items={[{ label: "Dashboard" }]} className="mb-6" />

      <h1 className="font-display font-bold text-3xl tracking-tight text-ink-primary">
        Welcome back
      </h1>
      <p className="text-ink-secondary mt-1 mb-8">
        Here&apos;s a summary of your portfolio reviews.
      </p>

      {/* Stats row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <p className="text-xs text-ink-muted uppercase tracking-wider font-body">
              {stat.label}
            </p>
            <p className="font-display font-bold text-2xl text-ink-primary mt-1">
              {stat.value}
            </p>
            <Badge variant={stat.trendVariant} className="mt-2">
              {stat.trend}
            </Badge>
          </Card>
        ))}
      </div>

      {/* Recent reviews */}
      <h2 className="font-display font-semibold text-lg tracking-tight text-ink-primary mb-4">
        Recent Reviews
      </h2>

      {hasReviews ? (
        <div className="flex flex-col gap-3 mb-10">
          {recent.map((review) => (
            <Link key={review.id} href={`/dashboard/reviews/${review.id}`}>
              <Card variant="interactive" className="flex items-center gap-4">
                <Avatar size="md" initials={review.initials} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-ink-primary">
                    {review.name}
                  </p>
                  <p className="text-xs text-ink-muted">{review.date}</p>
                  <div className="flex gap-1.5 mt-1.5">
                    {review.categories.map((cat) => (
                      <Badge key={cat} variant="default">
                        {cat}
                      </Badge>
                    ))}
                  </div>
                </div>
                <Score
                  variant="ring"
                  value={review.overall}
                  className="shrink-0"
                />
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={FileSearch}
          heading="No reviews yet"
          description="Upload your first portfolio to get AI-powered design feedback."
          action={
            <Link href="/dashboard/new">
              <Button>Upload Your First Portfolio</Button>
            </Link>
          }
        />
      )}

      {/* Quick upload CTA */}
      {hasReviews && (
        <Card variant="featured" className="flex items-center justify-between">
          <p className="text-sm text-ink-primary font-medium">
            Ready for another review?
          </p>
          <Link href="/dashboard/new">
            <Button>Upload Portfolio</Button>
          </Link>
        </Card>
      )}
    </div>
  );
}

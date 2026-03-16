"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FileSearch, Search } from "lucide-react";
import { Breadcrumb } from "@/components/Breadcrumb";
import { Card } from "@/components/Card";
import { Badge } from "@/components/Badge";
import { Score } from "@/components/Score";
import { Avatar } from "@/components/Avatar";
import { Tabs } from "@/components/Tabs";
import { EmptyState } from "@/components/EmptyState";
import { Button } from "@/components/Button";
import { cn } from "@/lib/utils";
import { listReviews, type ReviewData } from "@/lib/reviews";

const filters = ["All", "Layout", "Typography", "Hierarchy", "Storytelling"];

const sortOptions = [
  { value: "newest", label: "Newest" },
  { value: "oldest", label: "Oldest" },
  { value: "highest", label: "Highest Score" },
  { value: "lowest", label: "Lowest Score" },
];

function ReviewList({ reviews }: { reviews: ReviewData[] }) {
  if (reviews.length === 0) {
    return (
      <EmptyState
        icon={FileSearch}
        heading="No reviews match your filters"
        description="Try adjusting your search or filter criteria."
      />
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {reviews.map((review) => (
        <Link key={review.id} href={`/dashboard/reviews/${review.id}`}>
          <Card variant="interactive" className="flex items-center gap-4">
            <Avatar size="md" initials={review.initials} />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-ink-primary">{review.name}</p>
              <p className="text-xs text-ink-muted">{review.date}</p>
              <div className="flex gap-1.5 mt-1.5">
                {review.categories.map((cat) => (
                  <Badge key={cat} variant="default">{cat}</Badge>
                ))}
              </div>
            </div>
            <Score variant="ring" value={review.overall} className="shrink-0" />
          </Card>
        </Link>
      ))}
    </div>
  );
}

export default function MyReviewsPage() {
  const [allReviews, setAllReviews] = useState<ReviewData[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [activeFilter, setActiveFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");

  useEffect(() => {
    setAllReviews(listReviews());
    setLoaded(true);
  }, []);

  const filtered = allReviews
    .filter((r) => activeFilter === "All" || r.categories.includes(activeFilter))
    .filter((r) => r.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sort === "oldest") return a.date < b.date ? -1 : 1;
      if (sort === "highest") return b.overall - a.overall;
      if (sort === "lowest") return a.overall - b.overall;
      return a.date > b.date ? -1 : 1; // newest
    });

  if (!loaded) return null;

  return (
    <div>
      <Breadcrumb
        items={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "My Reviews" },
        ]}
        className="mb-6"
      />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <h1 className="font-display font-bold text-3xl tracking-tight text-ink-primary">
          My Reviews
        </h1>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted" />
            <input
              type="text"
              placeholder="Search reviews..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={cn(
                "bg-surface-raised border border-border rounded pl-9 pr-3.5 py-2",
                "text-sm font-body text-ink-primary placeholder:text-ink-muted",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-acid",
                "focus-visible:ring-offset-2 focus-visible:ring-offset-surface-base"
              )}
            />
          </div>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className={cn(
              "appearance-none bg-surface-raised border border-border rounded",
              "px-3.5 py-2 text-sm font-body text-ink-primary",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-acid",
              "focus-visible:ring-offset-2 focus-visible:ring-offset-surface-base"
            )}
          >
            {sortOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Filter chips */}
      <div className="flex flex-wrap gap-2 mb-6">
        {filters.map((filter) => (
          <button key={filter} onClick={() => setActiveFilter(filter)}>
            <Badge variant={activeFilter === filter ? "acid" : "default"}>
              {filter}
            </Badge>
          </button>
        ))}
      </div>

      {allReviews.length === 0 ? (
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
      ) : (
        <Tabs
          tabs={[
            {
              id: "all",
              label: "All Reviews",
              content: <ReviewList reviews={filtered} />,
            },
          ]}
        />
      )}

      {/* Pagination */}
      {allReviews.length > 0 && (
        <div className="flex items-center justify-center gap-4 mt-8 text-sm text-ink-secondary">
          <button className="hover:text-ink-primary transition-colors duration-fast">
            ← Previous
          </button>
          <span>Page 1 of 1</span>
          <button className="hover:text-ink-primary transition-colors duration-fast">
            Next →
          </button>
        </div>
      )}
    </div>
  );
}

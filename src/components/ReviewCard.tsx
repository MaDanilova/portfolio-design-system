import { Card } from "@/components/Card";
import { Badge } from "@/components/Badge";
import { Score } from "@/components/Score";
import { Avatar } from "@/components/Avatar";
import type { ReviewData } from "@/lib/reviews";

export function ReviewCard({ review }: { review: ReviewData }) {
  return (
    <Card variant="interactive" className="flex items-center gap-4">
      <Avatar size="md" initials={review.initials} />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-ink-primary">{review.name}</p>
        <p className="text-xs text-ink-muted">{review.date}</p>
        <div className="flex gap-1.5 mt-1.5">
          {review.categories.map((cat) => (
            <Badge key={cat} variant="default">
              {cat}
            </Badge>
          ))}
        </div>
      </div>
      <Score variant="ring" value={review.overall} className="shrink-0" />
    </Card>
  );
}

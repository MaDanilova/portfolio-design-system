"use client";

import { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Plus, Settings, Menu, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar } from "@/components/Avatar";
import { Drawer } from "@/components/Drawer";
import { Score } from "@/components/Score";
import { createClient } from "@/lib/supabase/client";
import { listReviews, type ReviewData } from "@/lib/reviews";

function ReviewHistoryItem({ review, active }: { review: ReviewData; active: boolean }) {
  return (
    <Link
      href={`/dashboard/reviews/${review.id}`}
      className={cn(
        "flex items-center gap-3 px-3 py-2 rounded text-sm font-body transition-colors duration-fast",
        active
          ? "bg-surface-raised text-ink-primary"
          : "text-ink-secondary hover:text-ink-primary hover:bg-surface-raised"
      )}
    >
      <Score value={review.overall} max={10} variant="ring" size="sm" />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm">{review.name}</p>
        <p className="text-xs text-ink-muted">{review.date}</p>
      </div>
    </Link>
  );
}

function UserInfoBlock({
  user,
  onSignOut,
}: {
  user: { name: string; email: string; initials: string };
  onSignOut: () => void;
}) {
  return (
    <>
      <div className="flex items-center gap-3 mb-3">
        <Avatar size="sm" initials={user.initials} />
        <div className="min-w-0">
          <p className="text-sm font-body font-medium text-ink-primary truncate">
            {user.name}
          </p>
          <p className="text-xs text-ink-muted truncate">{user.email}</p>
        </div>
      </div>
      <button
        onClick={onSignOut}
        className="flex items-center gap-2 px-3 py-1.5 text-xs text-ink-muted hover:text-ink-secondary transition-colors duration-fast w-full rounded"
      >
        <LogOut className="w-3.5 h-3.5" />
        Sign out
      </button>
    </>
  );
}

interface DashboardShellProps {
  children: React.ReactNode;
  user: {
    name: string;
    email: string;
    initials: string;
  };
}

export function DashboardShell({ children, user }: DashboardShellProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [reviews, setReviews] = useState<ReviewData[]>([]);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    listReviews().then(setReviews);
  }, [pathname]);

  const handleSignOut = useCallback(async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }, [router]);

  const isDashboardHome = pathname === "/dashboard";

  const sidebarContent = (
    <>
      {/* New Review button */}
      <Link
        href="/dashboard"
        className={cn(
          "flex items-center gap-2 px-3 py-2 rounded text-sm font-body font-medium transition-colors duration-fast mb-4",
          isDashboardHome
            ? "bg-acid text-ink-inverse"
            : "bg-surface-raised text-ink-primary hover:bg-surface-subtle"
        )}
      >
        <Plus className="w-4 h-4" />
        New Review
      </Link>

      {/* Review history */}
      {reviews.length > 0 && (
        <div className="flex-1 overflow-y-auto">
          <p className="text-[10px] font-body font-medium tracking-widest uppercase text-ink-muted px-3 mb-2">
            History
          </p>
          <div className="flex flex-col gap-0.5">
            {reviews.map((review) => (
              <ReviewHistoryItem
                key={review.id}
                review={review}
                active={pathname === `/dashboard/reviews/${review.id}`}
              />
            ))}
          </div>
        </div>
      )}

      {/* Bottom: Settings + User */}
      <div className="mt-auto pt-6 border-t border-border">
        <Link
          href="/dashboard/settings"
          className={cn(
            "flex items-center gap-3 px-3 py-2 rounded text-sm font-body transition-colors duration-fast mb-4",
            pathname === "/dashboard/settings"
              ? "bg-surface-raised text-ink-primary"
              : "text-ink-secondary hover:text-ink-primary hover:bg-surface-raised"
          )}
        >
          <Settings className="w-4 h-4" />
          Settings
        </Link>
        <div className="px-3">
          <UserInfoBlock user={user} onSignOut={handleSignOut} />
        </div>
      </div>
    </>
  );

  return (
    <div className="flex min-h-screen">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-60 shrink-0 border-r border-border h-screen sticky top-0 flex-col py-6 px-3">
        <Link href="/dashboard" className="block mb-6 px-3">
          <p className="text-xs font-body font-semibold tracking-widest uppercase text-ink-primary">
            Portfolio Review
          </p>
        </Link>

        {sidebarContent}
      </aside>

      {/* Mobile header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-30 bg-surface-base border-b border-border px-4 py-3 flex items-center justify-between">
        <p className="text-xs font-body font-semibold tracking-widest uppercase text-ink-primary">
          Portfolio Review
        </p>
        <button
          onClick={() => setDrawerOpen(true)}
          className="text-ink-secondary hover:text-ink-primary transition-colors duration-fast"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* Mobile drawer */}
      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        side="left"
        title="Menu"
      >
        {sidebarContent}
      </Drawer>

      {/* Main content — no padding on canvas pages */}
      <main className="flex-1 min-w-0 overflow-y-auto mt-14 md:mt-0">
        {children}
      </main>
    </div>
  );
}

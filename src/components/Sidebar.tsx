"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface NavGroup {
  label: string;
  items: { label: string; href: string }[];
}

const navGroups: NavGroup[] = [
  {
    label: "",
    items: [{ label: "Overview", href: "/" }],
  },
  {
    label: "Foundation",
    items: [
      { label: "Button", href: "/components/button" },
      { label: "Card", href: "/components/card" },
      { label: "Section", href: "/components/section" },
      { label: "TextReveal", href: "/components/text-reveal" },
      { label: "MagneticButton", href: "/components/magnetic-button" },
    ],
  },
  {
    label: "Forms & Input",
    items: [
      { label: "Input", href: "/components/input" },
      { label: "Textarea", href: "/components/textarea" },
      { label: "Select", href: "/components/select" },
      { label: "Toggle", href: "/components/toggle" },
      { label: "FileUpload", href: "/components/file-upload" },
    ],
  },
  {
    label: "Feedback & Data",
    items: [
      { label: "Badge", href: "/components/badge" },
      { label: "Score", href: "/components/score" },
      { label: "ProgressBar", href: "/components/progress-bar" },
      { label: "Accordion", href: "/components/accordion" },
      { label: "Avatar", href: "/components/avatar" },
      { label: "Divider", href: "/components/divider" },
    ],
  },
  {
    label: "Status",
    items: [
      { label: "Spinner", href: "/components/spinner" },
      { label: "Skeleton", href: "/components/skeleton" },
      { label: "Alert", href: "/components/alert" },
      { label: "EmptyState", href: "/components/empty-state" },
    ],
  },
  {
    label: "Overlays & Nav",
    items: [
      { label: "Modal", href: "/components/modal" },
      { label: "Drawer", href: "/components/drawer" },
      { label: "Tabs", href: "/components/tabs" },
      { label: "Tooltip", href: "/components/tooltip" },
      { label: "Breadcrumb", href: "/components/breadcrumb" },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-60 shrink-0 border-r border-border h-screen sticky top-0 overflow-y-auto py-8 px-4">
      <Link href="/" className="block mb-8 px-3">
        <p className="text-xs font-body font-medium tracking-widest uppercase text-acid">
          Design System
        </p>
        <p className="text-sm text-ink-muted mt-1">Portfolio Review</p>
      </Link>

      <nav className="flex flex-col gap-4">
        {navGroups.map((group) => (
          <div key={group.label || "root"}>
            {group.label && (
              <p className="text-[10px] font-body font-medium tracking-widest uppercase text-ink-muted px-3 mb-1">
                {group.label}
              </p>
            )}
            <div className="flex flex-col gap-0.5">
              {group.items.map((item) => {
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "text-sm px-3 py-1.5 rounded font-body transition-colors duration-fast",
                      active
                        ? "bg-surface-raised text-ink-primary"
                        : "text-ink-secondary hover:text-ink-primary hover:bg-surface-raised"
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  );
}

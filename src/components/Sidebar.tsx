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
    items: [{ label: "Overview", href: "/design-system" }],
  },
  {
    label: "Foundation",
    items: [
      { label: "Button", href: "/design-system/components/button" },
      { label: "Card", href: "/design-system/components/card" },
      { label: "Section", href: "/design-system/components/section" },
      { label: "TextReveal", href: "/design-system/components/text-reveal" },
      { label: "MagneticButton", href: "/design-system/components/magnetic-button" },
    ],
  },
  {
    label: "Forms & Input",
    items: [
      { label: "Input", href: "/design-system/components/input" },
      { label: "Textarea", href: "/design-system/components/textarea" },
      { label: "Select", href: "/design-system/components/select" },
      { label: "Toggle", href: "/design-system/components/toggle" },
      { label: "FileUpload", href: "/design-system/components/file-upload" },
    ],
  },
  {
    label: "Feedback & Data",
    items: [
      { label: "Badge", href: "/design-system/components/badge" },
      { label: "Score", href: "/design-system/components/score" },
      { label: "ProgressBar", href: "/design-system/components/progress-bar" },
      { label: "Accordion", href: "/design-system/components/accordion" },
      { label: "Avatar", href: "/design-system/components/avatar" },
      { label: "Divider", href: "/design-system/components/divider" },
    ],
  },
  {
    label: "Status",
    items: [
      { label: "Spinner", href: "/design-system/components/spinner" },
      { label: "Skeleton", href: "/design-system/components/skeleton" },
      { label: "Alert", href: "/design-system/components/alert" },
      { label: "EmptyState", href: "/design-system/components/empty-state" },
    ],
  },
  {
    label: "Overlays & Nav",
    items: [
      { label: "Modal", href: "/design-system/components/modal" },
      { label: "Drawer", href: "/design-system/components/drawer" },
      { label: "Tabs", href: "/design-system/components/tabs" },
      { label: "Tooltip", href: "/design-system/components/tooltip" },
      { label: "Breadcrumb", href: "/design-system/components/breadcrumb" },
    ],
  },
  {
    label: "Architecture",
    items: [
      { label: "OOUX & IA", href: "/design-system/architecture" },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-60 shrink-0 border-r border-border h-screen sticky top-0 overflow-y-auto py-8 px-4">
      <Link href="/design-system" className="block mb-8 px-3">
        <p className="text-xs font-body font-semibold tracking-widest uppercase text-ink-primary">
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

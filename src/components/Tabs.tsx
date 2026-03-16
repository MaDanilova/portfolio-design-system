"use client";

import { useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface Tab {
  id: string;
  label: string;
  content: ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  defaultTab?: string;
  className?: string;
}

export function Tabs({ tabs, defaultTab, className }: TabsProps) {
  const [activeId, setActiveId] = useState(defaultTab || tabs[0]?.id);
  const activeTab = tabs.find((t) => t.id === activeId);

  return (
    <div className={className}>
      <div className="flex border-b border-border gap-0">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveId(tab.id)}
            className={cn(
              "px-4 py-2.5 text-sm font-body font-medium transition-colors duration-fast -mb-px",
              tab.id === activeId
                ? "text-ink-primary border-b-2 border-acid"
                : "text-ink-muted hover:text-ink-secondary"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="pt-6">{activeTab?.content}</div>
    </div>
  );
}

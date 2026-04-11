"use client";

import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/Sidebar";

// Routes split across three shells: design-system (sidebar), dashboard (own layout), everything else (no shell)
export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isDashboard = pathname.startsWith("/dashboard");
  const isDesignSystem = pathname.startsWith("/design-system");

  // Dashboard has its own layout
  if (isDashboard) {
    return <>{children}</>;
  }

  // Design system pages get the sidebar
  if (isDesignSystem) {
    return (
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1 min-w-0 overflow-y-auto">
          <div className="max-w-4xl mx-auto px-8 py-12">{children}</div>
        </main>
      </div>
    );
  }

  // Marketing, auth, and other pages — no shell wrapper
  return <>{children}</>;
}

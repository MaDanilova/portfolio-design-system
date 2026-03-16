"use client";

import { cn } from "@/lib/utils";
import { Info, CheckCircle, AlertTriangle, XCircle, X } from "lucide-react";
import { type ReactNode } from "react";

type Status = "info" | "success" | "warning" | "error";

interface AlertProps {
  status?: Status;
  title?: string;
  children: ReactNode;
  dismissible?: boolean;
  onDismiss?: () => void;
  className?: string;
}

const statusConfig: Record<Status, { icon: typeof Info; border: string; iconColor: string }> = {
  info: { icon: Info, border: "border-border", iconColor: "text-ink-secondary" },
  success: { icon: CheckCircle, border: "border-success", iconColor: "text-success" },
  warning: { icon: AlertTriangle, border: "border-warning", iconColor: "text-warning" },
  error: { icon: XCircle, border: "border-error", iconColor: "text-error" },
};

export function Alert({
  status = "info",
  title,
  children,
  dismissible,
  onDismiss,
  className,
}: AlertProps) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <div
      className={cn(
        "bg-surface-raised border rounded-xl p-4 flex items-start gap-3 relative",
        config.border,
        className
      )}
    >
      <Icon className={cn("w-5 h-5 shrink-0 mt-0.5", config.iconColor)} strokeWidth={1.5} />
      <div className="flex-1 min-w-0">
        {title && (
          <p className="text-sm font-body font-medium text-ink-primary mb-0.5">
            {title}
          </p>
        )}
        <div className="text-sm font-body text-ink-secondary">{children}</div>
      </div>
      {dismissible && (
        <button
          onClick={onDismiss}
          className="text-ink-muted hover:text-ink-primary transition-colors duration-fast shrink-0"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}

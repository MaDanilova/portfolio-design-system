"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import gsap from "gsap";

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  side?: "left" | "right";
  title?: string;
  children: ReactNode;
}

export function Drawer({ open, onClose, side = "right", title, children }: DrawerProps) {
  const backdropRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      gsap.fromTo(backdropRef.current, { opacity: 0 }, { opacity: 1, duration: 0.3 });
      gsap.fromTo(
        panelRef.current,
        { x: side === "right" ? "100%" : "-100%" },
        { x: "0%", duration: 0.35, ease: "power3.out" }
      );
    }
  }, [open, side]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (open) document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40">
      <div
        ref={backdropRef}
        className="absolute inset-0 bg-surface-base/80"
        onClick={onClose}
      />
      <div
        ref={panelRef}
        className={cn(
          "fixed top-0 bottom-0 z-40 bg-surface-overlay w-80 md:w-96 p-6 overflow-y-auto",
          side === "right" ? "right-0 border-l border-border" : "left-0 border-r border-border"
        )}
      >
        <div className="flex items-center justify-between mb-6">
          {title && (
            <h2 className="font-display font-semibold text-lg tracking-tight">
              {title}
            </h2>
          )}
          <button
            onClick={onClose}
            className="text-ink-muted hover:text-ink-primary transition-colors duration-fast ml-auto"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

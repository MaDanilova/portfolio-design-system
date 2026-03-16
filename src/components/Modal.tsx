"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import gsap from "gsap";

type Size = "sm" | "md" | "lg";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  size?: Size;
  title?: string;
  children: ReactNode;
}

const sizes: Record<Size, string> = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
};

export function Modal({ open, onClose, size = "md", title, children }: ModalProps) {
  const backdropRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      gsap.fromTo(backdropRef.current, { opacity: 0 }, { opacity: 1, duration: 0.3 });
      gsap.fromTo(panelRef.current, { opacity: 0, scale: 0.95 }, { opacity: 1, scale: 1, duration: 0.3, ease: "power3.out" });
    }
  }, [open]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (open) document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
      <div
        ref={backdropRef}
        className="absolute inset-0 bg-surface-base/80"
        onClick={onClose}
      />
      <div
        ref={panelRef}
        className={cn(
          "relative bg-surface-overlay border border-border rounded-xl p-6 w-full",
          sizes[size]
        )}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-ink-muted hover:text-ink-primary transition-colors duration-fast"
        >
          <X className="w-4 h-4" />
        </button>
        {title && (
          <h2 className="font-display font-semibold text-lg tracking-tight mb-4">
            {title}
          </h2>
        )}
        {children}
      </div>
    </div>
  );
}

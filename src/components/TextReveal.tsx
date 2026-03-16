"use client";

import { useRef, useEffect, type ReactNode } from "react";
import gsap from "gsap";
import { easings } from "@/lib/animations";

interface TextRevealProps {
  children: ReactNode;
  delay?: number;
}

export function TextReveal({ children, delay = 0 }: TextRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    gsap.from(el, {
      y: "100%",
      opacity: 0,
      duration: 0.8,
      delay,
      ease: easings.smooth,
    });
  }, [delay]);

  return (
    <div className="overflow-hidden">
      <div ref={ref}>{children}</div>
    </div>
  );
}

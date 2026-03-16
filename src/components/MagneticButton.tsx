"use client";

import { useRef, type ReactNode } from "react";
import { useMagnet } from "@/hooks/useMagnet";

interface MagneticButtonProps {
  children: ReactNode;
  strength?: number;
}

export function MagneticButton({
  children,
  strength = 0.4,
}: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null);
  useMagnet(ref, { strength });

  return (
    <div ref={ref} className="inline-block">
      {children}
    </div>
  );
}

"use client";

import { useEffect, type RefObject } from "react";
import gsap from "gsap";

interface MagnetOptions {
  strength?: number;
}

export function useMagnet(
  ref: RefObject<HTMLElement | null>,
  options?: MagnetOptions
) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const strength = options?.strength ?? 0.4;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      gsap.to(el, {
        x: x * strength,
        y: y * strength,
        duration: 0.4,
        ease: "power3.out",
      });
    };

    const handleMouseLeave = () => {
      gsap.to(el, {
        x: 0,
        y: 0,
        duration: 0.4,
        ease: "power3.out",
      });
    };

    el.addEventListener("mousemove", handleMouseMove);
    el.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      el.removeEventListener("mousemove", handleMouseMove);
      el.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [ref, options?.strength]);
}

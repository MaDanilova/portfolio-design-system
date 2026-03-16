"use client";

import { useEffect, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { reveals } from "@/lib/animations";

gsap.registerPlugin(ScrollTrigger);

export function useReveal(
  ref: RefObject<HTMLElement | null>,
  options?: { delay?: number }
) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    gsap.from(el, {
      ...reveals.fadeUp,
      delay: options?.delay ?? 0,
      scrollTrigger: {
        trigger: el,
        start: "top 88%",
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach((t) => {
        if (t.trigger === el) t.kill();
      });
    };
  }, [ref, options?.delay]);
}

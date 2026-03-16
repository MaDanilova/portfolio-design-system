export const easings = {
  smooth: "power3.out",
  snappy: "power4.out",
  bounce: "back.out(1.4)",
  elastic: "elastic.out(1, 0.5)",
} as const;

export const durations = {
  fast: 0.4,
  default: 0.7,
  slow: 1.0,
} as const;

export const reveals = {
  fadeUp: {
    y: 32,
    opacity: 0,
    duration: durations.default,
    ease: easings.smooth,
  },
  fadeIn: {
    opacity: 0,
    duration: durations.default,
    ease: easings.smooth,
  },
  slideLeft: {
    x: 48,
    opacity: 0,
    duration: durations.default,
    ease: easings.smooth,
  },
} as const;

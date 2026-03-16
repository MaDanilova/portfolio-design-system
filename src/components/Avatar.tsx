import { cn } from "@/lib/utils";
import Image from "next/image";

type Size = "sm" | "md" | "lg";

interface AvatarProps {
  src?: string;
  alt?: string;
  initials?: string;
  size?: Size;
  className?: string;
}

const sizes: Record<Size, { container: string; text: string; px: number }> = {
  sm: { container: "w-8 h-8", text: "text-xs", px: 32 },
  md: { container: "w-10 h-10", text: "text-sm", px: 40 },
  lg: { container: "w-14 h-14", text: "text-lg", px: 56 },
};

export function Avatar({
  src,
  alt = "",
  initials,
  size = "md",
  className,
}: AvatarProps) {
  const s = sizes[size];

  return (
    <div
      className={cn(
        "rounded-full overflow-hidden bg-surface-subtle flex items-center justify-center shrink-0",
        s.container,
        className
      )}
    >
      {src ? (
        <Image
          src={src}
          alt={alt}
          width={s.px}
          height={s.px}
          className="object-cover w-full h-full"
        />
      ) : (
        <span className={cn("font-body font-medium text-ink-secondary", s.text)}>
          {initials || "?"}
        </span>
      )}
    </div>
  );
}

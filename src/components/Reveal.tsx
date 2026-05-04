import { CSSProperties, ReactNode } from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { cn } from "@/lib/utils";

type Variant = "up" | "left" | "right" | "fade";

interface RevealProps {
  children: ReactNode;
  variant?: Variant;
  delay?: number; // ms
  duration?: number; // ms
  className?: string;
  as?: "div" | "section" | "article" | "li" | "figure";
  style?: CSSProperties;
}

const hiddenByVariant: Record<Variant, string> = {
  up: "opacity-0 translate-y-6",
  left: "opacity-0 -translate-x-10",
  right: "opacity-0 translate-x-10",
  fade: "opacity-0",
};

export function Reveal({
  children,
  variant = "up",
  delay = 0,
  duration = 700,
  className,
  as: Tag = "div",
  style,
}: RevealProps) {
  const { ref, visible } = useScrollReveal<HTMLElement>();
  return (
    <Tag
      ref={ref as never}
      style={{
        transitionDelay: `${delay}ms`,
        transitionDuration: `${duration}ms`,
        ...style,
      }}
      className={cn(
        "transition-all ease-out will-change-transform motion-reduce:transition-none motion-reduce:transform-none",
        visible ? "opacity-100 translate-x-0 translate-y-0" : hiddenByVariant[variant],
        className
      )}
    >
      {children}
    </Tag>
  );
}
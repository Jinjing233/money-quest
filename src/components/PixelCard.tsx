import type { ReactNode } from "react";

interface PixelCardProps {
  children: ReactNode;
  className?: string;
  sage?: boolean;
}

export function PixelCard({ children, className = "", sage = false }: PixelCardProps) {
  return (
    <div
      className={`pixel-border ${sage ? "pixel-border-sage" : ""} bg-cream-light p-4 ${className}`}
    >
      {children}
    </div>
  );
}

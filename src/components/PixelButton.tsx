import type { ButtonHTMLAttributes, ReactNode } from "react";

interface PixelButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary";
  /** Forces the "pressed/chosen" look regardless of variant -- used for brief choice feedback. */
  selected?: boolean;
}

export function PixelButton({
  children,
  variant = "primary",
  selected = false,
  className = "",
  ...props
}: PixelButtonProps) {
  const palette = selected
    ? "bg-sage text-cream-light border-sage-dark"
    : variant === "primary"
      ? "bg-sage text-cream-light border-sage-dark hover:bg-sage-dark"
      : "bg-cream-light text-brown border-brown hover:bg-cream";

  return (
    <button
      {...props}
      className={`font-pixel pixel-border ${palette} px-4 py-3 text-xs leading-relaxed transition-transform active:translate-y-1 active:shadow-none disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    >
      {children}
    </button>
  );
}

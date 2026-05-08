import * as React from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost" | "outline" | "danger";
type ButtonSize = "sm" | "md" | "lg" | "icon";

export function buttonVariants({
  variant = "primary",
  size = "md",
  className
}: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
} = {}) {
  const variants: Record<ButtonVariant, string> = {
    primary:
      "border border-cyan-200/60 bg-cyan-200 text-slate-950 shadow-glow hover:bg-white",
    secondary:
      "border border-white/[0.15] bg-white/10 text-white backdrop-blur-xl hover:bg-white/[0.16]",
    ghost: "border border-transparent bg-transparent text-slate-200 hover:bg-white/10",
    outline:
      "border border-white/[0.15] bg-transparent text-white hover:border-cyan-200/50 hover:bg-cyan-200/10",
    danger:
      "border border-rose-300/30 bg-rose-400/[0.15] text-rose-100 hover:bg-rose-400/25"
  };
  const sizes: Record<ButtonSize, string> = {
    sm: "h-9 gap-2 rounded-full px-4 text-xs",
    md: "h-11 gap-2 rounded-full px-5 text-sm",
    lg: "h-12 gap-3 rounded-full px-7 text-base",
    icon: "h-11 w-11 rounded-full p-0"
  };
  return cn(
    "inline-flex shrink-0 items-center justify-center font-medium transition duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200/70 disabled:pointer-events-none disabled:opacity-50",
    variants[variant],
    sizes[size],
    className
  );
}

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button ref={ref} className={buttonVariants({ variant, size, className })} {...props} />
  )
);

Button.displayName = "Button";

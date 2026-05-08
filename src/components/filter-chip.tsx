"use client";

import { cn } from "@/lib/utils";

export function FilterChip({
  label,
  active,
  onClick,
  className
}: {
  label: string;
  active?: boolean;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full border px-3.5 py-2 text-xs font-medium transition duration-200",
        active
          ? "border-cyan-200/70 bg-cyan-200 text-slate-950"
          : "border-white/[0.12] bg-white/[0.06] text-slate-200 hover:border-cyan-200/40 hover:bg-cyan-200/10",
        className
      )}
    >
      {label}
    </button>
  );
}

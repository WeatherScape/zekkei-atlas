import { cn } from "@/lib/utils";

export function Badge({
  children,
  className
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-white/[0.12] bg-white/[0.09] px-3 py-1 text-xs font-medium text-slate-100 backdrop-blur-md",
        className
      )}
    >
      {children}
    </span>
  );
}

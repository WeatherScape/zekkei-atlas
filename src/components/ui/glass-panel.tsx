import { cn } from "@/lib/utils";

export function GlassPanel({
  children,
  className
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-[28px] border border-white/[0.12] bg-white/[0.075] shadow-glass backdrop-blur-2xl",
        className
      )}
    >
      {children}
    </div>
  );
}

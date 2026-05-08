import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  description,
  className
}: {
  eyebrow: string;
  title: string;
  description?: string;
  className?: string;
}) {
  return (
    <div className={cn("max-w-3xl", className)}>
      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-cyan-200/80">
        {eyebrow}
      </p>
      <h2 className="text-3xl font-semibold tracking-normal text-white md:text-5xl">{title}</h2>
      {description ? (
        <p className="mt-4 text-base leading-8 text-slate-300 md:text-lg">{description}</p>
      ) : null}
    </div>
  );
}

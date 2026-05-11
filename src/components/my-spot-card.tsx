"use client";

import { useMemo, useState } from "react";
import { Bot, CheckCircle2, ExternalLink, MapPin, MoreHorizontal, Pencil, Sparkles, Star, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { mySpotStatusLabels, mySpotThemeLabels, type MySpot } from "@/data/my-spots";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { generateMySpotPlan } from "@/lib/generateMySpotPlan";
import { cn } from "@/lib/utils";

const statusTone: Record<MySpot["status"], string> = {
  someday: "bg-violet-300/15 text-violet-100 border-violet-200/25",
  thisYear: "bg-amber-300/18 text-amber-100 border-amber-200/30",
  planning: "bg-sky-300/16 text-sky-100 border-sky-200/30",
  visited: "bg-slate-300/14 text-slate-100 border-slate-200/20"
};

export function MySpotCard({
  spot,
  selected,
  compact,
  onSelect,
  onEdit,
  onRemove,
  className
}: {
  spot: MySpot;
  selected?: boolean;
  compact?: boolean;
  onSelect?: (spot: MySpot) => void;
  onEdit?: (spot: MySpot) => void;
  onRemove?: (id: string) => void;
  className?: string;
}) {
  const hasLocation = typeof spot.latitude === "number" && typeof spot.longitude === "number";
  const wishLevel = spot.wishLevel ?? 4;
  const [planOpen, setPlanOpen] = useState(false);
  const plan = useMemo(() => generateMySpotPlan(spot), [spot]);
  const nextStep = spot.nextStep || spot.firstStepMemo;

  return (
    <motion.article
      layout
      whileHover={{ y: compact ? -3 : -5 }}
      onClick={() => onSelect?.(spot)}
      className={cn(
        "group overflow-hidden rounded-[30px] border border-white/[0.12] bg-white/[0.075] shadow-glass backdrop-blur-2xl transition duration-300",
        selected ? "border-cyan-200/70 ring-2 ring-cyan-200/25" : "hover:border-cyan-200/40",
        onSelect ? "cursor-pointer" : "",
        className
      )}
    >
      <div className={cn("relative overflow-hidden", compact ? "h-40" : "h-72")}>
        {spot.image ? (
          <img
            src={spot.image}
            alt={spot.name}
            className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="h-full w-full bg-[radial-gradient(circle_at_top_left,rgba(103,232,249,0.22),transparent_35%),linear-gradient(135deg,#082f49,#020617_62%)]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/38 to-transparent" />
        <div className="absolute left-4 top-4 flex flex-wrap gap-2">
          <Badge className={cn("border", statusTone[spot.status])}>{mySpotStatusLabels[spot.status]}</Badge>
          {spot.tags.includes("一生に一度") ? (
            <Badge className="border border-amber-200/35 bg-amber-200/15 text-amber-50">
              <Star className="h-3 w-3" />
              一生に一度
            </Badge>
          ) : null}
          {!hasLocation ? <Badge className="bg-amber-300/15 text-amber-100">位置未設定</Badge> : null}
        </div>
        {onEdit || onRemove ? (
          <div className="absolute right-4 top-4 flex gap-2">
            {onEdit ? (
              <Button
                type="button"
                variant="secondary"
                size="icon"
                className="bg-slate-950/55"
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  onEdit(spot);
                }}
              >
                <Pencil className="h-4 w-4" />
              </Button>
            ) : null}
            {onRemove ? (
              <Button
                type="button"
                variant="danger"
                size="icon"
                className="bg-slate-950/55"
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  onRemove(spot.id);
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            ) : null}
          </div>
        ) : null}
        <div className="absolute bottom-4 left-4 right-4">
          <p className="mb-2 flex items-center gap-1.5 text-xs font-medium text-cyan-100">
            <MapPin className="h-3.5 w-3.5" />
            {[spot.region, spot.country].filter(Boolean).join(" / ") || "位置はあとで整理"}
          </p>
          <h3 className={cn("font-semibold text-white", compact ? "text-xl" : "text-3xl")}>
            {spot.name}
          </h3>
        </div>
      </div>

      <div className={cn("space-y-4", compact ? "p-4" : "p-5")}>
        {!compact ? (
          <p className="text-lg font-semibold leading-8 text-white">
            {spot.catchCopy || "いつか、を本当に行く日に変える景色。"}
          </p>
        ) : null}

        {spot.memo && !compact ? (
          <p className="line-clamp-2 text-sm leading-7 text-slate-300">{spot.memo}</p>
        ) : null}

        {!compact && spot.reason ? (
          <div className="rounded-2xl border border-rose-200/15 bg-rose-200/[0.07] p-4">
            <p className="text-xs uppercase tracking-[0.16em] text-rose-100/75">行きたい理由</p>
            <p className="mt-2 text-sm leading-7 text-white">{spot.reason}</p>
          </div>
        ) : null}

        <div className="flex flex-wrap gap-2">
          {(spot.tags.length ? spot.tags : ["あとで整理"]).slice(0, compact ? 3 : 5).map((tag) => (
            <Badge key={tag}>#{tag}</Badge>
          ))}
        </div>

        {!compact && spot.themes.length ? (
          <div className="flex flex-wrap gap-2">
            {spot.themes.slice(0, 5).map((theme) => (
              <Badge key={theme} className="border border-cyan-200/20 bg-cyan-200/[0.09] text-cyan-50">
                {mySpotThemeLabels[theme]}
              </Badge>
            ))}
          </div>
        ) : null}

        {!compact && spot.activities.length ? (
          <div className="rounded-2xl border border-white/10 bg-white/[0.045] p-4">
            <p className="text-xs uppercase tracking-[0.16em] text-slate-400">そこでやりたいこと</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {spot.activities.slice(0, 6).map((activity) => (
                <span key={activity} className="rounded-full border border-white/10 bg-white/[0.07] px-3 py-1.5 text-xs text-slate-100">
                  {activity}
                </span>
              ))}
            </div>
          </div>
        ) : null}

        <div className="grid grid-cols-2 gap-3 text-sm">
          <Info label="行きたい度" value={`${wishLevel}/5`} />
          <Info label="季節" value={spot.bestSeason.length ? spot.bestSeason.join(" / ") : "未設定"} />
          {!compact ? (
            <>
              <Info label="時間帯" value={spot.bestTime?.length ? spot.bestTime.join(" / ") : "未設定"} />
              <Info label="誰と" value={spot.companion || "あとで決める"} />
            </>
          ) : null}
        </div>

        {!compact && nextStep ? (
          <div className="rounded-2xl border border-cyan-200/15 bg-cyan-200/[0.07] p-4">
            <p className="text-xs uppercase tracking-[0.16em] text-cyan-100/75">次にやること</p>
            <p className="mt-2 text-sm leading-7 text-white">{nextStep}</p>
          </div>
        ) : null}

        {!compact && planOpen ? (
          <div className="rounded-3xl border border-amber-200/20 bg-amber-200/[0.08] p-4">
            <p className="flex items-center gap-2 text-sm font-semibold text-amber-50">
              <Bot className="h-4 w-4" />
              {plan.title}
            </p>
            <div className="mt-3 grid gap-2 text-sm text-slate-200">
              <PlanLine label="おすすめ時期" value={plan.bestTiming} />
              <PlanLine label="必要日数" value={plan.duration} />
              <PlanLine label="ざっくり予算" value={plan.budget} />
            </div>
            <div className="mt-4 space-y-2">
              {plan.firstResearch.slice(0, 3).map((item) => (
                <p key={item} className="flex gap-2 text-xs leading-6 text-slate-200">
                  <CheckCircle2 className="mt-1 h-3.5 w-3.5 shrink-0 text-amber-100" />
                  {item}
                </p>
              ))}
            </div>
          </div>
        ) : null}

        <div className="flex flex-col gap-3 sm:flex-row">
          {!compact ? (
            <Button
              type="button"
              variant="secondary"
              className="flex-1"
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                setPlanOpen((current) => !current);
              }}
            >
              <Sparkles className="h-4 w-4" />
              AIプランを見る
            </Button>
          ) : null}
          {spot.sourceUrl ? (
            <a
              href={spot.sourceUrl}
              target="_blank"
              rel="noreferrer"
              onClick={(event) => event.stopPropagation()}
              className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-full border border-white/[0.15] bg-transparent px-4 text-xs font-medium text-white transition hover:border-cyan-200/50 hover:bg-cyan-200/10"
            >
              投稿を見る
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          ) : (
            <span className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-full border border-white/[0.12] bg-white/[0.05] px-4 text-xs text-slate-400">
              URLなし
              <MoreHorizontal className="h-3.5 w-3.5" />
            </span>
          )}
        </div>
      </div>
    </motion.article>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.055] p-3">
      <p className="text-xs text-slate-400">{label}</p>
      <p className="mt-1 font-medium text-white">{value}</p>
    </div>
  );
}

function PlanLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-950/35 p-3">
      <p className="text-[11px] text-amber-100/75">{label}</p>
      <p className="mt-1 leading-6 text-white">{value}</p>
    </div>
  );
}

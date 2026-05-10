"use client";

import { ExternalLink, MapPin, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { type MySpot } from "@/data/my-spots";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const statusLabel: Record<MySpot["status"], string> = {
  want: "行きたい",
  planning: "計画中",
  visited: "行った"
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

  return (
    <motion.article
      layout
      whileHover={{ y: -5 }}
      onClick={() => onSelect?.(spot)}
      className={cn(
        "group overflow-hidden rounded-[28px] border border-white/[0.12] bg-white/[0.075] shadow-glass backdrop-blur-2xl transition duration-300",
        selected ? "border-cyan-200/70 ring-2 ring-cyan-200/25" : "hover:border-cyan-200/40",
        onSelect ? "cursor-pointer" : "",
        className
      )}
    >
      <div className={cn("relative overflow-hidden", compact ? "h-44" : "h-64")}>
        {spot.image ? (
          <img
            src={spot.image}
            alt={spot.name}
            className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="h-full w-full bg-[radial-gradient(circle_at_top_left,rgba(103,232,249,0.22),transparent_35%),linear-gradient(135deg,#082f49,#020617_62%)]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/35 to-transparent" />
        <div className="absolute left-4 top-4 flex flex-wrap gap-2">
          <Badge className="bg-slate-950/45">{statusLabel[spot.status]}</Badge>
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

      <div className="space-y-4 p-5">
        {spot.memo && !compact ? (
          <p className="line-clamp-2 text-sm leading-7 text-slate-300">{spot.memo}</p>
        ) : null}

        <div className="flex flex-wrap gap-2">
          {(spot.tags.length ? spot.tags : ["あとで整理"]).slice(0, 5).map((tag) => (
            <Badge key={tag}>#{tag}</Badge>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <Info label="季節" value={spot.bestSeason.length ? spot.bestSeason.join(" / ") : "未設定"} />
          <Info label="保存元" value={spot.sourceType} />
        </div>

        <div className="flex items-center gap-3">
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

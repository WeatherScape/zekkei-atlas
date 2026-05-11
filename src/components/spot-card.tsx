"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, Camera, Clock, MapPin, MountainSnow } from "lucide-react";
import { Spot } from "@/data/spots";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { WishlistButton } from "@/components/wishlist-button";
import { cn, difficultyLabel, difficultyTone } from "@/lib/utils";

export function SpotCard({
  spot,
  compact,
  selected,
  onSelect,
  className
}: {
  spot: Spot;
  compact?: boolean;
  selected?: boolean;
  onSelect?: (spot: Spot) => void;
  className?: string;
}) {
  return (
    <motion.article
      layout
      whileHover={{ y: -6 }}
      onClick={() => onSelect?.(spot)}
      className={cn(
        "group overflow-hidden rounded-[28px] border border-white/[0.12] bg-white/[0.075] shadow-glass backdrop-blur-2xl transition duration-300",
        selected ? "border-cyan-200/70 ring-2 ring-cyan-200/25" : "hover:border-cyan-200/40",
        onSelect ? "cursor-pointer" : "",
        className
      )}
    >
      <div className={cn("relative overflow-hidden", compact ? "h-44" : "h-64")}>
        <img
          src={spot.thumbnailImage}
          alt={spot.name}
          className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
        <div className="absolute left-4 top-4 flex flex-wrap gap-2">
          {spot.themes.slice(0, compact ? 2 : 3).map((tag) => (
            <Badge key={tag} className="bg-slate-950/40">
              {tag}
            </Badge>
          ))}
        </div>
        <div className="absolute right-4 top-4">
          <WishlistButton spotId={spot.id} size="icon" className="bg-slate-950/40" />
        </div>
        <div className="absolute bottom-4 left-4 right-4">
          <p className="mb-2 flex items-center gap-1.5 text-xs font-medium text-cyan-100">
            <MapPin className="h-3.5 w-3.5" />
            {spot.region} / {spot.country}
          </p>
          <h3 className={cn("font-semibold text-white", compact ? "text-xl" : "text-3xl")}>
            {spot.name}
          </h3>
        </div>
      </div>

      <div className="space-y-4 p-5">
        {!compact ? (
          <p className="line-clamp-2 text-sm leading-7 text-slate-300">{spot.catchCopy}</p>
        ) : null}

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-2xl border border-white/10 bg-white/[0.055] p-3">
            <p className="flex items-center gap-1.5 text-xs text-slate-400">
              <MountainSnow className="h-3.5 w-3.5" />
              ベスト季節
            </p>
            <p className="mt-1 font-medium text-white">{spot.bestSeason.join(" / ")}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.055] p-3">
            <p className="flex items-center gap-1.5 text-xs text-slate-400">
              <Clock className="h-3.5 w-3.5" />
              時間帯
            </p>
            <p className="mt-1 font-medium text-white">{spot.bestTime.join(" / ")}</p>
          </div>
          <div className={cn("rounded-2xl border p-3", difficultyTone(spot.difficulty))}>
            <p className="text-xs opacity-80">アクセス</p>
            <p className="mt-1 font-medium">{difficultyLabel(spot.difficulty)}</p>
          </div>
          <div className="rounded-2xl border border-cyan-200/20 bg-cyan-200/10 p-3 text-cyan-50">
            <p className="flex items-center gap-1.5 text-xs text-cyan-100/75">
              <Camera className="h-3.5 w-3.5" />
              写真映え
            </p>
            <p className="mt-1 font-semibold">{spot.photoScore}/100</p>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3">
          <WishlistButton spotId={spot.id} variant="outline" className="flex-1" />
          <Link
            href={`/spots/${spot.id}`}
            onClick={(event) => event.stopPropagation()}
            className={buttonVariants({
              variant: "primary",
              size: "md",
              className: "flex-1"
            })}
          >
            詳細
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </motion.article>
  );
}

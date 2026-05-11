"use client";

import Link from "next/link";
import { ArrowUpRight, Camera, Clock, MapPin, Sparkles } from "lucide-react";
import { Spot } from "@/data/spots";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { WishlistButton } from "@/components/wishlist-button";

export function ShareShowcaseCard({ spot }: { spot: Spot }) {
  return (
    <aside className="pointer-events-auto absolute bottom-4 left-4 right-4 z-30 overflow-hidden rounded-[26px] border border-white/[0.16] bg-slate-950/[0.74] shadow-glass backdrop-blur-2xl lg:left-6 lg:right-auto lg:w-[360px]">
      <div className="grid grid-cols-[118px_1fr] gap-0">
        <div className="relative min-h-[160px] overflow-hidden">
          <img src={spot.mapPreviewImage} alt={spot.name} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 to-transparent" />
        </div>
        <div className="p-4">
          <p className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-cyan-100/75">
            <Sparkles className="h-3.5 w-3.5" />
            Shareable View
          </p>
          <h3 className="mt-2 text-2xl font-semibold leading-tight text-white">{spot.name}</h3>
          <p className="mt-2 flex items-center gap-1.5 text-xs text-slate-300">
            <MapPin className="h-3.5 w-3.5 text-cyan-100" />
            {spot.region} / {spot.country}
          </p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {spot.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} className="px-2 py-0.5 text-[10px]">
                {tag}
              </Badge>
            ))}
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2 text-[11px] text-slate-300">
            <span className="flex items-center gap-1.5 rounded-full bg-white/[0.06] px-2.5 py-1.5">
              <Clock className="h-3.5 w-3.5 text-cyan-100" />
              {spot.bestTime.join(" / ")}
            </span>
            <span className="flex items-center gap-1.5 rounded-full bg-white/[0.06] px-2.5 py-1.5">
              <Camera className="h-3.5 w-3.5 text-cyan-100" />
              {spot.photoScore}/100
            </span>
          </div>
        </div>
      </div>
      <div className="flex gap-2 border-t border-white/10 p-3">
        <WishlistButton spotId={spot.id} size="sm" className="flex-1" />
        <Link
          href={`/spots/${spot.id}`}
          className={buttonVariants({ variant: "primary", size: "sm", className: "flex-1" })}
        >
          詳細
          <ArrowUpRight className="h-4 w-4" />
        </Link>
      </div>
    </aside>
  );
}

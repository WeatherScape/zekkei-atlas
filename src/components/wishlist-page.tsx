"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Heart, Sparkles, Trash2 } from "lucide-react";
import { Spot } from "@/data/spots";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { FilterChip } from "@/components/filter-chip";
import { GlassPanel } from "@/components/ui/glass-panel";
import { SpotCard } from "@/components/spot-card";
import { useWishlist } from "@/hooks/use-wishlist";

type ViewMode = "all" | "tag" | "season";

export function WishlistPage() {
  const { isReady, savedSpots, removeSpot } = useWishlist();
  const [viewMode, setViewMode] = useState<ViewMode>("all");

  const tagGroups = useMemo(() => groupByTag(savedSpots), [savedSpots]);
  const seasonGroups = useMemo(() => groupBySeason(savedSpots), [savedSpots]);

  return (
    <main className="min-h-screen bg-atlas-ink text-white">
      <section className="relative overflow-hidden px-5 pb-20 pt-32 md:px-8">
        <div className="absolute inset-0 bg-night-rim" />
        <div className="absolute inset-0 bg-atlas-grid bg-[length:72px_72px] opacity-30" />
        <div className="relative mx-auto max-w-7xl">
          <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <Badge className="mb-4 border-cyan-200/40 bg-cyan-200/[0.12] text-cyan-50">
                Wishlist
              </Badge>
              <h1 className="text-balance text-4xl font-semibold tracking-normal md:text-6xl">
                保存した絶景を、次の旅の候補に。
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-8 text-slate-300">
                気になった場所を残して、季節やタグで眺め直す。旅の輪郭が少しずつ見えてきます。
              </p>
            </div>
            <Link href="/ai-planner" className={buttonVariants({ variant: "primary", size: "lg" })}>
              <Sparkles className="h-5 w-5" />
              次に行く旅先をAIに相談する
            </Link>
          </div>

          <GlassPanel className="mb-8 p-4">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <p className="text-sm text-slate-300">
                {isReady ? `${savedSpots.length} spots saved` : "読み込み中..."}
              </p>
              <div className="flex gap-2 overflow-x-auto pb-1">
                <FilterChip label="一覧" active={viewMode === "all"} onClick={() => setViewMode("all")} />
                <FilterChip label="タグ別" active={viewMode === "tag"} onClick={() => setViewMode("tag")} />
                <FilterChip label="季節別" active={viewMode === "season"} onClick={() => setViewMode("season")} />
              </div>
            </div>
          </GlassPanel>

          {savedSpots.length === 0 ? (
            <EmptyWishlist />
          ) : viewMode === "all" ? (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {savedSpots.map((spot) => (
                <SavedCard key={spot.id} spot={spot} onRemove={() => removeSpot(spot.id)} />
              ))}
            </div>
          ) : viewMode === "tag" ? (
            <GroupedWishlist groups={tagGroups} onRemove={removeSpot} />
          ) : (
            <GroupedWishlist groups={seasonGroups} onRemove={removeSpot} />
          )}
        </div>
      </section>
    </main>
  );
}

function EmptyWishlist() {
  return (
    <GlassPanel className="mx-auto max-w-3xl p-10 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-cyan-200/25 bg-cyan-200/10 text-cyan-100">
        <Heart className="h-7 w-7" />
      </div>
      <h2 className="mt-6 text-3xl font-semibold">まだ保存した絶景はありません。</h2>
      <p className="mt-4 text-slate-300">
        地図やトップページで気になるスポットを保存すると、ここから旅の候補を整理できます。
      </p>
      <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
        <Link href="/map" className={buttonVariants({ variant: "primary", size: "lg" })}>
          地図から探す
        </Link>
        <Link href="/ai-planner" className={buttonVariants({ variant: "secondary", size: "lg" })}>
          AIに相談
        </Link>
      </div>
    </GlassPanel>
  );
}

function SavedCard({ spot, onRemove }: { spot: Spot; onRemove: () => void }) {
  return (
    <div className="relative">
      <SpotCard spot={spot} />
      <Button
        variant="danger"
        size="sm"
        className="absolute bottom-5 left-5 z-10"
        onClick={onRemove}
      >
        <Trash2 className="h-4 w-4" />
        削除
      </Button>
    </div>
  );
}

function GroupedWishlist({
  groups,
  onRemove
}: {
  groups: Array<{ label: string; spots: Spot[] }>;
  onRemove: (id: string) => void;
}) {
  return (
    <div className="space-y-10">
      {groups.map((group) => (
        <section key={group.label}>
          <div className="mb-5 flex items-center gap-3">
            <h2 className="text-2xl font-semibold">{group.label}</h2>
            <Badge>{group.spots.length} spots</Badge>
          </div>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {group.spots.map((spot) => (
              <SavedCard key={`${group.label}-${spot.id}`} spot={spot} onRemove={() => onRemove(spot.id)} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

function groupByTag(items: Spot[]) {
  const groups = new Map<string, Spot[]>();
  items.forEach((spot) => {
    spot.tags.slice(0, 4).forEach((tag) => {
      groups.set(tag, [...(groups.get(tag) ?? []), spot]);
    });
  });
  return Array.from(groups.entries())
    .map(([label, groupedSpots]) => ({ label, spots: groupedSpots }))
    .sort((a, b) => b.spots.length - a.spots.length || a.label.localeCompare(b.label, "ja"));
}

function groupBySeason(items: Spot[]) {
  const groups = new Map<string, Spot[]>();
  items.forEach((spot) => {
    spot.bestSeason.forEach((season) => {
      groups.set(season, [...(groups.get(season) ?? []), spot]);
    });
  });
  return ["春", "夏", "秋", "冬"]
    .map((label) => ({ label, spots: groups.get(label) ?? [] }))
    .filter((group) => group.spots.length > 0);
}

"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Compass, Loader2, MapPin, Plus, Sparkles } from "lucide-react";
import { spots } from "@/data/spots";
import { mySpotStatusLabels, mySpotThemeLabels, mySpotToMapSpot, type MySpot } from "@/data/my-spots";
import { AddMySpotModal } from "@/components/add-my-spot-modal";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { FilterChip } from "@/components/filter-chip";
import { GlassPanel } from "@/components/ui/glass-panel";
import { MySpotCard } from "@/components/my-spot-card";
import { SpotCard } from "@/components/spot-card";
import { TravelMap } from "@/components/map/TravelMap";
import { useMySpots } from "@/hooks/use-my-spots";

type ViewMode = "all" | "theme" | "tag" | "season" | "status";

const starterSpots = spots
  .filter((spot) => ["hateruma", "uyuni", "miyako", "tsunoshima", "shirakawago", "banff"].includes(spot.id))
  .sort((a, b) => b.photoScore - a.photoScore);

const statusLabels = mySpotStatusLabels;

export function WishlistPage() {
  const { isReady, mySpots, removeMySpot } = useMySpots();
  const [viewMode, setViewMode] = useState<ViewMode>("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSpot, setEditingSpot] = useState<MySpot | undefined>();
  const [selectedId, setSelectedId] = useState<string | undefined>();
  const [addMode, setAddMode] = useState(false);
  const [pickedLocation, setPickedLocation] = useState<{ latitude: number; longitude: number } | undefined>();
  const openEditor = (spot: MySpot) => {
    setPickedLocation(undefined);
    setEditingSpot(spot);
    setModalOpen(true);
  };

  const spotsWithLocation = useMemo(
    () => mySpots.filter((spot) => typeof spot.latitude === "number" && typeof spot.longitude === "number"),
    [mySpots]
  );
  const spotsWithoutLocation = useMemo(
    () => mySpots.filter((spot) => typeof spot.latitude !== "number" || typeof spot.longitude !== "number"),
    [mySpots]
  );
  const mapSpots = useMemo(() => spotsWithLocation.map(mySpotToMapSpot), [spotsWithLocation]);
  const selectedSpot = mySpots.find((spot) => spot.id === selectedId) ?? spotsWithLocation[0] ?? mySpots[0];
  const grouped = useMemo(() => {
    if (viewMode === "theme") return groupByTheme(mySpots);
    if (viewMode === "tag") return groupByTag(mySpots);
    if (viewMode === "season") return groupBySeason(mySpots);
    if (viewMode === "status") return groupByStatus(mySpots);
    return [];
  }, [mySpots, viewMode]);

  const aiPrompt = encodeURIComponent(
    mySpots.length
      ? `My Atlasの行きたい場所から旅程を作る: ${mySpots.map((spot) => spot.name).join("、")}`
      : "SNSで見つけた絶景を整理して旅程にしたい"
  );

  return (
    <main className="min-h-screen bg-atlas-ink text-white">
      <section className="relative overflow-hidden px-5 pb-20 pt-32 md:px-8">
        <div className="absolute inset-0 bg-night-rim" />
        <div className="absolute inset-0 bg-atlas-grid bg-[length:72px_72px] opacity-30" />

        <div className="relative mx-auto max-w-7xl">
          <div className="mb-10 grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <Badge className="mb-4 border-cyan-200/40 bg-cyan-200/[0.12] text-cyan-50">
                My ZEKKEI ATLAS
              </Badge>
              <h1 className="text-balance text-4xl font-semibold tracking-normal md:text-6xl">
                SNSで見つけた「行きたい」を、自分だけの旅地図へ。
              </h1>
              <p className="mt-4 max-w-3xl text-base leading-8 text-slate-300">
                Instagram、TikTok、Google Maps、メモに散らばった絶景候補を集めて、季節・タグ・地図で眺め直す。旅の意思決定が楽しくなるMy Atlasです。
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
              <Button
                size="lg"
                onClick={() => {
                  setEditingSpot(undefined);
                  setPickedLocation(undefined);
                  setModalOpen(true);
                }}
              >
                <Plus className="h-5 w-5" />
                SNS URLから追加
              </Button>
              <Link href={`/ai-planner?prompt=${aiPrompt}`} className={buttonVariants({ variant: "secondary", size: "lg" })}>
                <Sparkles className="h-5 w-5" />
                このリストでAI相談
              </Link>
            </div>
          </div>

          <GlassPanel className="mb-8 p-4">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="grid grid-cols-3 gap-3 text-sm md:min-w-[360px]">
                <Metric label="My Spots" value={isReady ? `${mySpots.length}` : "..."} />
                <Metric label="On Map" value={isReady ? `${spotsWithLocation.length}` : "..."} />
                <Metric label="Need Location" value={isReady ? `${spotsWithoutLocation.length}` : "..."} />
              </div>
              <div className="flex gap-2 overflow-x-auto pb-1">
                <FilterChip label="ボード" active={viewMode === "all"} onClick={() => setViewMode("all")} />
                <FilterChip label="テーマ別" active={viewMode === "theme"} onClick={() => setViewMode("theme")} />
                <FilterChip label="タグ別" active={viewMode === "tag"} onClick={() => setViewMode("tag")} />
                <FilterChip label="季節別" active={viewMode === "season"} onClick={() => setViewMode("season")} />
                <FilterChip label="状態別" active={viewMode === "status"} onClick={() => setViewMode("status")} />
              </div>
            </div>
          </GlassPanel>

          {!isReady ? (
            <LoadingAtlas />
          ) : mySpots.length === 0 ? (
            <EmptyAtlas
              onAdd={() => {
                setEditingSpot(undefined);
                setPickedLocation(undefined);
                setModalOpen(true);
              }}
            />
          ) : (
            <div className="space-y-10">
              <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
                <div className="space-y-3">
                  <div className="flex flex-col gap-3 rounded-[24px] border border-cyan-200/20 bg-cyan-200/[0.06] p-3 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="text-sm font-semibold text-cyan-50">地図の中心で追加</p>
                      <p className="mt-1 text-xs leading-6 text-slate-300">
                        地図を動かして中央ピンを合わせるだけ。スマホでもズレにくい登録方法です。
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant={addMode ? "primary" : "secondary"}
                      size="md"
                      onClick={() => setAddMode((current) => !current)}
                    >
                      <MapPin className="h-4 w-4" />
                      {addMode ? "追加モード中" : "地図に追加"}
                    </Button>
                  </div>
                  <TravelMap
                    spots={mapSpots}
                    selectedSpotId={selectedSpot?.id}
                    onSelect={(spot) => setSelectedId(spot.id)}
                    onReset={() => setSelectedId(spotsWithLocation[0]?.id)}
                    className="min-h-[420px] md:min-h-[560px]"
                    addMode={addMode}
                    onPickLocation={(location) => {
                      setPickedLocation(location);
                      setEditingSpot(undefined);
                      setAddMode(false);
                      setModalOpen(true);
                    }}
                  />
                </div>
                <GlassPanel className="p-5">
                  {selectedSpot ? (
                    <div>
                      <Badge className="mb-4 border-cyan-200/40 bg-cyan-200/[0.12] text-cyan-50">
                        今見ている候補
                      </Badge>
                      <MySpotCard spot={selectedSpot} onEdit={openEditor} onRemove={removeMySpot} />
                    </div>
                  ) : (
                    <div className="flex min-h-[420px] flex-col items-center justify-center text-center text-slate-300">
                      <Compass className="mb-4 h-9 w-9 text-cyan-100" />
                      位置付きの候補を追加すると、ここに表示されます。
                    </div>
                  )}
                </GlassPanel>
              </section>

              {viewMode === "all" ? (
                <AtlasBoard
                  spots={mySpots}
                  selectedId={selectedSpot?.id}
                  onSelect={setSelectedId}
                  onEdit={openEditor}
                  onRemove={removeMySpot}
                />
              ) : (
                <GroupedAtlas groups={grouped} onSelect={setSelectedId} onEdit={openEditor} onRemove={removeMySpot} />
              )}

              {spotsWithoutLocation.length > 0 ? (
                <section>
                  <div className="mb-5 flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-amber-100" />
                    <h2 className="text-2xl font-semibold">位置を追加すると地図に表示されます</h2>
                    <Badge>{spotsWithoutLocation.length} spots</Badge>
                  </div>
                  <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                    {spotsWithoutLocation.map((spot) => (
                      <MySpotCard
                        key={`no-location-${spot.id}`}
                        spot={spot}
                        compact
                        onEdit={openEditor}
                        onRemove={removeMySpot}
                      />
                    ))}
                  </div>
                </section>
              ) : null}
            </div>
          )}
        </div>
      </section>

      <AddMySpotModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingSpot(undefined);
          setPickedLocation(undefined);
          setAddMode(false);
        }}
        editingSpot={editingSpot}
        initialLatitude={pickedLocation?.latitude}
        initialLongitude={pickedLocation?.longitude}
      />
    </main>
  );
}

function LoadingAtlas() {
  return (
    <GlassPanel className="p-10 text-center">
      <Loader2 className="mx-auto h-8 w-8 animate-spin text-cyan-100" />
      <p className="mt-4 text-slate-300">My Atlasを読み込んでいます。</p>
    </GlassPanel>
  );
}

function EmptyAtlas({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="space-y-10">
      <GlassPanel className="mx-auto max-w-4xl overflow-hidden p-0">
        <div className="grid gap-0 md:grid-cols-[0.9fr_1.1fr]">
          <div className="relative min-h-[320px]">
            <img
              src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1400&q=90"
              alt="旅の候補を集めるイメージ"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/28 to-transparent" />
          </div>
          <div className="p-7 md:p-10">
            <Badge className="mb-4 border-cyan-200/40 bg-cyan-200/[0.12] text-cyan-50">
              Start your Atlas
            </Badge>
            <h2 className="text-3xl font-semibold">まずはSNSで見つけた場所を1つ追加。</h2>
            <p className="mt-4 leading-8 text-slate-300">
              投稿URL、場所名、メモを貼るだけ。ZEKKEI ATLASがタグや季節を整理して、自分だけの絶景ボードに変えます。
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Button size="lg" onClick={onAdd}>
                <Plus className="h-5 w-5" />
                SNS URLから追加
              </Button>
              <Link href="/map" className={buttonVariants({ variant: "secondary", size: "lg" })}>
                地図を見る
              </Link>
            </div>
          </div>
        </div>
      </GlassPanel>

      <section>
        <div className="mb-5 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-2xl font-semibold">スターター候補を追加して試す</h2>
            <p className="mt-2 text-sm text-slate-400">保存ボタンを押すと、My Atlasに取り込まれます。</p>
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {starterSpots.slice(0, 3).map((spot) => (
            <SpotCard key={spot.id} spot={spot} compact />
          ))}
        </div>
      </section>
    </div>
  );
}

function AtlasBoard({
  spots,
  selectedId,
  onSelect,
  onEdit,
  onRemove
}: {
  spots: MySpot[];
  selectedId?: string;
  onSelect: (id: string) => void;
  onEdit: (spot: MySpot) => void;
  onRemove: (id: string) => void;
}) {
  return (
    <section>
      <div className="mb-5 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-2xl font-semibold">My Scenic Board</h2>
          <p className="mt-2 text-sm text-slate-400">保存した絶景を、写真・タグ・季節で眺め直すボードです。</p>
        </div>
      </div>
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {spots.map((spot) => (
          <MySpotCard
            key={spot.id}
            spot={spot}
            selected={selectedId === spot.id}
            onSelect={() => onSelect(spot.id)}
            onEdit={onEdit}
            onRemove={onRemove}
          />
        ))}
      </div>
    </section>
  );
}

function GroupedAtlas({
  groups,
  onSelect,
  onEdit,
  onRemove
}: {
  groups: Array<{ label: string; spots: MySpot[] }>;
  onSelect: (id: string) => void;
  onEdit: (spot: MySpot) => void;
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
              <MySpotCard
                key={`${group.label}-${spot.id}`}
                spot={spot}
                compact
                onSelect={() => onSelect(spot.id)}
                onEdit={onEdit}
                onRemove={onRemove}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.055] p-3">
      <p className="text-[11px] uppercase tracking-[0.16em] text-slate-400">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-white">{value}</p>
    </div>
  );
}

function groupByTag(items: MySpot[]) {
  const groups = new Map<string, MySpot[]>();
  items.forEach((spot) => {
    (spot.tags.length ? spot.tags : ["あとで整理"]).slice(0, 5).forEach((tag) => {
      groups.set(tag, [...(groups.get(tag) ?? []), spot]);
    });
  });
  return Array.from(groups.entries())
    .map(([label, groupedSpots]) => ({ label, spots: groupedSpots }))
    .sort((a, b) => b.spots.length - a.spots.length || a.label.localeCompare(b.label, "ja"));
}

function groupByTheme(items: MySpot[]) {
  const themes = Array.from(new Set(items.flatMap((spot) => spot.themes)));
  return themes
    .map((theme) => ({ label: mySpotThemeLabels[theme], spots: items.filter((spot) => spot.themes.includes(theme)) }))
    .filter((group) => group.spots.length > 0);
}

function groupBySeason(items: MySpot[]) {
  const groups = new Map<string, MySpot[]>();
  items.forEach((spot) => {
    (spot.bestSeason.length ? spot.bestSeason : ["未設定"]).forEach((season) => {
      groups.set(season, [...(groups.get(season) ?? []), spot]);
    });
  });
  return Array.from(groups.entries()).map(([label, groupedSpots]) => ({ label, spots: groupedSpots }));
}

function groupByStatus(items: MySpot[]) {
  return (["someday", "thisYear", "planning", "visited"] as const)
    .map((status) => ({ label: statusLabels[status], spots: items.filter((spot) => spot.status === status) }))
    .filter((group) => group.spots.length > 0);
}

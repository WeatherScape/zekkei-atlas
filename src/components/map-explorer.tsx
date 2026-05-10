"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  CalendarDays,
  Check,
  ChevronDown,
  Compass,
  Heart,
  MapPin,
  Pencil,
  Plus,
  RotateCcw,
  Search,
  Sparkles,
  Star,
  Telescope
} from "lucide-react";
import { seasonOptions, spots } from "@/data/spots";
import {
  mySpotStatusLabels,
  mySpotToMapSpot,
  type MySpot,
  type MySpotStatus
} from "@/data/my-spots";
import { AddMySpotModal } from "@/components/add-my-spot-modal";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { FilterChip } from "@/components/filter-chip";
import { GlassPanel } from "@/components/ui/glass-panel";
import { MySpotCard } from "@/components/my-spot-card";
import { SpotCard } from "@/components/spot-card";
import { TravelMap, type MapViewMode } from "@/components/map/TravelMap";
import { useMySpots } from "@/hooks/use-my-spots";
import { cn, normalizeText } from "@/lib/utils";

type MapExplorerProps = {
  initialSearch?: string;
  initialTag?: string;
  initialStyle?: string;
  initialSeason?: string;
  initialTime?: string;
  initialScope?: string;
  initialDifficulty?: string;
};

type QuickFilter =
  | "all"
  | "thisYear"
  | "planning"
  | "lifetime"
  | "couple"
  | "starry"
  | "sea"
  | "island"
  | "visited";

const quickFilters: Array<{ value: QuickFilter; label: string }> = [
  { value: "all", label: "すべて" },
  { value: "thisYear", label: "今年行きたい" },
  { value: "planning", label: "計画中" },
  { value: "lifetime", label: "一生に一度" },
  { value: "couple", label: "恋人と行きたい" },
  { value: "starry", label: "星空" },
  { value: "sea", label: "海" },
  { value: "island", label: "島" },
  { value: "visited", label: "行った" }
];

const modeOptions: Array<{ value: MapViewMode; label: string }> = [
  { value: "all", label: "すべて" },
  { value: "japan", label: "日本" },
  { value: "okinawa", label: "沖縄・離島" },
  { value: "overseas", label: "海外" }
];

const starterSpots = spots.filter((spot) => ["hateruma", "miyako", "uyuni", "tsunoshima"].includes(spot.id));

function spotMatchesMode(spot: MySpot, mode: MapViewMode) {
  if (mode === "all") return true;
  const text = normalizeText([spot.name, spot.region, spot.country, ...spot.tags].join(" "));
  if (mode === "japan") return spot.country === "日本" || text.includes("日本");
  if (mode === "okinawa") return text.includes("沖縄") || text.includes("離島") || text.includes("島") || text.includes("island");
  return spot.country ? spot.country !== "日本" : false;
}

function spotMatchesKeyword(spot: MySpot, keyword: string) {
  if (!keyword.trim()) return true;
  const haystack = normalizeText(
    [
      spot.name,
      spot.sourceUrl,
      spot.memo,
      spot.country,
      spot.region,
      spot.sourceType,
      spot.companion,
      spot.firstStepMemo,
      spot.catchCopy,
      ...spot.tags,
      ...spot.bestSeason,
      ...(spot.bestTime ?? [])
    ]
      .filter(Boolean)
      .join(" ")
  );
  return haystack.includes(normalizeText(keyword));
}

function spotMatchesQuickFilter(spot: MySpot, filter: QuickFilter) {
  if (filter === "all") return true;
  if (filter === "thisYear") return spot.status === "thisYear";
  if (filter === "planning") return spot.status === "planning";
  if (filter === "visited") return spot.status === "visited";
  if (filter === "lifetime") return spot.tags.includes("一生に一度");
  if (filter === "couple") return spot.tags.includes("恋人と行きたい") || normalizeText(spot.companion ?? "").includes("恋人");
  if (filter === "starry") return spot.tags.includes("星空");
  if (filter === "sea") return spot.tags.includes("海");
  if (filter === "island") return spot.tags.includes("島") || spot.tags.includes("離島");
  return true;
}

function statusCount(items: MySpot[], status: MySpotStatus) {
  return items.filter((spot) => spot.status === status).length;
}

export function MapExplorer({
  initialSearch = "",
  initialTag = "",
  initialSeason = ""
}: MapExplorerProps) {
  const { isReady, mySpots, removeMySpot, updateMySpot } = useMySpots();
  const [keyword, setKeyword] = useState(initialSearch);
  const [quickFilter, setQuickFilter] = useState<QuickFilter>("all");
  const [selectedTags, setSelectedTags] = useState<string[]>(initialTag ? [initialTag] : []);
  const [season, setSeason] = useState(seasonOptions.includes(initialSeason) ? initialSeason : "all");
  const [mode, setMode] = useState<MapViewMode>("all");
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | undefined>();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSpot, setEditingSpot] = useState<MySpot | undefined>();
  const [addMode, setAddMode] = useState(false);
  const [pickedLocation, setPickedLocation] = useState<{ latitude: number; longitude: number } | undefined>();

  const openCreator = () => {
    setPickedLocation(undefined);
    setEditingSpot(undefined);
    setModalOpen(true);
  };

  const openEditor = (spot: MySpot) => {
    setPickedLocation(undefined);
    setEditingSpot(spot);
    setModalOpen(true);
  };

  const filteredSpots = useMemo(() => {
    return mySpots
      .filter((spot) => spotMatchesKeyword(spot, keyword))
      .filter((spot) => selectedTags.every((tag) => spot.tags.includes(tag)))
      .filter((spot) => (season === "all" ? true : spot.bestSeason.includes(season)))
      .filter((spot) => spotMatchesMode(spot, mode))
      .filter((spot) => spotMatchesQuickFilter(spot, quickFilter))
      .sort((a, b) => {
        const priority = (spot: MySpot) =>
          spot.status === "thisYear" ? 0 : spot.status === "planning" ? 1 : spot.status === "someday" ? 2 : 3;
        return priority(a) - priority(b) || new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      });
  }, [keyword, mode, mySpots, quickFilter, season, selectedTags]);

  const locatedSpots = useMemo(
    () => filteredSpots.filter((spot) => typeof spot.latitude === "number" && typeof spot.longitude === "number"),
    [filteredSpots]
  );
  const unlocatedSpots = useMemo(
    () => filteredSpots.filter((spot) => typeof spot.latitude !== "number" || typeof spot.longitude !== "number"),
    [filteredSpots]
  );
  const mapSpots = useMemo(() => locatedSpots.map(mySpotToMapSpot), [locatedSpots]);

  useEffect(() => {
    if (!filteredSpots.length) {
      setSelectedId(undefined);
      return;
    }
    if (!selectedId || !filteredSpots.some((spot) => spot.id === selectedId)) {
      setSelectedId(filteredSpots[0].id);
    }
  }, [filteredSpots, selectedId]);

  const selectedSpot = filteredSpots.find((spot) => spot.id === selectedId) ?? filteredSpots[0];
  const activeFilterCount =
    (quickFilter !== "all" ? 1 : 0) +
    selectedTags.length +
    (season !== "all" ? 1 : 0) +
    (mode !== "all" ? 1 : 0) +
    (keyword.trim() ? 1 : 0);

  const resetFilters = () => {
    setKeyword("");
    setQuickFilter("all");
    setSelectedTags([]);
    setSeason("all");
    setMode("all");
    setSelectedId(mySpots[0]?.id);
  };

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  const toggleTag = (tag: string) => {
    setSelectedTags((current) =>
      current.includes(tag) ? current.filter((item) => item !== tag) : [...current, tag]
    );
  };

  const aiPrompt = encodeURIComponent(
    filteredSpots.length
      ? `My Atlasの候補で旅程を作る: ${filteredSpots.map((spot) => spot.name).join("、")}`
      : "SNSで見つけた絶景候補から旅程を考えたい"
  );

  return (
    <main className="min-h-screen overflow-hidden bg-atlas-ink text-white">
      <section className="relative min-h-screen px-3 pb-6 pt-24 md:px-5 md:pt-24">
        <div className="absolute inset-0 bg-night-rim" />
        <div className="absolute inset-0 bg-atlas-grid bg-[length:72px_72px] opacity-15" />
        <div className="pointer-events-none absolute -right-40 top-10 h-80 w-80 rounded-full bg-cyan-200/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 left-1/4 h-96 w-96 rounded-full bg-violet-300/10 blur-3xl" />

        <div className="relative mx-auto grid max-w-[1720px] gap-4 lg:grid-cols-[92px_minmax(0,1fr)_380px]">
          <aside className="hidden lg:flex lg:min-h-[calc(100vh-7rem)] lg:flex-col lg:justify-between rounded-[30px] border border-white/[0.12] bg-slate-950/62 p-4 shadow-glass backdrop-blur-2xl">
            <div className="space-y-5">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-cyan-100/70">ZEKKEI</p>
                <p className="mt-1 text-lg font-semibold">ATLAS</p>
              </div>
              <Button size="icon" className="h-14 w-14" onClick={openCreator} title="行きたい場所を追加">
                <Plus className="h-6 w-6" />
              </Button>
              <SidebarMetric label="All" value={isReady ? mySpots.length : 0} />
              <SidebarMetric label="2026" value={statusCount(mySpots, "thisYear")} />
              <SidebarMetric label="Plan" value={statusCount(mySpots, "planning")} />
              <SidebarMetric label="Done" value={statusCount(mySpots, "visited")} />
            </div>
            <Link href="/wishlist" className="text-center text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400 hover:text-cyan-100">
              Board
            </Link>
          </aside>

          <div className="min-w-0 space-y-4">
            <div className="rounded-[32px] border border-white/[0.12] bg-slate-950/58 p-4 shadow-glass backdrop-blur-2xl">
              <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
                <div className="max-w-3xl">
                  <Badge className="mb-3 border-cyan-200/40 bg-cyan-200/[0.12] text-cyan-50">
                    Private Travel Map
                  </Badge>
                  <h1 className="text-balance text-3xl font-semibold tracking-normal md:text-5xl">
                    いつか行きたいを、後悔にしない。
                  </h1>
                  <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300 md:text-base md:leading-8">
                    SNSで見つけた景色、ふと思い出した旅先、人生で見たい場所を、自分だけの地図に残そう。
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    size="md"
                    onClick={() => setAddMode((current) => !current)}
                    variant={addMode ? "primary" : "secondary"}
                  >
                    <MapPin className="h-4 w-4" />
                    {addMode ? "追加モード中" : "地図に追加"}
                  </Button>
                  <Button size="md" onClick={openCreator}>
                    <Plus className="h-4 w-4" />
                    行きたい場所を追加
                  </Button>
                </div>
              </div>

              <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
                {quickFilters.map((filter) => (
                  <button
                    key={filter.value}
                    type="button"
                    onClick={() => setQuickFilter(filter.value)}
                    className={cn(
                      "shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition",
                      quickFilter === filter.value
                        ? "border-cyan-200 bg-cyan-200 text-slate-950 shadow-glow"
                        : "border-white/[0.12] bg-white/[0.06] text-slate-200 hover:border-cyan-200/40 hover:bg-cyan-200/10"
                    )}
                  >
                    {filter.label}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setDetailsOpen((current) => !current)}
                  className="shrink-0 rounded-full border border-white/[0.12] bg-white/[0.06] px-4 py-2 text-sm font-semibold text-slate-200 transition hover:border-cyan-200/40 hover:bg-cyan-200/10"
                >
                  もっと絞り込む
                  <ChevronDown className={cn("ml-2 inline h-4 w-4 transition", detailsOpen ? "rotate-180" : "")} />
                </button>
              </div>

              {detailsOpen ? (
                <div className="mt-4 grid gap-3 rounded-[24px] border border-white/[0.10] bg-white/[0.045] p-3 lg:grid-cols-[1fr_auto_auto]">
                  <form onSubmit={handleSearch} className="relative">
                    <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-cyan-100" />
                    <input
                      value={keyword}
                      onChange={(event) => setKeyword(event.target.value)}
                      placeholder="場所名、SNS URL、メモから探す"
                      className="h-12 w-full rounded-2xl border border-white/10 bg-slate-950/50 pl-11 pr-4 text-white outline-none placeholder:text-slate-500 focus:border-cyan-200/50"
                    />
                  </form>
                  <div className="flex gap-2 overflow-x-auto">
                    {modeOptions.map((item) => (
                      <FilterChip key={item.value} label={item.label} active={mode === item.value} onClick={() => setMode(item.value)} />
                    ))}
                  </div>
                  <Button type="button" variant="secondary" onClick={resetFilters}>
                    <RotateCcw className="h-4 w-4" />
                    リセット
                  </Button>
                  <div className="flex flex-wrap gap-2 lg:col-span-3">
                    <FilterChip label="季節すべて" active={season === "all"} onClick={() => setSeason("all")} />
                    {seasonOptions.map((item) => (
                      <FilterChip key={item} label={item} active={season === item} onClick={() => setSeason(item)} />
                    ))}
                    {["一生に一度", "恋人と行きたい", "星空", "海", "島"].map((tag) => (
                      <FilterChip key={tag} label={`#${tag}`} active={selectedTags.includes(tag)} onClick={() => toggleTag(tag)} />
                    ))}
                  </div>
                </div>
              ) : null}
            </div>

            <div className="relative">
              <TravelMap
                spots={mapSpots}
                selectedSpotId={selectedSpot?.id}
                onSelect={(spot) => setSelectedId(spot.id)}
                onReset={resetFilters}
                mode={mode}
                season={season}
                selectedTags={[
                  quickFilters.find((item) => item.value === quickFilter)?.label ?? "すべて",
                  ...selectedTags
                ].filter((tag) => tag !== "すべて")}
                addMode={addMode}
                onPickLocation={(location) => {
                  setPickedLocation(location);
                  setEditingSpot(undefined);
                  setAddMode(false);
                  setModalOpen(true);
                }}
                className="min-h-[62svh] md:min-h-[calc(100vh-18rem)] lg:min-h-[calc(100vh-18rem)]"
              />

              {mySpots.length === 0 && isReady ? (
                <EmptyMapOverlay onAdd={openCreator} />
              ) : null}

              <div className="pointer-events-none absolute bottom-4 left-4 right-4 z-[440] hidden md:block">
                <div className="pointer-events-auto flex gap-3 overflow-x-auto rounded-[26px] border border-white/[0.12] bg-slate-950/68 p-3 shadow-glass backdrop-blur-2xl">
                  {filteredSpots.slice(0, 10).map((spot) => (
                    <MiniSpotCard
                      key={spot.id}
                      spot={spot}
                      selected={selectedSpot?.id === spot.id}
                      onClick={() => setSelectedId(spot.id)}
                    />
                  ))}
                  {unlocatedSpots.length > 0 ? (
                    <div className="flex min-w-[220px] flex-col justify-center rounded-2xl border border-amber-200/20 bg-amber-200/[0.08] p-4 text-sm text-amber-50">
                      <MapPin className="mb-2 h-5 w-5" />
                      {unlocatedSpots.length}件は位置を追加すると地図に出ます。
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </div>

          <aside className="hidden min-w-0 lg:block">
            <GlassPanel className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto p-5">
              <MapStatus
                total={filteredSpots.length}
                onMap={locatedSpots.length}
                activeFilterCount={activeFilterCount}
              />
              {selectedSpot ? (
                <SelectedSpotPanel
                  spot={selectedSpot}
                  onEdit={openEditor}
                  onRemove={removeMySpot}
                  onStatusChange={(status) => updateMySpot(selectedSpot.id, { status })}
                  aiPrompt={aiPrompt}
                />
              ) : (
                <RightEmptyPanel onAdd={openCreator} />
              )}
            </GlassPanel>
          </aside>
        </div>

        <button
          type="button"
          onClick={openCreator}
          className="fixed bottom-5 right-5 z-[900] flex h-14 w-14 items-center justify-center rounded-full border border-cyan-100/60 bg-cyan-200 text-slate-950 shadow-glow lg:hidden"
          aria-label="行きたい場所を追加"
        >
          <Plus className="h-6 w-6" />
        </button>

        <div className="relative z-[450] mt-4 lg:hidden">
          {selectedSpot ? (
            <GlassPanel className="rounded-t-[32px] p-4">
              <SelectedSpotPanel
                spot={selectedSpot}
                onEdit={openEditor}
                onRemove={removeMySpot}
                onStatusChange={(status) => updateMySpot(selectedSpot.id, { status })}
                aiPrompt={aiPrompt}
                compact
              />
            </GlassPanel>
          ) : null}
          {filteredSpots.length > 0 ? (
            <div className="mt-3 flex gap-3 overflow-x-auto pb-2">
              {filteredSpots.slice(0, 12).map((spot) => (
                <MiniSpotCard
                  key={`mobile-${spot.id}`}
                  spot={spot}
                  selected={selectedSpot?.id === spot.id}
                  onClick={() => setSelectedId(spot.id)}
                />
              ))}
            </div>
          ) : null}
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

function SidebarMetric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.055] p-3 text-center">
      <p className="text-xl font-semibold text-white">{value}</p>
      <p className="mt-1 text-[10px] uppercase tracking-[0.16em] text-slate-400">{label}</p>
    </div>
  );
}

function MapStatus({
  total,
  onMap,
  activeFilterCount
}: {
  total: number;
  onMap: number;
  activeFilterCount: number;
}) {
  return (
    <div className="mb-5 grid grid-cols-3 gap-2">
      <Metric label="My Atlas" value={String(total)} />
      <Metric label="On Map" value={String(onMap)} />
      <Metric label="Filter" value={String(activeFilterCount)} />
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.055] p-3">
      <p className="text-[10px] uppercase tracking-[0.14em] text-slate-400">{label}</p>
      <p className="mt-1 text-xl font-semibold text-white">{value}</p>
    </div>
  );
}

function SelectedSpotPanel({
  spot,
  onEdit,
  onRemove,
  onStatusChange,
  aiPrompt,
  compact
}: {
  spot: MySpot;
  onEdit: (spot: MySpot) => void;
  onRemove: (id: string) => void;
  onStatusChange: (status: MySpotStatus) => void;
  aiPrompt: string;
  compact?: boolean;
}) {
  return (
    <div>
      <div className="mb-4 flex items-center justify-between gap-3">
        <Badge className="border-cyan-200/40 bg-cyan-200/[0.12] text-cyan-50">選択中</Badge>
        <button
          type="button"
          onClick={() => onEdit(spot)}
          className="inline-flex h-9 items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 text-xs text-slate-200 transition hover:bg-white/15"
        >
          <Pencil className="h-3.5 w-3.5" />
          編集
        </button>
      </div>

      <MySpotCard spot={spot} compact={compact} onEdit={onEdit} onRemove={onRemove} />

      <div className="mt-4 grid gap-2">
        <Button type="button" variant="secondary" onClick={() => onStatusChange("thisYear")}>
          <CalendarDays className="h-4 w-4" />
          今年行く候補にする
        </Button>
        <Button type="button" variant="secondary" onClick={() => onStatusChange("planning")}>
          <Compass className="h-4 w-4" />
          計画中にする
        </Button>
        <Button type="button" variant="secondary" onClick={() => onStatusChange("visited")}>
          <Check className="h-4 w-4" />
          行った景色にする
        </Button>
        <Link href={`/ai-planner?prompt=${aiPrompt}`} className={buttonVariants({ variant: "primary", size: "md", className: "w-full" })}>
          <Sparkles className="h-4 w-4" />
          この地図から旅程を作る
        </Link>
      </div>
    </div>
  );
}

function RightEmptyPanel({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="flex min-h-[520px] flex-col items-center justify-center text-center">
      <Telescope className="mb-4 h-10 w-10 text-cyan-100" />
      <h2 className="text-2xl font-semibold">まだ、あなたの地図には景色がありません。</h2>
      <p className="mt-3 text-sm leading-7 text-slate-300">
        SNSで見つけた場所、いつか行きたい島、人生で見たい絶景を追加してみましょう。
      </p>
      <Button className="mt-6" onClick={onAdd}>
        <Plus className="h-4 w-4" />
        最初の場所を追加する
      </Button>
    </div>
  );
}

function EmptyMapOverlay({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="absolute inset-4 z-[430] flex items-center justify-center rounded-[28px] border border-white/[0.12] bg-slate-950/72 p-5 text-center shadow-glass backdrop-blur-xl">
      <div className="max-w-xl">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full border border-cyan-200/30 bg-cyan-200/10 text-cyan-100">
          <Heart className="h-7 w-7" />
        </div>
        <h2 className="text-3xl font-semibold">まだ、あなたの地図には景色がありません。</h2>
        <p className="mx-auto mt-4 max-w-lg text-sm leading-8 text-slate-300">
          SNSで見つけた場所、いつか行きたい島、人生で見たい絶景を追加して、自分だけの地図を育てましょう。
        </p>
        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
          <Button size="lg" onClick={onAdd}>
            <Plus className="h-5 w-5" />
            最初の場所を追加する
          </Button>
          <Link href="/wishlist" className={buttonVariants({ variant: "secondary", size: "lg" })}>
            おすすめから選ぶ
          </Link>
        </div>
        <div className="mt-8 hidden grid-cols-2 gap-4 md:grid">
          {starterSpots.slice(0, 2).map((spot) => (
            <SpotCard key={spot.id} spot={spot} compact />
          ))}
        </div>
      </div>
    </div>
  );
}

function MiniSpotCard({
  spot,
  selected,
  onClick
}: {
  spot: MySpot;
  selected?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex min-w-[220px] max-w-[220px] items-center gap-3 rounded-2xl border p-2 text-left transition",
        selected
          ? "border-cyan-200/70 bg-cyan-200/[0.12]"
          : "border-white/[0.12] bg-white/[0.07] hover:border-cyan-200/35 hover:bg-white/[0.1]"
      )}
    >
      <div className="h-16 w-16 overflow-hidden rounded-xl bg-slate-900">
        {spot.image ? (
          <img src={spot.image} alt={spot.name} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-cyan-100">
            <MapPin className="h-5 w-5" />
          </div>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-white">{spot.name}</p>
        <p className="mt-1 truncate text-xs text-cyan-100">{mySpotStatusLabels[spot.status]}</p>
        <p className="mt-1 truncate text-[11px] text-slate-400">
          {[spot.region, spot.country].filter(Boolean).join(" / ") || "位置はあとで整理"}
        </p>
      </div>
    </button>
  );
}

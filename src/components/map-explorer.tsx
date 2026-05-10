"use client";

import { FormEvent, ReactNode, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Bot, Filter, MapPin, Plus, RotateCcw, Search, Sparkles } from "lucide-react";
import { seasonOptions, spots } from "@/data/spots";
import { mySpotToMapSpot, type MySpot } from "@/data/my-spots";
import { AddMySpotModal } from "@/components/add-my-spot-modal";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { FilterChip } from "@/components/filter-chip";
import { GlassPanel } from "@/components/ui/glass-panel";
import { MySpotCard } from "@/components/my-spot-card";
import { SpotCard } from "@/components/spot-card";
import { TravelMap, type MapViewMode } from "@/components/map/TravelMap";
import { useMySpots } from "@/hooks/use-my-spots";
import { normalizeText } from "@/lib/utils";

type MapExplorerProps = {
  initialSearch?: string;
  initialTag?: string;
  initialStyle?: string;
  initialSeason?: string;
  initialTime?: string;
  initialScope?: string;
  initialDifficulty?: string;
};

const modeOptions: Array<{ value: MapViewMode; label: string; description: string }> = [
  { value: "all", label: "すべて", description: "My Atlas全体" },
  { value: "japan", label: "日本", description: "国内候補" },
  { value: "okinawa", label: "沖縄・離島", description: "島旅候補" },
  { value: "overseas", label: "海外", description: "海外候補" }
];

const scenicTypeFilters = ["星空", "海", "紅葉", "雪", "雲海", "滝", "夕日", "離島", "ドライブ", "カップル", "一生に一度"];
const starterSpots = spots.filter((spot) => ["hateruma", "miyako", "uyuni", "tsunoshima"].includes(spot.id));

function normalizeTagFilter(tag: string) {
  return tag === "島" ? "離島" : tag;
}

function spotMatchesMode(spot: MySpot, mode: MapViewMode) {
  if (mode === "all") return true;
  if (mode === "japan") return spot.country === "日本";
  if (mode === "okinawa") {
    const text = normalizeText([spot.name, spot.region, spot.country, ...spot.tags].join(" "));
    return text.includes("沖縄") || text.includes("離島") || text.includes("island");
  }
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
      ...spot.tags,
      ...spot.bestSeason
    ]
      .filter(Boolean)
      .join(" ")
  );
  return haystack.includes(normalizeText(keyword));
}

export function MapExplorer({
  initialSearch = "",
  initialTag = "",
  initialSeason = ""
}: MapExplorerProps) {
  const { isReady, mySpots, removeMySpot } = useMySpots();
  const [keyword, setKeyword] = useState(initialSearch);
  const [selectedTags, setSelectedTags] = useState<string[]>(
    initialTag ? [normalizeTagFilter(initialTag)] : []
  );
  const [season, setSeason] = useState(seasonOptions.includes(initialSeason) ? initialSeason : "all");
  const [mode, setMode] = useState<MapViewMode>("all");
  const [selectedId, setSelectedId] = useState<string | undefined>();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSpot, setEditingSpot] = useState<MySpot | undefined>();
  const [addMode, setAddMode] = useState(false);
  const [pickedLocation, setPickedLocation] = useState<{ latitude: number; longitude: number } | undefined>();
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
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }, [keyword, mode, mySpots, season, selectedTags]);

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
    selectedTags.length + (season !== "all" ? 1 : 0) + (mode !== "all" ? 1 : 0) + (keyword.trim() ? 1 : 0);

  const toggleTag = (tag: string) => {
    setSelectedTags((current) =>
      current.includes(tag) ? current.filter((item) => item !== tag) : [...current, tag]
    );
  };

  const resetFilters = () => {
    setKeyword("");
    setSelectedTags([]);
    setSeason("all");
    setMode("all");
    setSelectedId(mySpots[0]?.id);
  };

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  const aiPrompt = encodeURIComponent(
    filteredSpots.length
      ? `My Atlasの候補で旅程を作る: ${filteredSpots.map((spot) => spot.name).join("、")}`
      : "SNSで見つけた絶景候補から旅程を考えたい"
  );

  return (
    <main className="min-h-screen bg-atlas-ink text-white">
      <section className="relative overflow-hidden px-4 pb-12 pt-28 md:px-8 md:pt-32">
        <div className="absolute inset-0 bg-night-rim" />
        <div className="absolute inset-0 bg-atlas-grid bg-[length:72px_72px] opacity-20" />

        <div className="relative mx-auto max-w-[1480px]">
          <div className="mb-7 grid gap-5 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <Badge className="mb-4 border-cyan-200/40 bg-cyan-200/[0.12] text-cyan-50">
                My Atlas Map
              </Badge>
              <h1 className="text-balance text-4xl font-semibold tracking-normal md:text-6xl">
                My Map Discovery
              </h1>
              <p className="mt-4 max-w-3xl text-base leading-8 text-slate-300">
                SNSで見つけた行きたい絶景を、自分だけの地図で眺める。位置がある候補は地図へ、未整理の候補はカードで育てます。
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
                AIにこのリストで相談
              </Link>
            </div>
          </div>

          <div className="mb-5 flex flex-col gap-3 rounded-[24px] border border-cyan-200/20 bg-cyan-200/[0.06] p-3 backdrop-blur-xl md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold text-cyan-50">地図にどんどん登録</p>
              <p className="mt-1 text-xs leading-6 text-slate-300">
                追加モードにして地図を動かし、中央ピンの位置をMy Atlasに保存できます。
              </p>
            </div>
            <div className="flex gap-2">
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
          </div>

          <form
            onSubmit={handleSearch}
            className="mb-4 grid gap-3 rounded-[30px] border border-white/[0.12] bg-white/[0.07] p-3 shadow-glass backdrop-blur-2xl lg:grid-cols-[1fr_auto_auto]"
          >
            <label className="flex h-14 min-h-14 items-center gap-3 rounded-2xl bg-slate-950/50 px-4">
              <Search className="h-5 w-5 text-cyan-100" />
              <input
                value={keyword}
                onChange={(event) => setKeyword(event.target.value)}
                placeholder="保存した場所、SNS URL、メモ、タグから探す..."
                className="h-12 w-full bg-transparent text-base text-white outline-none placeholder:text-slate-500"
              />
            </label>
            <Button type="submit" variant="primary" size="lg">
              検索
            </Button>
            <Button type="button" variant="secondary" size="lg" onClick={resetFilters}>
              <RotateCcw className="h-5 w-5" />
              リセット
            </Button>
          </form>

          <div className="mb-5 flex gap-2 overflow-x-auto pb-2">
            {modeOptions.map((item) => (
              <button
                key={item.value}
                type="button"
                onClick={() => setMode(item.value)}
                className={
                  mode === item.value
                    ? "shrink-0 rounded-full border border-cyan-200 bg-cyan-200 px-4 py-2 text-sm font-semibold text-slate-950"
                    : "shrink-0 rounded-full border border-white/[0.12] bg-white/[0.06] px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-cyan-200/40 hover:bg-cyan-200/10"
                }
              >
                {item.label}
                <span className="ml-2 text-xs opacity-70">{item.description}</span>
              </button>
            ))}
          </div>

          <div className="mb-5 flex flex-col gap-3 rounded-[24px] border border-white/[0.10] bg-white/[0.045] p-3 backdrop-blur-xl md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
              <span className="shrink-0 px-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                Season
              </span>
              <FilterChip label="すべて" active={season === "all"} onClick={() => setSeason("all")} className="shrink-0" />
              {seasonOptions.map((item) => (
                <FilterChip key={item} label={item} active={season === item} onClick={() => setSeason(item)} className="shrink-0" />
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge>{filteredSpots.length}件を表示中</Badge>
              <Badge>{locatedSpots.length}件が地図に表示</Badge>
              {selectedTags.map((tag) => (
                <Badge key={tag}>#{tag}</Badge>
              ))}
            </div>
          </div>

          <div className="grid gap-5 xl:grid-cols-[300px_minmax(0,1fr)_360px]">
            <GlassPanel className="hidden xl:block xl:sticky xl:top-28 xl:h-[calc(100vh-8rem)] xl:overflow-y-auto">
              <div className="space-y-6 p-5">
                <div className="flex items-center justify-between">
                  <h2 className="flex items-center gap-2 text-lg font-semibold">
                    <Filter className="h-5 w-5 text-cyan-100" />
                    My Filters
                  </h2>
                  <Badge>{activeFilterCount} active</Badge>
                </div>
                <FilterGroup title="絶景タイプ">
                  <div className="flex flex-wrap gap-2">
                    {scenicTypeFilters.map((tag) => (
                      <FilterChip key={tag} label={tag} active={selectedTags.includes(tag)} onClick={() => toggleTag(tag)} />
                    ))}
                  </div>
                </FilterGroup>
                <FilterGroup title="使い方">
                  <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-4 text-sm leading-7 text-slate-300">
                    位置情報がある候補だけ地図に出ます。SNS URLだけの候補はカードに残し、あとで緯度経度や地域を足せます。
                  </div>
                </FilterGroup>
              </div>
            </GlassPanel>

            <div className="space-y-5">
              <div className="flex flex-col gap-3 rounded-[28px] border border-white/[0.12] bg-white/[0.06] p-4 backdrop-blur-2xl md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="flex items-center gap-2 text-sm text-cyan-100">
                    <MapPin className="h-4 w-4" />
                    {isReady ? `${locatedSpots.length}件のMy Spotを地図に表示` : "My Atlasを読み込み中"}
                    <span className="text-slate-500">/ 全候補 {filteredSpots.length}件</span>
                  </p>
                  <p className="mt-1 text-xs text-slate-400">
                    ピンを押すと保存元やメモを確認できます。
                  </p>
                </div>
              </div>

              <TravelMap
                spots={mapSpots}
                selectedSpotId={selectedSpot?.id}
                onSelect={(spot) => setSelectedId(spot.id)}
                onReset={resetFilters}
                mode={mode}
                season={season}
                selectedTags={selectedTags}
                addMode={addMode}
                onPickLocation={(location) => {
                  setPickedLocation(location);
                  setEditingSpot(undefined);
                  setAddMode(false);
                  setModalOpen(true);
                }}
              />

              {mySpots.length === 0 ? (
                <EmptyMapState
                  onAdd={() => {
                    setPickedLocation(undefined);
                    setEditingSpot(undefined);
                    setModalOpen(true);
                  }}
                />
              ) : null}

              {unlocatedSpots.length > 0 ? (
                <section>
                  <div className="mb-4 flex flex-wrap items-center gap-3">
                    <h2 className="text-xl font-semibold">位置未設定の候補</h2>
                    <Badge>{unlocatedSpots.length} spots</Badge>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2 2xl:grid-cols-3">
                    {unlocatedSpots.map((spot) => (
                  <MySpotCard
                    key={spot.id}
                    spot={spot}
                    compact
                    onSelect={() => setSelectedId(spot.id)}
                    onEdit={openEditor}
                    onRemove={removeMySpot}
                  />
                    ))}
                  </div>
                </section>
              ) : null}

              <section>
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h2 className="text-xl font-semibold">My Atlas Board</h2>
                    <p className="mt-1 text-sm text-slate-400">カードを押すと地図・右パネルと連動します。</p>
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 2xl:grid-cols-3">
                  {filteredSpots.map((spot) => (
                    <MySpotCard
                      key={spot.id}
                      spot={spot}
                      compact
                      selected={selectedId === spot.id}
                      onSelect={() => setSelectedId(spot.id)}
                      onEdit={openEditor}
                      onRemove={removeMySpot}
                    />
                  ))}
                </div>
              </section>
            </div>

            <GlassPanel className="xl:sticky xl:top-28 xl:h-[calc(100vh-8rem)] xl:overflow-y-auto">
              {selectedSpot ? (
                <div className="p-5">
                  <Badge className="mb-4 border-cyan-200/40 bg-cyan-200/[0.12] text-cyan-50">
                    選択中
                  </Badge>
                  <MySpotCard spot={selectedSpot} onEdit={openEditor} onRemove={removeMySpot} />
                  <div className="mt-4 grid gap-3">
                    <Link
                      href={`/ai-planner?prompt=${encodeURIComponent(`${selectedSpot.name}を中心に旅程を作る。メモ:${selectedSpot.memo ?? ""}`)}`}
                      className={buttonVariants({ variant: "primary", size: "md", className: "w-full" })}
                    >
                      <Sparkles className="h-4 w-4" />
                      AIに旅程を相談
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center text-slate-400">
                  <Bot className="mx-auto mb-3 h-8 w-8 text-cyan-100" />
                  SNSで見つけた場所を追加すると、ここに詳細が表示されます。
                </div>
              )}
            </GlassPanel>
          </div>
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

function EmptyMapState({ onAdd }: { onAdd: () => void }) {
  return (
    <GlassPanel className="p-8 text-center md:p-12">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-cyan-200/25 bg-cyan-200/10 text-cyan-100">
        <Plus className="h-7 w-7" />
      </div>
      <h2 className="mt-6 text-3xl font-semibold">まだMy Atlasに場所がありません。</h2>
      <p className="mx-auto mt-4 max-w-2xl leading-8 text-slate-300">
        SNSで見つけた投稿URLや場所名を追加すると、ここが自分だけの絶景マップになります。
      </p>
      <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
        <Button size="lg" onClick={onAdd}>
          <Plus className="h-5 w-5" />
          SNS URLから追加
        </Button>
        <Link href="/wishlist" className={buttonVariants({ variant: "secondary", size: "lg" })}>
          My Atlasを開く
        </Link>
      </div>
      <div className="mt-10 grid gap-4 md:grid-cols-4">
        {starterSpots.map((spot) => (
          <SpotCard key={spot.id} spot={spot} compact />
        ))}
      </div>
    </GlassPanel>
  );
}

function FilterGroup({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <h3 className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
        {title}
      </h3>
      {children}
    </section>
  );
}

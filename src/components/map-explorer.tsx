"use client";

import { FormEvent, ReactNode, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Bot,
  Camera,
  Clock,
  Filter,
  MapPin,
  RotateCcw,
  Search,
  SlidersHorizontal,
  Sparkles,
  Wallet
} from "lucide-react";
import {
  seasonOptions,
  spots,
  timeOptions,
  travelStyleOptions,
  Spot
} from "@/data/spots";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { FilterChip } from "@/components/filter-chip";
import { GlassPanel } from "@/components/ui/glass-panel";
import { SpotCard } from "@/components/spot-card";
import { WishlistButton } from "@/components/wishlist-button";
import { TravelMap, type MapViewMode } from "@/components/map/TravelMap";
import { budgetLabel, difficultyLabel, isDomestic, normalizeText } from "@/lib/utils";

type ScopeFilter = "all" | "domestic" | "overseas";
type DifficultyFilter = "all" | Spot["difficulty"];

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
  { value: "all", label: "すべて", description: "全スポット" },
  { value: "japan", label: "日本", description: "日本列島" },
  { value: "okinawa", label: "沖縄・離島", description: "南西諸島" },
  { value: "overseas", label: "海外", description: "海外スポット" }
];

const scenicTypeFilters = [
  { label: "星空", value: "星空" },
  { label: "海", value: "海" },
  { label: "紅葉", value: "紅葉" },
  { label: "雪", value: "雪" },
  { label: "雲海", value: "雲海" },
  { label: "滝", value: "滝" },
  { label: "夕日", value: "夕日" },
  { label: "離島", value: "島" },
  { label: "ドライブ", value: "ドライブ" },
  { label: "カップル", value: "カップル" },
  { label: "一生に一度", value: "一生に一度" }
];

const islandIds = new Set(["ishigaki", "hateruma", "miyako", "taketomi", "kouri", "yakushima", "okunoshima"]);

function spotMatchesKeyword(spot: Spot, keyword: string) {
  if (!keyword.trim()) return true;
  const haystack = normalizeText(
    [
      spot.name,
      spot.country,
      spot.region,
      spot.description,
      ...spot.tags,
      ...spot.bestSeason,
      ...spot.bestTime,
      ...spot.travelStyle
    ].join(" ")
  );
  return haystack.includes(normalizeText(keyword));
}

function spotMatchesMode(spot: Spot, mode: MapViewMode) {
  if (mode === "all") return true;
  if (mode === "japan") return isDomestic(spot);
  if (mode === "okinawa") return islandIds.has(spot.id) || spot.region === "沖縄県";
  return !isDomestic(spot);
}

function validOrAll(value: string | undefined, options: string[]) {
  return value && options.includes(value) ? value : "all";
}

function normalizeTagFilter(tag: string) {
  return tag === "離島" ? "島" : tag;
}

function getTagLabel(tag: string) {
  return tag === "島" ? "離島" : tag;
}

export function MapExplorer({
  initialSearch = "",
  initialTag = "",
  initialStyle = "",
  initialSeason = "",
  initialTime = "",
  initialScope = "",
  initialDifficulty = ""
}: MapExplorerProps) {
  const [keyword, setKeyword] = useState(initialSearch);
  const [selectedTags, setSelectedTags] = useState<string[]>(initialTag ? [normalizeTagFilter(initialTag)] : []);
  const [season, setSeason] = useState(validOrAll(initialSeason, seasonOptions));
  const [time, setTime] = useState(validOrAll(initialTime, timeOptions));
  const [style, setStyle] = useState(validOrAll(initialStyle, travelStyleOptions));
  const [scope, setScope] = useState<ScopeFilter>(
    ["all", "domestic", "overseas"].includes(initialScope) ? (initialScope as ScopeFilter) : "all"
  );
  const [difficulty, setDifficulty] = useState<DifficultyFilter>(
    ["all", "easy", "normal", "hard"].includes(initialDifficulty)
      ? (initialDifficulty as DifficultyFilter)
      : "all"
  );
  const [mode, setMode] = useState<MapViewMode>("all");
  const [selectedSpotId, setSelectedSpotId] = useState(spots[0].id);

  const filteredSpots = useMemo(() => {
    return spots
      .filter((spot) => spotMatchesKeyword(spot, keyword))
      .filter((spot) => selectedTags.every((tag) => spot.tags.includes(tag)))
      .filter((spot) => (season === "all" ? true : spot.bestSeason.includes(season)))
      .filter((spot) => (time === "all" ? true : spot.bestTime.includes(time)))
      .filter((spot) => (style === "all" ? true : spot.travelStyle.includes(style)))
      .filter((spot) => {
        if (scope === "domestic") return isDomestic(spot);
        if (scope === "overseas") return !isDomestic(spot);
        return true;
      })
      .filter((spot) => (difficulty === "all" ? true : spot.difficulty === difficulty))
      .sort((a, b) => b.photoScore - a.photoScore);
  }, [difficulty, keyword, scope, season, selectedTags, style, time]);

  const visibleSpots = useMemo(
    () => filteredSpots.filter((spot) => spotMatchesMode(spot, mode)),
    [filteredSpots, mode]
  );

  useEffect(() => {
    if (visibleSpots.length === 0) return;
    if (!visibleSpots.some((spot) => spot.id === selectedSpotId)) {
      setSelectedSpotId(visibleSpots[0].id);
    }
  }, [selectedSpotId, visibleSpots]);

  const selectedSpot = visibleSpots.find((spot) => spot.id === selectedSpotId) ?? visibleSpots[0];

  const activeFilterCount =
    selectedTags.length +
    (season !== "all" ? 1 : 0) +
    (time !== "all" ? 1 : 0) +
    (style !== "all" ? 1 : 0) +
    (scope !== "all" ? 1 : 0) +
    (difficulty !== "all" ? 1 : 0) +
    (keyword.trim() ? 1 : 0);

  const toggleTag = (tag: string) => {
    setSelectedTags((current) =>
      current.includes(tag) ? current.filter((item) => item !== tag) : [...current, tag]
    );
  };

  const resetFilters = () => {
    setKeyword("");
    setSelectedTags([]);
    setSeason("all");
    setTime("all");
    setStyle("all");
    setScope("all");
    setDifficulty("all");
    setMode("all");
    setSelectedSpotId(spots[0].id);
  };

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  const aiPrompt = encodeURIComponent(
    [
      keyword ? `キーワード:${keyword}` : "",
      selectedTags.length ? `タグ:${selectedTags.map(getTagLabel).join("、")}` : "",
      season !== "all" ? `季節:${season}` : "",
      time !== "all" ? `時間帯:${time}` : "",
      style !== "all" ? `スタイル:${style}` : "",
      scope !== "all" ? `範囲:${scope === "domestic" ? "国内" : "海外"}` : "",
      difficulty !== "all" ? `難易度:${difficultyLabel(difficulty)}` : "",
      mode !== "all" ? `表示:${modeOptions.find((item) => item.value === mode)?.label}` : ""
    ]
      .filter(Boolean)
      .join(" / ")
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
                ZEKKEI ATLAS
              </Badge>
              <h1 className="text-balance text-4xl font-semibold tracking-normal md:text-6xl">
                Map Discovery
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-8 text-slate-300">
                季節、時間、旅のスタイルから、次の絶景を地図で探す。
              </p>
            </div>
            <Link
              href={`/ai-planner${aiPrompt ? `?prompt=${aiPrompt}` : ""}`}
              className={buttonVariants({ variant: "primary", size: "lg", className: "w-fit" })}
            >
              <Sparkles className="h-5 w-5" />
              AIにこの条件で相談する
            </Link>
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
                placeholder="海、星空、紅葉、車なし、週末旅..."
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
                Season Layer
              </span>
              <FilterChip
                label="すべて"
                active={season === "all"}
                onClick={() => setSeason("all")}
                className="shrink-0"
              />
              {seasonOptions.map((item) => (
                <FilterChip
                  key={item}
                  label={item}
                  active={season === item}
                  onClick={() => setSeason(item)}
                  className="shrink-0"
                />
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge>{season === "all" ? `${visibleSpots.length}件を表示中` : `${season}におすすめの絶景 ${visibleSpots.length}件`}</Badge>
              {selectedTags.map((tag) => (
                <Badge key={tag}>#{getTagLabel(tag)}</Badge>
              ))}
            </div>
          </div>

          <div className="mb-5 flex gap-2 overflow-x-auto pb-2 xl:hidden">
            {popularMobileFilters().map((item) => (
              <FilterChip
                key={item}
                label={item}
                active={selectedTags.includes(normalizeTagFilter(item)) || season === item || style === item || time === item}
                onClick={() => {
                  if (seasonOptions.includes(item)) setSeason(season === item ? "all" : item);
                  else if (timeOptions.includes(item)) setTime(time === item ? "all" : item);
                  else if (travelStyleOptions.includes(item)) setStyle(style === item ? "all" : item);
                  else toggleTag(normalizeTagFilter(item));
                }}
                className="shrink-0"
              />
            ))}
          </div>

          <div className="grid gap-5 xl:grid-cols-[300px_minmax(0,1fr)_360px]">
            <GlassPanel className="hidden xl:block xl:sticky xl:top-28 xl:h-[calc(100vh-8rem)] xl:overflow-y-auto">
              <div className="space-y-6 p-5">
                <div className="flex items-center justify-between">
                  <h2 className="flex items-center gap-2 text-lg font-semibold">
                    <SlidersHorizontal className="h-5 w-5 text-cyan-100" />
                    Filters
                  </h2>
                  <Badge>{activeFilterCount} active</Badge>
                </div>

                <FilterGroup title="絶景タイプ">
                  <div className="flex flex-wrap gap-2">
                    {scenicTypeFilters.map((tag) => (
                      <FilterChip
                        key={tag.value}
                        label={tag.label}
                        active={selectedTags.includes(tag.value)}
                        onClick={() => toggleTag(tag.value)}
                      />
                    ))}
                  </div>
                </FilterGroup>

                <FilterGroup title="季節レイヤー">
                  <ChipRow value={season} options={seasonOptions} onChange={(value) => setSeason(value)} />
                </FilterGroup>

                <FilterGroup title="時間帯">
                  <ChipRow value={time} options={timeOptions} onChange={(value) => setTime(value)} />
                </FilterGroup>

                <FilterGroup title="旅行スタイル">
                  <ChipRow value={style} options={travelStyleOptions} onChange={(value) => setStyle(value)} />
                </FilterGroup>

                <FilterGroup title="国内 / 海外">
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      ["all", "すべて"],
                      ["domestic", "国内"],
                      ["overseas", "海外"]
                    ].map(([value, label]) => (
                      <FilterChip
                        key={value}
                        label={label}
                        active={scope === value}
                        onClick={() => setScope(value as ScopeFilter)}
                      />
                    ))}
                  </div>
                </FilterGroup>

                <FilterGroup title="難易度">
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      ["all", "すべて"],
                      ["easy", "気軽"],
                      ["normal", "標準"],
                      ["hard", "上級"]
                    ].map(([value, label]) => (
                      <FilterChip
                        key={value}
                        label={label}
                        active={difficulty === value}
                        onClick={() => setDifficulty(value as DifficultyFilter)}
                      />
                    ))}
                  </div>
                </FilterGroup>
              </div>
            </GlassPanel>

            <div className="space-y-5">
              <div className="flex flex-col gap-3 rounded-[28px] border border-white/[0.12] bg-white/[0.06] p-4 backdrop-blur-2xl md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="flex items-center gap-2 text-sm text-cyan-100">
                    <Filter className="h-4 w-4" />
                    {visibleSpots.length}件を表示中
                    <span className="text-slate-500">/ フィルター一致 {filteredSpots.length}件</span>
                  </p>
                  <p className="mt-1 text-xs text-slate-400">
                    地図はドラッグ・ズームできます。ピンをクリックすると詳細が切り替わります。
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge>{modeOptions.find((item) => item.value === mode)?.label}</Badge>
                  {selectedTags.slice(0, 4).map((tag) => (
                    <Badge key={tag}>#{getTagLabel(tag)}</Badge>
                  ))}
                  {season !== "all" ? <Badge>{season}</Badge> : null}
                  {time !== "all" ? <Badge>{time}</Badge> : null}
                  {style !== "all" ? <Badge>{style}</Badge> : null}
                </div>
              </div>

              <TravelMap
                spots={visibleSpots}
                selectedSpotId={selectedSpot?.id}
                onSelect={(spot) => setSelectedSpotId(spot.id)}
                onReset={resetFilters}
                mode={mode}
                season={season}
                selectedTags={selectedTags}
              />

              <div className="grid gap-4 sm:grid-cols-2 2xl:grid-cols-3">
                {visibleSpots.map((spot) => (
                  <SpotCard
                    key={spot.id}
                    spot={spot}
                    compact
                    selected={selectedSpotId === spot.id}
                    onSelect={() => setSelectedSpotId(spot.id)}
                  />
                ))}
              </div>
            </div>

            <GlassPanel className="xl:sticky xl:top-28 xl:h-[calc(100vh-8rem)] xl:overflow-y-auto">
              {selectedSpot ? (
                <div className="p-5">
                  <Badge className="mb-4 border-cyan-200/40 bg-cyan-200/[0.12] text-cyan-50">
                    選択中
                  </Badge>
                  <div className="relative overflow-hidden rounded-[24px]">
                    <img src={selectedSpot.image} alt={selectedSpot.name} className="h-64 w-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/86 via-slate-950/20 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <p className="flex items-center gap-1.5 text-xs text-cyan-100">
                        <MapPin className="h-3.5 w-3.5" />
                        {selectedSpot.region} / {selectedSpot.country}
                      </p>
                      <h2 className="mt-2 text-3xl font-semibold">{selectedSpot.name}</h2>
                    </div>
                  </div>

                  <p className="mt-5 leading-7 text-slate-300">{selectedSpot.description}</p>

                  <div className="mt-5 flex flex-wrap gap-2">
                    {selectedSpot.tags.map((tag) => (
                      <Badge key={tag}>#{getTagLabel(tag)}</Badge>
                    ))}
                  </div>

                  <div className="mt-6 grid grid-cols-2 gap-3 text-sm">
                    <InfoCard label="Best Season" value={selectedSpot.bestSeason.join(" / ")} />
                    <InfoCard label="Best Time" value={selectedSpot.bestTime.join(" / ")} icon={<Clock className="h-4 w-4" />} />
                    <InfoCard label="Difficulty" value={difficultyLabel(selectedSpot.difficulty)} />
                    <InfoCard label="Photo Score" value={`${selectedSpot.photoScore}/100`} icon={<Camera className="h-4 w-4" />} />
                    <InfoCard label="Budget" value={budgetLabel(selectedSpot.budgetLevel)} icon={<Wallet className="h-4 w-4" />} />
                    <InfoCard label="Duration" value={selectedSpot.duration} />
                  </div>

                  <div className="mt-6 grid gap-3">
                    <WishlistButton spotId={selectedSpot.id} className="w-full" />
                    <Link href={`/spots/${selectedSpot.id}`} className={buttonVariants({ variant: "primary", size: "md", className: "w-full" })}>
                      詳細を見る
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                    <Link
                      href={`/ai-planner?prompt=${encodeURIComponent(`${selectedSpot.name}を中心に旅程を作る`)}`}
                      className={buttonVariants({ variant: "outline", size: "md", className: "w-full" })}
                    >
                      <Sparkles className="h-4 w-4" />
                      AIに旅程を相談
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center text-slate-400">
                  <Bot className="mx-auto mb-3 h-8 w-8 text-cyan-100" />
                  条件に合うスポットがありません。
                </div>
              )}
            </GlassPanel>
          </div>
        </div>
      </section>
    </main>
  );
}

function popularMobileFilters() {
  return [
    "星空",
    "海",
    "夕日",
    "離島",
    "紅葉",
    "雪",
    "夏",
    "冬",
    "夜",
    "カップル旅",
    "ドライブ旅",
    "海外旅行"
  ];
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

function ChipRow({
  value,
  options,
  onChange
}: {
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      <FilterChip label="すべて" active={value === "all"} onClick={() => onChange("all")} />
      {options.map((item) => (
        <FilterChip key={item} label={item} active={value === item} onClick={() => onChange(item)} />
      ))}
    </div>
  );
}

function InfoCard({ label, value, icon }: { label: string; value: string; icon?: ReactNode }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.055] p-4">
      <p className="flex items-center gap-1.5 text-xs text-slate-400">
        {icon}
        {label}
      </p>
      <p className="mt-1 font-medium text-white">{value}</p>
    </div>
  );
}

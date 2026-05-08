"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Bot,
  Camera,
  Filter,
  MapPin,
  RotateCcw,
  Search,
  SlidersHorizontal,
  Sparkles
} from "lucide-react";
import {
  allTags,
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
import { MockMap } from "@/components/mock-map";
import { SpotCard } from "@/components/spot-card";
import { WishlistButton } from "@/components/wishlist-button";
import { budgetLabel, difficultyLabel, isDomestic, normalizeText } from "@/lib/utils";

type ScopeFilter = "all" | "domestic" | "overseas";
type DifficultyFilter = "all" | Spot["difficulty"];

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

type MapExplorerProps = {
  initialSearch?: string;
  initialTag?: string;
  initialStyle?: string;
  initialSeason?: string;
  initialTime?: string;
  initialScope?: string;
  initialDifficulty?: string;
};

function validOrAll(value: string | undefined, options: string[]) {
  return value && options.includes(value) ? value : "all";
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
  const [selectedTags, setSelectedTags] = useState<string[]>(initialTag ? [initialTag] : []);
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

  useEffect(() => {
    if (filteredSpots.length === 0) return;
    if (!filteredSpots.some((spot) => spot.id === selectedSpotId)) {
      setSelectedSpotId(filteredSpots[0].id);
    }
  }, [filteredSpots, selectedSpotId]);

  const selectedSpot = filteredSpots.find((spot) => spot.id === selectedSpotId) ?? filteredSpots[0];

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
    setSelectedSpotId(spots[0].id);
  };

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  const aiPrompt = encodeURIComponent(
    [
      keyword ? `キーワード:${keyword}` : "",
      selectedTags.length ? `タグ:${selectedTags.join("、")}` : "",
      season !== "all" ? `季節:${season}` : "",
      time !== "all" ? `時間:${time}` : "",
      style !== "all" ? `スタイル:${style}` : "",
      scope !== "all" ? `範囲:${scope === "domestic" ? "国内" : "海外"}` : "",
      difficulty !== "all" ? `難易度:${difficultyLabel(difficulty)}` : ""
    ]
      .filter(Boolean)
      .join(" / ")
  );

  return (
    <main className="min-h-screen bg-atlas-ink text-white">
      <section className="relative overflow-hidden px-5 pb-10 pt-32 md:px-8">
        <div className="absolute inset-0 bg-night-rim" />
        <div className="absolute inset-0 bg-atlas-grid bg-[length:72px_72px] opacity-35" />
        <div className="relative mx-auto max-w-7xl">
          <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
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
              className={buttonVariants({ variant: "primary", size: "lg" })}
            >
              <Sparkles className="h-5 w-5" />
              AIにこの条件で聞く
            </Link>
          </div>

          <form
            onSubmit={handleSearch}
            className="mb-5 flex flex-col gap-3 rounded-[28px] border border-white/[0.12] bg-white/[0.07] p-3 shadow-glass backdrop-blur-2xl md:flex-row md:items-center"
          >
            <label className="flex h-14 min-h-14 flex-1 items-center gap-3 rounded-2xl bg-slate-950/50 px-4">
              <Search className="h-5 w-5 text-cyan-100" />
              <input
                value={keyword}
                onChange={(event) => setKeyword(event.target.value)}
                placeholder="星空、海、紅葉、車なし、週末旅..."
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

          <div className="mb-5 flex gap-2 overflow-x-auto pb-2 xl:hidden">
            {[...allTags.slice(0, 12), ...seasonOptions, ...travelStyleOptions.slice(0, 4)].map((item) => (
              <FilterChip
                key={item}
                label={item}
                active={
                  selectedTags.includes(item) ||
                  season === item ||
                  style === item
                }
                onClick={() => {
                  if (seasonOptions.includes(item)) setSeason(season === item ? "all" : item);
                  else if (travelStyleOptions.includes(item)) setStyle(style === item ? "all" : item);
                  else toggleTag(item);
                }}
                className="shrink-0"
              />
            ))}
          </div>

          <div className="grid gap-5 xl:grid-cols-[300px_minmax(0,1fr)_360px]">
            <GlassPanel className="xl:sticky xl:top-28 xl:h-[calc(100vh-8rem)] xl:overflow-y-auto">
              <div className="space-y-6 p-5">
                <div className="flex items-center justify-between">
                  <h2 className="flex items-center gap-2 text-lg font-semibold">
                    <SlidersHorizontal className="h-5 w-5 text-cyan-100" />
                    Filters
                  </h2>
                  <Button variant="ghost" size="sm" onClick={resetFilters}>
                    <RotateCcw className="h-4 w-4" />
                    Reset
                  </Button>
                </div>

                <label className="flex h-12 items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.06] px-4">
                  <Search className="h-4 w-4 text-cyan-100" />
                  <input
                    value={keyword}
                    onChange={(event) => setKeyword(event.target.value)}
                    placeholder="地名・タグ・気分"
                    className="w-full bg-transparent text-sm outline-none placeholder:text-slate-500"
                  />
                </label>

                <FilterGroup title="タグ">
                  <div className="flex flex-wrap gap-2">
                    {allTags.map((tag) => (
                      <FilterChip
                        key={tag}
                        label={tag}
                        active={selectedTags.includes(tag)}
                        onClick={() => toggleTag(tag)}
                      />
                    ))}
                  </div>
                </FilterGroup>

                <FilterGroup title="季節">
                  <div className="flex flex-wrap gap-2">
                    <FilterChip label="すべて" active={season === "all"} onClick={() => setSeason("all")} />
                    {seasonOptions.map((item) => (
                      <FilterChip key={item} label={item} active={season === item} onClick={() => setSeason(item)} />
                    ))}
                  </div>
                </FilterGroup>

                <FilterGroup title="時間帯">
                  <div className="flex flex-wrap gap-2">
                    <FilterChip label="すべて" active={time === "all"} onClick={() => setTime("all")} />
                    {timeOptions.map((item) => (
                      <FilterChip key={item} label={item} active={time === item} onClick={() => setTime(item)} />
                    ))}
                  </div>
                </FilterGroup>

                <FilterGroup title="旅行スタイル">
                  <div className="flex flex-wrap gap-2">
                    <FilterChip label="すべて" active={style === "all"} onClick={() => setStyle("all")} />
                    {travelStyleOptions.map((item) => (
                      <FilterChip key={item} label={item} active={style === item} onClick={() => setStyle(item)} />
                    ))}
                  </div>
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
                      ["hard", "冒険"]
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
                    {filteredSpots.length} spots matched
                  </p>
                  <p className="mt-1 text-xs text-slate-400">ピンまたはカードを選ぶと詳細が更新されます。</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedTags.map((tag) => (
                    <Badge key={tag}>#{tag}</Badge>
                  ))}
                  {season !== "all" ? <Badge>{season}</Badge> : null}
                  {time !== "all" ? <Badge>{time}</Badge> : null}
                  {style !== "all" ? <Badge>{style}</Badge> : null}
                </div>
              </div>

              <MockMap
                spots={filteredSpots}
                selectedSpotId={selectedSpot?.id}
                onSelect={(spot) => setSelectedSpotId(spot.id)}
                dense
              />

              <div className="grid gap-5 md:grid-cols-2 2xl:grid-cols-3">
                {filteredSpots.map((spot) => (
                  <SpotCard
                    key={spot.id}
                    spot={spot}
                    compact
                    selected={selectedSpotId === spot.id}
                    onSelect={() => setSelectedSpotId(spot.id)}
                  />
                ))}
              </div>

              {filteredSpots.length === 0 ? (
                <GlassPanel className="p-8 text-center">
                  <Bot className="mx-auto h-10 w-10 text-cyan-100" />
                  <h3 className="mt-4 text-2xl font-semibold">条件に合う絶景が見つかりませんでした。</h3>
                  <p className="mt-3 text-slate-400">タグを少し外すか、AI提案ページで近い候補を生成できます。</p>
                  <Button variant="primary" className="mt-6" onClick={resetFilters}>
                    条件をリセット
                  </Button>
                </GlassPanel>
              ) : null}
            </div>

            <GlassPanel className="xl:sticky xl:top-28 xl:h-[calc(100vh-8rem)] xl:overflow-y-auto">
              {selectedSpot ? (
                <div className="p-5">
                  <div className="relative overflow-hidden rounded-[24px]">
                    <img
                      src={selectedSpot.image}
                      alt={selectedSpot.name}
                      className="h-64 w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent" />
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
                      <Badge key={tag}>#{tag}</Badge>
                    ))}
                  </div>

                  <div className="mt-6 grid grid-cols-2 gap-3 text-sm">
                    <InfoCard label="Best Season" value={selectedSpot.bestSeason.join(" / ")} />
                    <InfoCard label="Best Time" value={selectedSpot.bestTime.join(" / ")} />
                    <InfoCard label="Difficulty" value={difficultyLabel(selectedSpot.difficulty)} />
                    <InfoCard label="Photo Score" value={`${selectedSpot.photoScore}/100`} icon={<Camera className="h-4 w-4" />} />
                    <InfoCard label="Budget" value={budgetLabel(selectedSpot.budgetLevel)} />
                    <InfoCard label="Duration" value={selectedSpot.duration} />
                  </div>

                  <div className="mt-6 space-y-3">
                    {selectedSpot.highlights.map((highlight) => (
                      <div key={highlight} className="rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 text-sm text-slate-200">
                        {highlight}
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 flex gap-3">
                    <WishlistButton spotId={selectedSpot.id} className="flex-1" />
                    <Link
                      href={`/spots/${selectedSpot.id}`}
                      className={buttonVariants({ variant: "primary", size: "md", className: "flex-1" })}
                    >
                      詳細
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center text-slate-400">スポットを選択してください。</div>
              )}
            </GlassPanel>
          </div>
        </div>
      </section>
    </main>
  );
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h3 className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
        {title}
      </h3>
      {children}
    </section>
  );
}

function InfoCard({
  label,
  value,
  icon
}: {
  label: string;
  value: string;
  icon?: React.ReactNode;
}) {
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

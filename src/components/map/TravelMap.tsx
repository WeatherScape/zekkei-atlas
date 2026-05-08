"use client";

import { useMemo, useState } from "react";
import { Compass, MapPin, Navigation, Radar, Route, Sparkles } from "lucide-react";
import { Spot } from "@/data/spots";
import { cn } from "@/lib/utils";
import {
  buildDensityGroups,
  getRelatedTrailSpots,
  projectSpotToMap,
  spreadClusterPoint
} from "@/lib/projectToMap";
import { ShareShowcaseCard } from "@/components/map/ShareShowcaseCard";
import { MapEmptyState } from "@/components/map/MapEmptyState";

export function TravelMap({
  spots,
  selectedSpotId,
  onSelect,
  onReset,
  className
}: {
  spots: Spot[];
  selectedSpotId?: string;
  onSelect: (spot: Spot) => void;
  onReset: () => void;
  className?: string;
}) {
  const [hoveredSpotId, setHoveredSpotId] = useState<string | null>(null);
  const selectedSpot = spots.find((spot) => spot.id === selectedSpotId) ?? spots[0];

  const projectedGroups = useMemo(() => {
    const points = spots.map(projectSpotToMap);
    return buildDensityGroups(points, 7.4);
  }, [spots]);

  const displayPoints = useMemo(() => {
    return projectedGroups.flatMap((group) =>
      group.points.map((point, index) =>
        spreadClusterPoint(point, group.points, index, point.id === selectedSpotId)
      )
    );
  }, [projectedGroups, selectedSpotId]);

  const trailPoints = useMemo(() => {
    if (!selectedSpot) return [];
    const related = getRelatedTrailSpots(selectedSpot, spots);
    return related
      .map((spot) => displayPoints.find((point) => point.id === spot.id))
      .filter((point): point is (typeof displayPoints)[number] => Boolean(point));
  }, [displayPoints, selectedSpot, spots]);

  const selectedPoint = displayPoints.find((point) => point.id === selectedSpot?.id);

  return (
    <section
      className={cn(
        "relative min-h-[430px] overflow-hidden rounded-[34px] border border-white/[0.12] bg-[#04111f] shadow-glass md:min-h-[620px]",
        className
      )}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(103,232,249,0.22),transparent_27%),radial-gradient(circle_at_78%_38%,rgba(59,130,246,0.16),transparent_24%),radial-gradient(circle_at_58%_86%,rgba(20,184,166,0.14),transparent_28%),linear-gradient(130deg,#03111e_0%,#061629_45%,#020617_100%)]" />
      <div className="absolute inset-0 bg-atlas-grid bg-[length:56px_56px] opacity-25" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(2,6,23,.76),transparent_18%,transparent_82%,rgba(2,6,23,.72)),linear-gradient(180deg,rgba(2,6,23,.12),transparent_52%,rgba(2,6,23,.72))]" />

      <svg
        className="pointer-events-none absolute inset-0 h-full w-full opacity-80"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="landGlow" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor="rgba(103,232,249,.22)" />
            <stop offset="100%" stopColor="rgba(15,23,42,.10)" />
          </linearGradient>
          <filter id="softBlur">
            <feGaussianBlur stdDeviation="0.35" />
          </filter>
        </defs>
        <path
          d="M4 44 C12 36 21 37 27 41 C35 47 39 42 45 45 C52 49 60 52 67 47 C74 43 82 45 96 38 L96 100 L4 100 Z"
          fill="rgba(15,23,42,.34)"
        />
        <path
          d="M74 25 C78 19 86 18 92 24 C96 30 94 40 87 44 C81 48 73 43 71 36 C70 31 71 28 74 25 Z"
          fill="url(#landGlow)"
          stroke="rgba(148,163,184,.18)"
          strokeWidth=".18"
        />
        <path
          d="M86 33 C88 36 87 41 84 44 C82 46 80 48 78 52 C77 55 74 56 72 53 C70 50 72 47 74 45 C78 41 80 37 81 33 C82 30 84 30 86 33 Z"
          fill="rgba(103,232,249,.08)"
          stroke="rgba(103,232,249,.24)"
          strokeWidth=".16"
        />
        <path
          d="M57 23 C61 20 66 22 68 26 C70 30 69 34 65 37 C61 40 55 37 54 32 C53 28 54 25 57 23 Z"
          fill="rgba(148,163,184,.08)"
          stroke="rgba(103,232,249,.20)"
          strokeWidth=".14"
        />
        <path
          d="M16 31 C23 26 33 28 39 34 C44 39 44 46 39 51 C32 58 20 55 13 49 C7 44 8 36 16 31 Z"
          fill="rgba(103,232,249,.07)"
          stroke="rgba(103,232,249,.18)"
          strokeWidth=".16"
        />
        <path
          d="M48 54 C53 51 59 53 63 58 C66 62 64 68 59 72 C53 76 45 74 41 68 C38 63 42 57 48 54 Z"
          fill="rgba(20,184,166,.08)"
          stroke="rgba(45,212,191,.18)"
          strokeWidth=".15"
        />
        <path
          d="M8 22 C20 14 31 17 42 25 S66 31 88 17"
          fill="none"
          stroke="rgba(103,232,249,.18)"
          strokeDasharray="1.5 2.2"
          strokeWidth=".18"
        />
        <path
          d="M9 72 C25 60 42 64 55 58 S79 49 94 61"
          fill="none"
          stroke="rgba(45,212,191,.16)"
          strokeDasharray="1.2 2"
          strokeWidth=".16"
        />
        <circle cx="83" cy="37" r="18" fill="rgba(103,232,249,.035)" stroke="rgba(103,232,249,.14)" strokeWidth=".18" filter="url(#softBlur)" />
        <circle cx="25" cy="43" r="17" fill="rgba(59,130,246,.035)" stroke="rgba(148,163,184,.12)" strokeWidth=".18" filter="url(#softBlur)" />
      </svg>

      {selectedPoint ? (
        <svg
          className="pointer-events-none absolute inset-0 z-10 h-full w-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          {trailPoints.map((point) => (
            <path
              key={point.id}
              d={`M ${selectedPoint.x} ${selectedPoint.y} C ${(selectedPoint.x + point.x) / 2} ${selectedPoint.y - 8}, ${(selectedPoint.x + point.x) / 2} ${point.y + 7}, ${point.x} ${point.y}`}
              fill="none"
              stroke="rgba(103,232,249,.42)"
              strokeDasharray="1.1 1.4"
              strokeLinecap="round"
              strokeWidth=".34"
            />
          ))}
        </svg>
      ) : null}

      <div className="absolute left-4 top-4 z-30 flex flex-col gap-3 md:left-6 md:top-6">
        <div className="w-fit rounded-[24px] border border-white/[0.12] bg-slate-950/[0.62] px-4 py-3 shadow-glass backdrop-blur-2xl">
          <p className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-cyan-100/70">
            <Compass className="h-4 w-4" />
            Cinematic Geo Atlas
          </p>
          <h2 className="mt-2 max-w-[280px] text-2xl font-semibold leading-tight text-white md:text-3xl">
            {selectedSpot?.name ?? "Map Discovery"}
          </h2>
          <p className="mt-1 text-sm text-slate-300">
            {selectedSpot
              ? `${selectedSpot.region} / ${selectedSpot.bestSeason.join("・")}`
              : `${spots.length} spots matched`}
          </p>
        </div>
        <div className="hidden w-fit items-center gap-2 rounded-full border border-cyan-200/20 bg-cyan-200/[0.10] px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-cyan-50 backdrop-blur-xl sm:flex">
          <Radar className="h-4 w-4" />
          Density + Spotlight
        </div>
      </div>

      {projectedGroups.map((group) => {
        if (group.points.length < 3) return null;
        return (
          <button
            key={group.points.map((point) => point.id).join("-")}
            type="button"
            onClick={() => onSelect(group.points[0].spot)}
            className="absolute z-20 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-cyan-100/30 bg-cyan-200/[0.10] text-xs font-semibold text-cyan-50 shadow-[0_0_42px_rgba(103,232,249,.20)] backdrop-blur-md transition hover:scale-105 hover:bg-cyan-200/[0.18]"
            style={{ left: `${group.center.x}%`, top: `${group.center.y}%` }}
            aria-label={`${group.points.length}件の絶景クラスタ`}
          >
            <span className="absolute inset-[-9px] rounded-full border border-cyan-200/10" />
            {group.points.length}
          </button>
        );
      })}

      {displayPoints.map((point, index) => {
        const active = point.id === selectedSpotId;
        const hovered = point.id === hoveredSpotId;
        return (
          <button
            key={point.id}
            type="button"
            onClick={() => onSelect(point.spot)}
            onMouseEnter={() => setHoveredSpotId(point.id)}
            onMouseLeave={() => setHoveredSpotId(null)}
            className={cn(
              "absolute z-30 -translate-x-1/2 -translate-y-1/2 rounded-full transition duration-300",
              active ? "scale-110" : "hover:scale-110"
            )}
            style={{ left: `${point.x}%`, top: `${point.y}%` }}
            aria-label={`${point.spot.name}を選択`}
          >
            <span
              className={cn(
                "absolute inset-[-14px] rounded-full border transition duration-300",
                active
                  ? "border-cyan-100/70 bg-cyan-200/[0.12] shadow-[0_0_52px_rgba(103,232,249,.55)]"
                  : "border-white/10 bg-white/[0.02] shadow-[0_0_22px_rgba(103,232,249,.12)]"
              )}
            />
            <span
              className={cn(
                "relative flex h-10 w-10 items-center justify-center rounded-full border text-slate-950 shadow-glass",
                active
                  ? "border-white bg-cyan-100"
                  : "border-white/25 bg-slate-950/80 text-cyan-100 backdrop-blur-xl"
              )}
            >
              <MapPin className={cn("h-4 w-4", active ? "fill-slate-950/20" : "")} />
            </span>
            <span
              className={cn(
                "absolute -right-2 -top-3 flex h-6 min-w-6 items-center justify-center rounded-full border border-white bg-cyan-100 px-1.5 text-[10px] font-bold text-slate-950 shadow-glass",
                active ? "opacity-100" : "opacity-90"
              )}
            >
              {index + 1}
            </span>
            <span
              className={cn(
                "pointer-events-none absolute left-1/2 top-[calc(100%+12px)] max-w-[170px] -translate-x-1/2 whitespace-nowrap rounded-full border border-white/[0.12] bg-slate-950/[0.86] px-3 py-1.5 text-xs font-semibold text-white shadow-glass backdrop-blur-xl transition",
                active || hovered ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0"
              )}
            >
              {point.spot.name}
            </span>
          </button>
        );
      })}

      <div className="pointer-events-none absolute bottom-4 right-5 z-20 hidden items-center gap-4 text-[10px] font-semibold uppercase tracking-[0.28em] text-cyan-100/45 md:flex">
        <span className="flex items-center gap-2">
          <Route className="h-4 w-4" />
          Scenic Trails
        </span>
        <span className="flex items-center gap-2">
          <Navigation className="h-4 w-4" />
          AI Layer
        </span>
      </div>

      {selectedSpot ? <ShareShowcaseCard spot={selectedSpot} /> : null}
      {spots.length === 0 ? <MapEmptyState onReset={onReset} /> : null}
    </section>
  );
}

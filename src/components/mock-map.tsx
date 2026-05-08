"use client";

import { MapPin, Navigation, Radar } from "lucide-react";
import { type Spot } from "@/data/spots";
import { cn } from "@/lib/utils";

type AtlasPoint = {
  x: number;
  y: number;
  zone: "Japan" | "Okinawa" | "World" | "North";
};

const atlasPositions: Record<string, AtlasPoint> = {
  iceland: { x: 14, y: 17, zone: "North" },
  lapland: { x: 25, y: 13, zone: "North" },
  banff: { x: 16, y: 39, zone: "World" },
  "grand-canyon": { x: 27, y: 61, zone: "World" },
  uyuni: { x: 36, y: 76, zone: "World" },
  santorini: { x: 44, y: 39, zone: "World" },
  cappadocia: { x: 53, y: 34, zone: "World" },
  biei: { x: 78, y: 18, zone: "Japan" },
  shirakawago: { x: 72, y: 36, zone: "Japan" },
  kamikochi: { x: 77, y: 40, zone: "Japan" },
  "fuji-five-lakes": { x: 83, y: 43, zone: "Japan" },
  "tottori-dunes": { x: 68, y: 48, zone: "Japan" },
  tsunoshima: { x: 63, y: 55, zone: "Japan" },
  shimanami: { x: 71, y: 58, zone: "Japan" },
  okunoshima: { x: 75, y: 62, zone: "Japan" },
  aso: { x: 64, y: 69, zone: "Japan" },
  yakushima: { x: 70, y: 78, zone: "Japan" },
  kouri: { x: 86, y: 63, zone: "Okinawa" },
  miyako: { x: 88, y: 72, zone: "Okinawa" },
  ishigaki: { x: 83, y: 76, zone: "Okinawa" },
  taketomi: { x: 79, y: 80, zone: "Okinawa" },
  hateruma: { x: 91, y: 83, zone: "Okinawa" }
};

function fallbackPosition(index: number, total: number): AtlasPoint {
  const angle = (index / Math.max(total, 1)) * Math.PI * 2 - Math.PI / 2;
  return {
    x: 50 + Math.cos(angle) * 34,
    y: 50 + Math.sin(angle) * 30,
    zone: "World"
  };
}

function positionForSpot(spot: Spot, index: number, total: number) {
  return atlasPositions[spot.id] ?? fallbackPosition(index, total);
}

const zoneLabels = [
  { label: "Northern Lights", className: "left-[8%] top-[8%]" },
  { label: "World Icons", className: "left-[13%] bottom-[17%]" },
  { label: "Japan Ridge", className: "right-[15%] top-[28%]" },
  { label: "Okinawa Blue", className: "right-[6%] bottom-[12%]" }
];

export function MockMap({
  spots,
  selectedSpotId,
  onSelect,
  className,
  dense
}: {
  spots: Spot[];
  selectedSpotId?: string;
  onSelect?: (spot: Spot) => void;
  className?: string;
  dense?: boolean;
}) {
  const selectedSpot = spots.find((spot) => spot.id === selectedSpotId);

  return (
    <div
      className={cn(
        "relative min-h-[440px] overflow-hidden rounded-[32px] border border-white/[0.12] bg-[#06111f] shadow-glass",
        dense ? "min-h-[560px]" : "",
        className
      )}
    >
      <div className="absolute inset-0 bg-atlas-grid bg-[length:54px_54px] opacity-35" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_34%,rgba(103,232,249,0.16),transparent_30%),radial-gradient(circle_at_22%_72%,rgba(34,197,94,0.11),transparent_28%),linear-gradient(115deg,rgba(14,116,144,0.24),transparent_34%,rgba(30,41,59,0.58)_68%,rgba(15,23,42,0.92))]" />

      <div className="absolute left-[7%] top-[12%] h-[24%] w-[30%] rounded-[45%] border border-cyan-200/20 bg-cyan-200/[0.025]" />
      <div className="absolute left-[11%] bottom-[12%] h-[30%] w-[34%] rounded-[48%] border border-emerald-200/20 bg-emerald-200/[0.025]" />
      <div className="absolute right-[9%] top-[14%] h-[50%] w-[27%] rounded-[42%] border border-blue-200/20 bg-blue-200/[0.03]" />
      <div className="absolute bottom-[7%] right-[4%] h-[32%] w-[22%] rounded-[45%] border border-cyan-200/20 bg-cyan-200/[0.025]" />

      <svg
        className="pointer-events-none absolute inset-0 h-full w-full opacity-60"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path d="M8 18 C25 8 38 18 49 28 S70 38 86 20" fill="none" stroke="rgba(103,232,249,.22)" strokeWidth=".28" />
        <path d="M9 73 C25 55 43 70 56 58 S76 48 93 62" fill="none" stroke="rgba(125,211,252,.18)" strokeWidth=".24" />
        <path d="M60 18 C72 26 72 42 64 56 S64 74 77 86" fill="none" stroke="rgba(45,212,191,.16)" strokeWidth=".22" />
        <path d="M73 18 L82 42 L74 63 L84 83" fill="none" stroke="rgba(255,255,255,.10)" strokeWidth=".18" strokeDasharray="1.4 1.4" />
        <path d="M42 34 L55 34 L68 48 L82 75" fill="none" stroke="rgba(255,255,255,.08)" strokeWidth=".18" strokeDasharray="1.2 1.3" />
      </svg>

      <div className="absolute left-0 right-0 top-1/2 h-px bg-cyan-100/[0.12]" />
      <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between text-[10px] font-semibold uppercase tracking-[0.28em] text-cyan-100/45">
        <span>Curated Atlas</span>
        <span className="rounded-full border border-cyan-200/25 bg-cyan-200/[0.10] px-3 py-1 text-cyan-50">
          Map v2
        </span>
        <span>AI Scenic Layer</span>
      </div>

      {zoneLabels.map((zone) => (
        <div
          key={zone.label}
          className={cn(
            "absolute hidden rounded-full border border-white/[0.10] bg-slate-950/45 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-cyan-100/55 backdrop-blur-md md:block",
            zone.className
          )}
        >
          {zone.label}
        </div>
      ))}

      {spots.length === 0 ? (
        <div className="absolute inset-0 flex items-center justify-center px-6 text-center">
          <div className="rounded-[28px] border border-white/[0.12] bg-slate-950/70 p-6 backdrop-blur-xl">
            <Radar className="mx-auto h-8 w-8 text-cyan-100" />
            <p className="mt-3 text-sm text-slate-300">条件に合うピンがありません。</p>
          </div>
        </div>
      ) : null}

      {spots.map((spot, index) => {
        const { x, y, zone } = positionForSpot(spot, index, spots.length);
        const active = selectedSpotId === spot.id;

        return (
          <button
            key={spot.id}
            type="button"
            onClick={() => onSelect?.(spot)}
            className={cn(
              "group absolute -translate-x-1/2 -translate-y-1/2 rounded-full transition duration-200",
              active ? "z-30" : "z-10 hover:z-20"
            )}
            style={{ left: `${x}%`, top: `${y}%` }}
            aria-label={`${spot.name}を選択`}
          >
            <span
              className={cn(
                "absolute inset-0 -m-3 rounded-full transition",
                active
                  ? "animate-pulse bg-cyan-200/30 ring-2 ring-cyan-200/45"
                  : "bg-transparent group-hover:bg-cyan-200/15"
              )}
            />
            <span
              className={cn(
                "relative flex h-10 w-10 items-center justify-center rounded-full border shadow-glass transition",
                active
                  ? "border-white bg-cyan-200 text-slate-950"
                  : "border-white/25 bg-slate-950/78 text-cyan-100 group-hover:border-cyan-200 group-hover:bg-cyan-200 group-hover:text-slate-950"
              )}
            >
              <MapPin className={cn("h-5 w-5", active ? "fill-slate-950/20" : "")} />
              <span
                className={cn(
                  "absolute -right-2 -top-2 min-w-[1.25rem] rounded-full px-1.5 py-0.5 text-center text-[10px] font-bold",
                  active ? "bg-slate-950 text-white" : "bg-cyan-200 text-slate-950"
                )}
              >
                {index + 1}
              </span>
            </span>
            <span
              className={cn(
                "pointer-events-none absolute left-1/2 top-12 w-max max-w-[160px] -translate-x-1/2 rounded-full border border-white/[0.12] bg-slate-950/90 px-3 py-1 text-xs font-medium text-white opacity-0 shadow-glass backdrop-blur-xl transition md:group-hover:opacity-100",
                active ? "opacity-100" : ""
              )}
            >
              {spot.name}
            </span>
            <span className="sr-only">{zone}</span>
          </button>
        );
      })}

      {selectedSpot ? (
        <div className="absolute left-4 top-4 max-w-[calc(100%-2rem)] rounded-[24px] border border-white/[0.12] bg-slate-950/70 p-4 shadow-glass backdrop-blur-xl sm:max-w-sm">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-cyan-200/30 bg-cyan-200/[0.12] text-cyan-100">
              <Navigation className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-cyan-100/65">
                Selected Pin
              </p>
              <h3 className="mt-1 text-lg font-semibold text-white">{selectedSpot.name}</h3>
              <p className="mt-1 text-xs leading-5 text-slate-300">
                {selectedSpot.region} / {selectedSpot.bestSeason.join("・")}
              </p>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

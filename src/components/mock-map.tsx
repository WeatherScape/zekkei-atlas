"use client";

import { Compass, MapPin, Navigation, Radar } from "lucide-react";
import { type Spot } from "@/data/spots";
import { cn } from "@/lib/utils";

type ZoneId = "islands" | "japan" | "world" | "north";

const spotZones: Record<string, ZoneId> = {
  ishigaki: "islands",
  hateruma: "islands",
  miyako: "islands",
  taketomi: "islands",
  kouri: "islands",
  tsunoshima: "japan",
  shimanami: "japan",
  okunoshima: "japan",
  "tottori-dunes": "japan",
  aso: "japan",
  kamikochi: "japan",
  shirakawago: "japan",
  biei: "north",
  "fuji-five-lakes": "japan",
  yakushima: "japan",
  uyuni: "world",
  iceland: "north",
  santorini: "world",
  cappadocia: "world",
  "grand-canyon": "world",
  lapland: "north",
  banff: "north"
};

const zones: Array<{
  id: ZoneId;
  title: string;
  subtitle: string;
  className: string;
}> = [
  {
    id: "islands",
    title: "Okinawa Blue",
    subtitle: "海・星空・離島",
    className: "border-cyan-200/20 bg-cyan-200/[0.055]"
  },
  {
    id: "japan",
    title: "Japan Ridge",
    subtitle: "山・湖・ドライブ",
    className: "border-emerald-200/20 bg-emerald-200/[0.045]"
  },
  {
    id: "world",
    title: "World Icons",
    subtitle: "一生に一度の海外絶景",
    className: "border-sky-200/20 bg-sky-200/[0.045]"
  },
  {
    id: "north",
    title: "Snow & Aurora",
    subtitle: "雪景色・オーロラ",
    className: "border-indigo-200/20 bg-indigo-200/[0.045]"
  }
];

function getZone(spot: Spot): ZoneId {
  return spotZones[spot.id] ?? (spot.country === "日本" ? "japan" : "world");
}

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
        "relative min-h-[460px] overflow-hidden rounded-[32px] border border-white/[0.12] bg-[#06111f] p-4 shadow-glass",
        dense ? "min-h-[620px]" : "",
        className
      )}
    >
      <div className="absolute inset-0 bg-atlas-grid bg-[length:44px_44px] opacity-30" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(103,232,249,0.16),transparent_28%),radial-gradient(circle_at_82%_76%,rgba(45,212,191,0.14),transparent_30%),linear-gradient(125deg,rgba(8,47,73,0.8),rgba(2,6,23,0.96)_48%,rgba(15,23,42,0.96))]" />
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full opacity-45"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path d="M7 26 C22 10 40 18 50 32 S74 45 91 20" fill="none" stroke="rgba(103,232,249,.22)" strokeWidth=".22" />
        <path d="M8 76 C26 56 39 73 55 58 S75 47 92 65" fill="none" stroke="rgba(45,212,191,.20)" strokeWidth=".2" />
        <path d="M16 16 L84 84" fill="none" stroke="rgba(255,255,255,.08)" strokeWidth=".16" strokeDasharray="1.4 1.8" />
        <path d="M84 16 L16 84" fill="none" stroke="rgba(255,255,255,.06)" strokeWidth=".16" strokeDasharray="1.2 1.9" />
      </svg>

      <div className="relative z-10 flex h-full min-h-[inherit] flex-col gap-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="rounded-[24px] border border-white/[0.12] bg-slate-950/60 p-4 backdrop-blur-xl">
            <p className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-cyan-100/65">
              <Compass className="h-4 w-4" />
              Scenic Atlas Map
            </p>
            <h3 className="mt-2 text-xl font-semibold text-white">
              {selectedSpot ? selectedSpot.name : "Map Discovery"}
            </h3>
            <p className="mt-1 text-sm text-slate-300">
              {selectedSpot
                ? `${selectedSpot.region} / ${selectedSpot.bestSeason.join("・")}`
                : `${spots.length} spots matched`}
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-cyan-200/25 bg-cyan-200/[0.10] px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-cyan-50 backdrop-blur-xl">
            <Radar className="h-4 w-4" />
            Map v3
          </div>
        </div>

        {spots.length === 0 ? (
          <div className="flex flex-1 items-center justify-center rounded-[28px] border border-white/[0.12] bg-slate-950/[0.55] p-8 text-center backdrop-blur-xl">
            <div>
              <Radar className="mx-auto h-9 w-9 text-cyan-100" />
              <p className="mt-4 text-sm text-slate-300">条件に合うピンがありません。</p>
            </div>
          </div>
        ) : (
          <div className="grid flex-1 gap-3 md:grid-cols-2">
            {zones.map((zone) => {
              const zoneSpots = spots.filter((spot) => getZone(spot) === zone.id);
              return (
                <section
                  key={zone.id}
                  className={cn(
                    "min-h-[170px] rounded-[28px] border p-4 backdrop-blur-md",
                    zone.className,
                    zoneSpots.length === 0 ? "opacity-40" : ""
                  )}
                >
                  <div className="mb-4 flex items-start justify-between gap-3">
                    <div>
                      <h4 className="text-sm font-semibold uppercase tracking-[0.18em] text-white">
                        {zone.title}
                      </h4>
                      <p className="mt-1 text-xs text-slate-400">{zone.subtitle}</p>
                    </div>
                    <span className="rounded-full border border-white/[0.12] bg-slate-950/50 px-2.5 py-1 text-xs text-cyan-100">
                      {zoneSpots.length}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {zoneSpots.map((spot) => {
                      const originalIndex = spots.findIndex((item) => item.id === spot.id);
                      const active = selectedSpotId === spot.id;
                      return (
                        <button
                          key={spot.id}
                          type="button"
                          onClick={() => onSelect?.(spot)}
                          className={cn(
                            "group flex max-w-full items-center gap-2 rounded-full border px-2.5 py-2 text-left text-xs shadow-glass transition",
                            active
                              ? "border-white bg-cyan-200 text-slate-950"
                              : "border-white/[0.14] bg-slate-950/60 text-slate-100 hover:border-cyan-200/60 hover:bg-cyan-200/15"
                          )}
                          aria-label={`${spot.name}を選択`}
                        >
                          <span
                            className={cn(
                              "flex h-6 min-w-6 items-center justify-center rounded-full text-[10px] font-bold",
                              active ? "bg-slate-950 text-white" : "bg-cyan-200 text-slate-950"
                            )}
                          >
                            {originalIndex + 1}
                          </span>
                          <MapPin className={cn("h-3.5 w-3.5 shrink-0", active ? "fill-slate-950/20" : "")} />
                          <span className="truncate">{spot.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </section>
              );
            })}
          </div>
        )}

        <div className="flex items-center justify-between text-[10px] font-semibold uppercase tracking-[0.28em] text-cyan-100/45">
          <span>Curated Atlas</span>
          <span>AI Scenic Layer</span>
        </div>
      </div>

      {selectedSpot ? (
        <div className="pointer-events-none absolute bottom-12 right-4 hidden max-w-xs rounded-[22px] border border-white/[0.12] bg-slate-950/[0.78] p-4 shadow-glass backdrop-blur-xl lg:block">
          <p className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-cyan-100/65">
            <Navigation className="h-4 w-4" />
            Selected
          </p>
          <p className="mt-2 text-sm leading-6 text-slate-200">{selectedSpot.description}</p>
        </div>
      ) : null}
    </div>
  );
}

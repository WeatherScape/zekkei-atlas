"use client";

import { MapPin } from "lucide-react";
import { Spot } from "@/data/spots";
import { cn } from "@/lib/utils";

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function positionForSpot(spot: Spot) {
  const x = clamp(((spot.longitude + 180) / 360) * 100, 7, 93);
  const y = clamp(((72 - spot.latitude) / 142) * 100, 8, 92);
  return { x, y };
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
  return (
    <div
      className={cn(
        "relative min-h-[420px] overflow-hidden rounded-[32px] border border-white/[0.12] bg-[#06111f] shadow-glass",
        dense ? "min-h-[520px]" : "",
        className
      )}
    >
      <div className="absolute inset-0 bg-atlas-grid bg-[length:54px_54px] opacity-45" />
      <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(14,116,144,0.28),transparent_34%,rgba(30,41,59,0.55)_68%,rgba(15,23,42,0.9))]" />
      <div className="absolute left-[6%] top-[20%] h-[38%] w-[34%] rounded-[45%] border border-cyan-200/20 bg-cyan-200/[0.035]" />
      <div className="absolute right-[8%] top-[14%] h-[58%] w-[28%] rounded-[42%] border border-blue-200/20 bg-blue-200/[0.035]" />
      <div className="absolute bottom-[7%] left-[36%] h-[26%] w-[30%] rounded-[48%] border border-emerald-200/20 bg-emerald-200/[0.03]" />
      <div className="absolute left-0 right-0 top-1/2 h-px bg-cyan-100/[0.15]" />
      <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between text-[10px] font-semibold uppercase tracking-[0.28em] text-cyan-100/40">
        <span>Pacific Window</span>
        <span>AI Scenic Layer</span>
      </div>

      {spots.map((spot, index) => {
        const { x, y } = positionForSpot(spot);
        const active = selectedSpotId === spot.id;
        return (
          <button
            key={spot.id}
            type="button"
            onClick={() => onSelect?.(spot)}
            className={cn(
              "absolute -translate-x-1/2 -translate-y-1/2 rounded-full border transition duration-200",
              active
                ? "z-20 border-white bg-cyan-200 text-slate-950 shadow-glow"
                : "z-10 border-white/30 bg-slate-950/70 text-cyan-100 hover:border-cyan-200 hover:bg-cyan-200 hover:text-slate-950"
            )}
            style={{ left: `${x}%`, top: `${y}%` }}
            aria-label={`${spot.name}を選択`}
          >
            <span className="relative flex h-10 w-10 items-center justify-center rounded-full">
              <MapPin className={cn("h-5 w-5", active ? "fill-slate-950/20" : "")} />
              <span
                className={cn(
                  "absolute -right-2 -top-2 rounded-full px-1.5 py-0.5 text-[10px] font-bold",
                  active ? "bg-slate-950 text-white" : "bg-cyan-200 text-slate-950"
                )}
              >
                {index + 1}
              </span>
            </span>
            {active ? (
              <span className="absolute left-1/2 top-12 w-max -translate-x-1/2 rounded-full border border-white/[0.12] bg-slate-950/90 px-3 py-1 text-xs font-medium text-white shadow-glass backdrop-blur-xl">
                {spot.name}
              </span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}

"use client";

import dynamic from "next/dynamic";
import { Spot } from "@/data/spots";

export type MapViewMode = "all" | "japan" | "okinawa" | "overseas";

export type TravelMapProps = {
  spots: Spot[];
  selectedSpotId?: string;
  onSelect: (spot: Spot) => void;
  onReset: () => void;
  mode?: MapViewMode;
  season?: string;
  selectedTags?: string[];
  addMode?: boolean;
  onPickLocation?: (location: { latitude: number; longitude: number }) => void;
  className?: string;
};

const LeafletTravelMap = dynamic(
  () => import("@/components/map/LeafletTravelMap").then((mod) => mod.LeafletTravelMap),
  {
    ssr: false,
    loading: () => (
      <div className="flex min-h-[380px] items-center justify-center rounded-[28px] border border-white/[0.12] bg-slate-950/70 text-sm text-slate-300 md:min-h-[560px]">
        地図を読み込み中...
      </div>
    )
  }
);

export function TravelMap(props: TravelMapProps) {
  return <LeafletTravelMap {...props} />;
}

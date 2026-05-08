"use client";

import { Spot } from "@/data/spots";
import { TravelMap } from "@/components/map/TravelMap";

export function MockMap({
  spots,
  selectedSpotId,
  onSelect,
  className
}: {
  spots: Spot[];
  selectedSpotId?: string;
  onSelect?: (spot: Spot) => void;
  className?: string;
  dense?: boolean;
}) {
  return (
    <TravelMap
      spots={spots}
      selectedSpotId={selectedSpotId}
      onSelect={(spot) => onSelect?.(spot)}
      onReset={() => onSelect?.(spots[0])}
      className={className}
    />
  );
}

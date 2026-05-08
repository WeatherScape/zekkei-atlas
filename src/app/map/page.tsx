import { Suspense } from "react";
import { MapExplorer } from "@/components/map-explorer";

export default function MapPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-atlas-ink" />}>
      <MapExplorer />
    </Suspense>
  );
}

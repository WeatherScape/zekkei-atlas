"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { MapPin, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Spot } from "@/data/spots";
import { cn } from "@/lib/utils";
import { type MapViewMode, type TravelMapProps } from "@/components/map/TravelMap";

type LeafletModule = typeof import("leaflet");
type LeafletMap = import("leaflet").Map;
type LeafletLayerGroup = import("leaflet").LayerGroup;
type LeafletMarker = import("leaflet").Marker;
type LeafletLatLngBoundsExpression = import("leaflet").LatLngBoundsExpression;

const modeLabels: Record<MapViewMode, string> = {
  all: "すべて",
  japan: "日本エリア",
  okinawa: "沖縄・離島",
  overseas: "海外エリア"
};

function getBoundsForSpots(spots: Spot[]): LeafletLatLngBoundsExpression | null {
  if (spots.length === 0) return null;
  return spots.map((spot) => [spot.latitude, spot.longitude] as [number, number]);
}

function getDefaultView(mode: MapViewMode): { center: [number, number]; zoom: number } {
  if (mode === "japan") return { center: [36.4, 137.8], zoom: 5 };
  if (mode === "okinawa") return { center: [25.0, 125.5], zoom: 7 };
  if (mode === "overseas") return { center: [32, -18], zoom: 2 };
  return { center: [28, 35], zoom: 2 };
}

function getSeasonLabel(season?: string) {
  return season && season !== "all" ? season : "すべての季節";
}

function getPinTone(photoScore: number) {
  if (photoScore >= 90) return "high";
  if (photoScore >= 80) return "mid";
  return "low";
}

function buildMarkerIcon(L: LeafletModule, selected: boolean, photoScore: number) {
  const tone = getPinTone(photoScore);
  const size = selected ? 36 : tone === "high" ? 28 : tone === "low" ? 20 : 24;

  return L.divIcon({
    className: "",
    html: `<span class="zekkei-map-pin zekkei-map-pin-${tone}${selected ? " zekkei-map-pin-selected" : ""}"><span></span></span>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2]
  });
}

function buildClusterIcon(L: LeafletModule, count: number) {
  return L.divIcon({
    className: "",
    html: `<span class="zekkei-map-cluster">${count}</span>`,
    iconSize: [42, 42],
    iconAnchor: [21, 21]
  });
}

function shouldCluster(map: LeafletMap, count: number) {
  const zoom = map.getZoom();
  if (count <= 1) return false;
  if (zoom >= 10) return false;
  if (count >= 4) return true;
  return zoom < 8;
}

function groupSpotsByScreenDistance(
  map: LeafletMap,
  spots: Spot[],
  selectedSpotId: string | undefined
) {
  const threshold = map.getZoom() >= 7 ? 48 : 58;
  const projected = spots.map((spot) => ({
    spot,
    point: map.latLngToLayerPoint([spot.latitude, spot.longitude])
  }));
  const used = new Set<string>();
  const groups: Array<{ spots: Spot[]; center: [number, number] }> = [];

  projected.forEach((item) => {
    if (used.has(item.spot.id)) return;
    const group = projected.filter((candidate) => {
      if (used.has(candidate.spot.id)) return false;
      const distance = item.point.distanceTo(candidate.point);
      return distance <= threshold;
    });
    group.forEach((candidate) => used.add(candidate.spot.id));
    const centerLat =
      group.reduce((sum, candidate) => sum + candidate.spot.latitude, 0) / group.length;
    const centerLng =
      group.reduce((sum, candidate) => sum + candidate.spot.longitude, 0) / group.length;
    const hasSelected = group.some((candidate) => candidate.spot.id === selectedSpotId);

    if (hasSelected && group.length > 1) {
      const selected = group.find((candidate) => candidate.spot.id === selectedSpotId);
      const rest = group.filter((candidate) => candidate.spot.id !== selectedSpotId);
      if (selected) groups.push({ spots: [selected.spot], center: [selected.spot.latitude, selected.spot.longitude] });
      if (rest.length) {
        groups.push({
          spots: rest.map((candidate) => candidate.spot),
          center: [
            rest.reduce((sum, candidate) => sum + candidate.spot.latitude, 0) / rest.length,
            rest.reduce((sum, candidate) => sum + candidate.spot.longitude, 0) / rest.length
          ]
        });
      }
      return;
    }

    groups.push({ spots: group.map((candidate) => candidate.spot), center: [centerLat, centerLng] });
  });

  return groups;
}

function distanceKm(a: Spot, b: Spot) {
  const earthRadius = 6371;
  const toRad = (value: number) => (value * Math.PI) / 180;
  const dLat = toRad(b.latitude - a.latitude);
  const dLng = toRad(b.longitude - a.longitude);
  const lat1 = toRad(a.latitude);
  const lat2 = toRad(b.latitude);
  const h =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
  return earthRadius * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}

function getRelatedRouteSpots(selectedSpot: Spot | undefined, spots: Spot[]) {
  if (!selectedSpot) return [];

  return spots
    .filter((spot) => spot.id !== selectedSpot.id)
    .map((spot) => {
      const sharedTags = spot.tags.filter((tag) => selectedSpot.tags.includes(tag)).length;
      const sameCountry = spot.country === selectedSpot.country ? 2 : 0;
      const sameRegion = spot.region === selectedSpot.region ? 2 : 0;
      const distance = distanceKm(selectedSpot, spot);
      const distanceScore = distance < 80 ? 4 : distance < 400 ? 3 : distance < 1500 ? 1 : 0;

      return {
        spot,
        score: sharedTags * 3 + sameCountry + sameRegion + distanceScore + spot.photoScore / 100
      };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((item) => item.spot);
}

export function LeafletTravelMap({
  spots,
  selectedSpotId,
  onSelect,
  onReset,
  mode = "all",
  season = "all",
  selectedTags = [],
  className
}: TravelMapProps) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const layerRef = useRef<LeafletLayerGroup | null>(null);
  const leafletRef = useRef<LeafletModule | null>(null);
  const markerRefs = useRef<Record<string, LeafletMarker>>({});
  const latestRef = useRef({ spots, selectedSpotId, mode, onSelect });
  const [ready, setReady] = useState(false);

  const selectedSpot = useMemo(
    () => spots.find((spot) => spot.id === selectedSpotId),
    [selectedSpotId, spots]
  );

  useEffect(() => {
    latestRef.current = { spots, selectedSpotId, mode, onSelect };
  }, [mode, onSelect, selectedSpotId, spots]);

  useEffect(() => {
    let cancelled = false;

    async function setupMap() {
      if (!mapContainerRef.current || mapRef.current) return;
      const L = await import("leaflet");
      if (cancelled || !mapContainerRef.current) return;

      leafletRef.current = L;
      const defaultView = getDefaultView(mode);
      const map = L.map(mapContainerRef.current, {
        zoomControl: true,
        scrollWheelZoom: true,
        worldCopyJump: true,
        minZoom: 2,
        maxZoom: 14
      }).setView(defaultView.center, defaultView.zoom);

      L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: "abcd",
        maxZoom: 19
      }).addTo(map);

      layerRef.current = L.layerGroup().addTo(map);
      mapRef.current = map;
      setReady(true);

      const rerender = () => renderMarkers();
      map.on("zoomend moveend", rerender);
      renderMarkers();
    }

    setupMap();

    return () => {
      cancelled = true;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    fitMapToMode();
  }, [mode, ready, spots]);

  useEffect(() => {
    renderMarkers();
  }, [ready, spots, selectedSpotId]);

  useEffect(() => {
    if (!ready || !selectedSpot || !mapRef.current) return;
    const map = mapRef.current;
    const targetZoom = Math.max(map.getZoom(), mode === "okinawa" ? 8 : 6);
    map.flyTo([selectedSpot.latitude, selectedSpot.longitude], targetZoom, {
      animate: true,
      duration: 0.65
    });
  }, [mode, ready, selectedSpot?.id]);

  function fitMapToMode() {
    const map = mapRef.current;
    if (!map) return;
    const defaultView = getDefaultView(mode);
    if (spots.length === 0) {
      map.setView(defaultView.center, defaultView.zoom);
      return;
    }
    const bounds = getBoundsForSpots(spots);
    if (!bounds) return;
    map.fitBounds(bounds, {
      padding: [42, 42],
      maxZoom: mode === "okinawa" ? 8 : mode === "japan" ? 6 : 5
    });
  }

  function renderMarkers() {
    const L = leafletRef.current;
    const map = mapRef.current;
    const layer = layerRef.current;
    if (!L || !map || !layer) return;

    layer.clearLayers();
    markerRefs.current = {};
    const current = latestRef.current;
    const currentSelectedSpot = current.spots.find((spot) => spot.id === current.selectedSpotId);
    const routeSpots = getRelatedRouteSpots(currentSelectedSpot, current.spots);

    if (currentSelectedSpot && routeSpots.length > 0) {
      routeSpots.forEach((routeSpot) => {
        const route: Array<[number, number]> = [
          [currentSelectedSpot.latitude, currentSelectedSpot.longitude],
          [routeSpot.latitude, routeSpot.longitude]
        ];

        L.polyline(
          route,
          {
            color: "#67e8f9",
            weight: 1.8,
            opacity: 0.34,
            dashArray: "7 9",
            interactive: false
          }
        ).addTo(layer);
      });
    }

    const groups = groupSpotsByScreenDistance(map, current.spots, current.selectedSpotId);

    groups.forEach((group) => {
      if (shouldCluster(map, group.spots.length)) {
        const marker = L.marker(group.center, {
          icon: buildClusterIcon(L, group.spots.length),
          keyboard: true
        });
        marker.bindTooltip(`${group.spots.length}件のスポット`, {
          direction: "top",
          offset: [0, -18],
          opacity: 0.95
        });
        marker.on("click", () => {
          const bounds = getBoundsForSpots(group.spots);
          if (bounds) {
            map.fitBounds(bounds, { padding: [64, 64], maxZoom: 11 });
          }
        });
        marker.addTo(layer);
        return;
      }

      group.spots.forEach((spot) => {
        const selected = spot.id === current.selectedSpotId;
        const marker = L.marker([spot.latitude, spot.longitude], {
          icon: buildMarkerIcon(L, selected, spot.photoScore),
          keyboard: true,
          zIndexOffset: selected ? 1000 : 0
        });
        marker.bindTooltip(spot.name, {
          direction: "top",
          offset: [0, selected ? -20 : -15],
          opacity: 0.96
        });
        marker.on("click", () => {
          current.onSelect(spot);
          map.flyTo([spot.latitude, spot.longitude], Math.max(map.getZoom(), 7), {
            animate: true,
            duration: 0.55
          });
        });
        marker.addTo(layer);
        markerRefs.current[spot.id] = marker;
      });
    });
  }

  return (
    <section
      className={cn(
        "relative min-h-[380px] overflow-hidden rounded-[28px] border border-white/[0.12] bg-slate-950 shadow-glass md:min-h-[620px]",
        className
      )}
    >
      <div ref={mapContainerRef} className="absolute inset-0 z-0" />

      <div className="pointer-events-none absolute left-3 top-3 z-[410] max-w-[calc(100%-1.5rem)] rounded-2xl border border-white/[0.14] bg-slate-950/82 px-4 py-3 shadow-glass backdrop-blur-xl md:left-4 md:top-4">
        <p className="text-xs font-semibold text-white md:text-sm">
          {modeLabels[mode]}
        </p>
        <p className="mt-1 text-xs text-cyan-100">
          {season !== "all" ? `${getSeasonLabel(season)}におすすめの絶景 ${spots.length}件` : `${spots.length}件のスポットを表示中`}
        </p>
        {selectedTags.length > 0 ? (
          <div className="mt-2 flex max-w-[260px] flex-wrap gap-1.5">
            {selectedTags.slice(0, 4).map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-cyan-200/30 bg-cyan-200/10 px-2 py-0.5 text-[10px] font-semibold text-cyan-50"
              >
                #{tag === "島" ? "離島" : tag}
              </span>
            ))}
            {selectedTags.length > 4 ? (
              <span className="rounded-full border border-white/10 bg-white/10 px-2 py-0.5 text-[10px] text-slate-300">
                +{selectedTags.length - 4}
              </span>
            ) : null}
          </div>
        ) : null}
        <p className="mt-2 text-[11px] text-slate-300">
          ピンをクリックすると詳細が表示されます
        </p>
      </div>

      {selectedSpot ? (
        <div className="pointer-events-none absolute bottom-3 left-3 right-3 z-[410] rounded-2xl border border-cyan-200/25 bg-slate-950/86 p-3 shadow-glass backdrop-blur-xl md:left-auto md:right-4 md:top-4 md:bottom-auto md:w-72">
          <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-cyan-200 px-2.5 py-1 text-[11px] font-semibold text-slate-950">
            <MapPin className="h-3.5 w-3.5" />
            選択中
          </div>
          <h3 className="text-lg font-semibold text-white">{selectedSpot.name}</h3>
          <p className="mt-1 text-xs text-cyan-100">
            {selectedSpot.region} / {selectedSpot.country}
          </p>
        </div>
      ) : null}

      {spots.length === 0 ? (
        <div className="absolute inset-3 z-[420] flex items-center justify-center rounded-[24px] border border-white/[0.12] bg-slate-950/84 p-6 text-center backdrop-blur-xl">
          <div className="max-w-sm">
            <h3 className="text-xl font-semibold text-white">条件に合う絶景が見つかりませんでした</h3>
            <p className="mt-2 text-sm leading-7 text-slate-300">
              フィルターをリセットして探してみてください。
            </p>
            <Button className="mt-5" onClick={onReset}>
              <RotateCcw className="h-4 w-4" />
              リセット
            </Button>
          </div>
        </div>
      ) : null}
    </section>
  );
}

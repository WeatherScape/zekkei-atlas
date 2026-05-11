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

function getStatusFromSpot(spot: Spot) {
  const status = spot.travelStyle.find((item) => item.startsWith("status:"))?.replace("status:", "");
  if (status === "demo" || status === "thisYear" || status === "planning" || status === "visited" || status === "someday") {
    return status;
  }
  return "someday";
}

function getThemeFromSpot(spot: Spot) {
  const theme = spot.travelStyle.find((item) => item.startsWith("theme:"))?.replace("theme:", "");
  if (
    theme === "nature" ||
    theme === "starry" ||
    theme === "sea" ||
    theme === "mountain" ||
    theme === "onsen" ||
    theme === "history" ||
    theme === "city" ||
    theme === "food" ||
    theme === "hotel" ||
    theme === "cafe" ||
    theme === "drive" ||
    theme === "overseas" ||
    theme === "lifetime"
  ) {
    return theme;
  }
  return "nature";
}

function buildMarkerIcon(L: LeafletModule, spot: Spot, selected: boolean) {
  const status = getStatusFromSpot(spot);
  const theme = getThemeFromSpot(spot);
  const lifetime = spot.tags.includes("一生に一度");
  const size = selected ? 40 : lifetime ? 34 : status === "demo" ? 22 : status === "thisYear" ? 30 : 26;

  return L.divIcon({
    className: "",
    html: `<span class="zekkei-map-pin zekkei-map-pin-${status} zekkei-map-pin-theme-${theme}${lifetime ? " zekkei-map-pin-lifetime" : ""}${selected ? " zekkei-map-pin-selected" : ""}"><span>${lifetime ? "★" : ""}</span></span>`,
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

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function buildPopupHtml(spot: Spot) {
  return `
    <article class="zekkei-map-popup-card">
      <img src="${escapeHtml(spot.mapPreviewImage)}" alt="${escapeHtml(spot.name)}" />
      <div>
        <p>${escapeHtml([spot.region, spot.country].filter(Boolean).join(" / "))}</p>
        <h3>${escapeHtml(spot.name)}</h3>
        <span>${escapeHtml(spot.catchCopy)}</span>
      </div>
    </article>
  `;
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
      return item.point.distanceTo(candidate.point) <= threshold;
    });
    group.forEach((candidate) => used.add(candidate.spot.id));
    const hasSelected = group.some((candidate) => candidate.spot.id === selectedSpotId);

    if (hasSelected && group.length > 1) {
      const selected = group.find((candidate) => candidate.spot.id === selectedSpotId);
      const rest = group.filter((candidate) => candidate.spot.id !== selectedSpotId);
      if (selected) {
        groups.push({ spots: [selected.spot], center: [selected.spot.latitude, selected.spot.longitude] });
      }
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

    groups.push({
      spots: group.map((candidate) => candidate.spot),
      center: [
        group.reduce((sum, candidate) => sum + candidate.spot.latitude, 0) / group.length,
        group.reduce((sum, candidate) => sum + candidate.spot.longitude, 0) / group.length
      ]
    });
  });

  return groups;
}

export function LeafletTravelMap({
  spots,
  selectedSpotId,
  onSelect,
  onReset,
  mode = "all",
  season = "all",
  selectedTags = [],
  addMode = false,
  onPickLocation,
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
          icon: buildMarkerIcon(L, spot, selected),
          keyboard: true,
          zIndexOffset: selected ? 1000 : 0
        });
        marker.bindTooltip(spot.name, {
          direction: "top",
          offset: [0, selected ? -22 : -16],
          opacity: 0.96
        });
        marker.bindPopup(buildPopupHtml(spot), {
          className: "zekkei-map-popup",
          closeButton: false,
          maxWidth: 260,
          minWidth: 220,
          offset: [0, -18]
        });
        marker.on("click", () => {
          current.onSelect(spot);
          marker.openPopup();
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
        "relative min-h-[440px] overflow-hidden rounded-[28px] border border-white/[0.12] bg-slate-950 shadow-glass md:min-h-[calc(100vh-11rem)]",
        className
      )}
    >
      <div ref={mapContainerRef} className="absolute inset-0 z-0" />

      <div className="pointer-events-none absolute left-3 top-3 z-[410] max-w-[calc(100%-1.5rem)] rounded-2xl border border-white/[0.14] bg-slate-950/78 px-4 py-3 shadow-glass backdrop-blur-xl md:left-4 md:top-4">
        <p className="text-xs font-semibold text-white md:text-sm">{modeLabels[mode]}</p>
        <p className="mt-1 text-xs text-cyan-100">
          {season !== "all" ? `${getSeasonLabel(season)}の景色 ${spots.length}件` : `${spots.length}件の景色を表示中`}
        </p>
        {selectedTags.length > 0 ? (
          <div className="mt-2 flex max-w-[260px] flex-wrap gap-1.5">
            {selectedTags.slice(0, 4).map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-cyan-200/30 bg-cyan-200/10 px-2 py-0.5 text-[10px] font-semibold text-cyan-50"
              >
                #{tag}
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
          {addMode ? "地図を動かして中央ピンを合わせます" : "ピンをクリックすると詳細が開きます"}
        </p>
      </div>

      {addMode ? (
        <>
          <div className="pointer-events-none absolute inset-0 z-[410] flex items-center justify-center">
            <div className="relative -mt-8">
              <div className="absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-200/35 bg-cyan-200/10 shadow-[0_0_40px_rgba(103,232,249,0.25)]" />
              <div className="relative flex h-12 w-12 items-center justify-center rounded-full border-2 border-white bg-cyan-200 text-slate-950 shadow-glow">
                <MapPin className="h-6 w-6 fill-slate-950/10" />
              </div>
              <div className="mx-auto mt-2 h-3 w-3 rounded-full bg-cyan-200/80 blur-[2px]" />
            </div>
          </div>
          <div className="absolute bottom-3 left-3 right-3 z-[430] rounded-2xl border border-cyan-200/25 bg-slate-950/90 p-3 shadow-glass backdrop-blur-xl md:bottom-4 md:left-1/2 md:right-auto md:w-[360px] md:-translate-x-1/2">
            <p className="text-sm font-semibold text-white">地図を動かして、行きたい場所を中央に合わせる</p>
            <p className="mt-1 text-xs leading-6 text-slate-300">
              スマホでもズレにくいように、タップ位置ではなく地図の中心を記録します。
            </p>
            <Button
              type="button"
              size="md"
              className="mt-3 w-full"
              onClick={() => {
                const center = mapRef.current?.getCenter();
                if (!center) return;
                onPickLocation?.({ latitude: Number(center.lat.toFixed(6)), longitude: Number(center.lng.toFixed(6)) });
              }}
            >
              <MapPin className="h-4 w-4" />
              この位置で追加
            </Button>
          </div>
        </>
      ) : null}

      {spots.length === 0 && !addMode ? (
        <div className="absolute inset-3 z-[420] flex items-center justify-center rounded-[24px] border border-white/[0.12] bg-slate-950/84 p-6 text-center backdrop-blur-xl">
          <div className="max-w-sm">
            <h3 className="text-xl font-semibold text-white">まだ地図に表示できる景色がありません</h3>
            <p className="mt-2 text-sm leading-7 text-slate-300">
              場所を追加するか、フィルターをリセットして探してみてください。
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

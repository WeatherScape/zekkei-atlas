"use client";

import { useEffect, useMemo, useState } from "react";
import { spots, type Spot } from "@/data/spots";
import {
  enrichDraftSpot,
  mySpotThemeOptions,
  normalizeMySpotStatus,
  officialSpotToMySpot,
  type MySpot,
  type MySpotDraft
} from "@/data/my-spots";

const MY_SPOTS_KEY = "zekkei-atlas-my-spots";
const LEGACY_WISHLIST_KEY = "zekkei-atlas-wishlist";
const MIGRATION_KEY = "zekkei-atlas-my-spots-migrated";
const THEME_VALUES = new Set(mySpotThemeOptions.map((theme) => theme.value));

let mySpots: MySpot[] = [];
let hydrated = false;
const listeners = new Set<(spots: MySpot[]) => void>();

function canUseStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function createId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `my-${crypto.randomUUID()}`;
  }
  return `my-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function sanitizeMySpot(value: unknown): MySpot | null {
  if (!value || typeof value !== "object") return null;
  const item = value as Partial<MySpot>;
  if (!item.id || !item.name) return null;
  return {
    id: String(item.id),
    name: String(item.name),
    sourceUrl: item.sourceUrl ? String(item.sourceUrl) : undefined,
    sourceType: item.sourceType ?? "other",
    memo: item.memo ? String(item.memo) : undefined,
    image: item.image ? String(item.image) : undefined,
    country: item.country ? String(item.country) : undefined,
    region: item.region ? String(item.region) : undefined,
    latitude: typeof item.latitude === "number" ? item.latitude : undefined,
    longitude: typeof item.longitude === "number" ? item.longitude : undefined,
    tags: Array.isArray(item.tags) ? item.tags.filter((tag): tag is string => typeof tag === "string") : [],
    bestSeason: Array.isArray(item.bestSeason)
      ? item.bestSeason.filter((season): season is string => typeof season === "string")
      : [],
    status: normalizeMySpotStatus(item.status),
    reason: item.reason ? String(item.reason) : item.memo ? String(item.memo) : undefined,
    activities: Array.isArray(item.activities)
      ? item.activities.filter((activity): activity is string => typeof activity === "string")
      : [],
    themes: Array.isArray(item.themes)
      ? item.themes.filter(
          (theme): theme is NonNullable<MySpot["themes"]>[number] =>
            typeof theme === "string" && THEME_VALUES.has(theme as NonNullable<MySpot["themes"]>[number])
        )
      : [],
    wishLevel: typeof item.wishLevel === "number" ? Math.min(5, Math.max(1, item.wishLevel)) : undefined,
    companion: item.companion ? String(item.companion) : undefined,
    bestTime: Array.isArray(item.bestTime)
      ? item.bestTime.filter((time): time is string => typeof time === "string")
      : undefined,
    firstStepMemo: item.firstStepMemo ? String(item.firstStepMemo) : undefined,
    nextStep: item.nextStep ? String(item.nextStep) : item.firstStepMemo ? String(item.firstStepMemo) : undefined,
    catchCopy: item.catchCopy ? String(item.catchCopy) : undefined,
    createdAt: item.createdAt ?? new Date().toISOString(),
    updatedAt: item.updatedAt ?? new Date().toISOString()
  };
}

function readStoredMySpots() {
  if (!canUseStorage()) return [];
  try {
    const raw = window.localStorage.getItem(MY_SPOTS_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed)
      ? parsed.map(sanitizeMySpot).filter((spot): spot is MySpot => Boolean(spot))
      : [];
  } catch {
    return [];
  }
}

function readLegacyWishlist() {
  if (!canUseStorage()) return [];
  try {
    const migrated = window.localStorage.getItem(MIGRATION_KEY);
    if (migrated) return [];
    const raw = window.localStorage.getItem(LEGACY_WISHLIST_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    window.localStorage.setItem(MIGRATION_KEY, "1");
    return Array.isArray(parsed) ? parsed.filter((id): id is string => typeof id === "string") : [];
  } catch {
    return [];
  }
}

function writeMySpots(items: MySpot[]) {
  if (!canUseStorage()) return;
  try {
    window.localStorage.setItem(MY_SPOTS_KEY, JSON.stringify(items));
  } catch {
    // Restricted storage should not break the in-memory app experience.
  }
}

function emit(items: MySpot[]) {
  mySpots = items;
  listeners.forEach((listener) => listener(items));
}

function updateMySpots(updater: (items: MySpot[]) => MySpot[]) {
  const next = updater(mySpots);
  writeMySpots(next);
  emit(next);
}

function subscribe(listener: (items: MySpot[]) => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function bootstrapMySpots() {
  const stored = readStoredMySpots();
  const legacy = readLegacyWishlist()
    .map((id) => spots.find((spot) => spot.id === id))
    .filter((spot): spot is Spot => Boolean(spot))
    .map((spot) => officialSpotToMySpot(spot));
  const merged = [...stored];

  legacy.forEach((item) => {
    if (!merged.some((spot) => spot.id === item.id)) merged.push(item);
  });

  writeMySpots(merged);
  return merged;
}

export function useMySpots() {
  const [items, setItems] = useState<MySpot[]>(mySpots);
  const [isReady, setIsReady] = useState(hydrated);

  useEffect(() => {
    if (!hydrated) {
      hydrated = true;
      emit(bootstrapMySpots());
    }

    setItems(mySpots);
    setIsReady(true);
    const unsubscribe = subscribe(setItems);

    const handleStorage = (event: StorageEvent) => {
      if (event.key === MY_SPOTS_KEY) {
        emit(readStoredMySpots());
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => {
      unsubscribe();
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  const mappedIds = useMemo(() => new Set(items.map((spot) => spot.id)), [items]);

  const addMySpot = (draft: MySpotDraft) => {
    const enriched = enrichDraftSpot(draft);
    const now = new Date().toISOString();
    const item: MySpot = {
      id: createId(),
      name: enriched.name?.trim() || "名前未設定の絶景",
      sourceUrl: enriched.sourceUrl?.trim() || undefined,
      sourceType: enriched.sourceType ?? "other",
      memo: enriched.memo?.trim() || undefined,
      image: enriched.image?.trim() || undefined,
      country: enriched.country?.trim() || undefined,
      region: enriched.region?.trim() || undefined,
      latitude: enriched.latitude,
      longitude: enriched.longitude,
      tags: enriched.tags ?? [],
      bestSeason: enriched.bestSeason ?? [],
      status: normalizeMySpotStatus(enriched.status),
      reason: enriched.reason?.trim() || undefined,
      activities: enriched.activities ?? [],
      themes: enriched.themes ?? [],
      wishLevel: enriched.wishLevel,
      companion: enriched.companion?.trim() || undefined,
      bestTime: enriched.bestTime ?? [],
      firstStepMemo: enriched.firstStepMemo?.trim() || undefined,
      nextStep: enriched.nextStep?.trim() || enriched.firstStepMemo?.trim() || undefined,
      catchCopy: enriched.catchCopy?.trim() || undefined,
      createdAt: now,
      updatedAt: now
    };
    updateMySpots((current) => [item, ...current]);
    return item;
  };

  const updateMySpot = (id: string, patch: Partial<MySpot>) => {
    updateMySpots((current) =>
      current.map((spot) =>
        spot.id === id ? { ...spot, ...patch, updatedAt: new Date().toISOString() } : spot
      )
    );
  };

  const removeMySpot = (id: string) => {
    updateMySpots((current) => current.filter((spot) => spot.id !== id));
  };

  const importFromOfficialSpot = (spotId: string) => {
    const official = spots.find((spot) => spot.id === spotId);
    if (!official) return undefined;
    const item = officialSpotToMySpot(official);
    updateMySpots((current) =>
      current.some((spot) => spot.id === item.id)
        ? current.filter((spot) => spot.id !== item.id)
        : [item, ...current]
    );
    return item;
  };

  const isOfficialSaved = (spotId: string) => mappedIds.has(`official-${spotId}`);
  const isSaved = (id: string) => mappedIds.has(id) || isOfficialSaved(id);

  return {
    isReady,
    mySpots: items,
    savedIds: items.map((spot) => spot.id),
    addMySpot,
    updateMySpot,
    removeMySpot,
    importFromOfficialSpot,
    isOfficialSaved,
    isSaved
  };
}

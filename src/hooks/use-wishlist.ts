"use client";

import { useEffect, useMemo, useState } from "react";
import { spots } from "@/data/spots";

const WISHLIST_KEY = "zekkei-atlas-wishlist";

let wishlistIds: string[] = [];
let hydrated = false;
const listeners = new Set<(ids: string[]) => void>();

function canUseStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function readWishlist() {
  if (!canUseStorage()) return [];
  try {
    const raw = window.localStorage.getItem(WISHLIST_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((id) => typeof id === "string") : [];
  } catch {
    return [];
  }
}

function writeWishlist(ids: string[]) {
  if (!canUseStorage()) return;
  try {
    window.localStorage.setItem(WISHLIST_KEY, JSON.stringify(ids));
  } catch {
    // Storage can be unavailable in private or restricted browsers. The in-memory state still works.
  }
}

function emit(ids: string[]) {
  wishlistIds = ids;
  listeners.forEach((listener) => listener(ids));
}

function updateWishlist(updater: (ids: string[]) => string[]) {
  const next = Array.from(new Set(updater(wishlistIds)));
  writeWishlist(next);
  emit(next);
}

function subscribe(listener: (ids: string[]) => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function useWishlist() {
  const [savedIds, setSavedIds] = useState<string[]>(wishlistIds);
  const [isReady, setIsReady] = useState(hydrated);

  useEffect(() => {
    if (!hydrated) {
      hydrated = true;
      emit(readWishlist());
    }

    setSavedIds(wishlistIds);
    setIsReady(true);
    const unsubscribe = subscribe(setSavedIds);

    const handleStorage = (event: StorageEvent) => {
      if (event.key === WISHLIST_KEY) {
        emit(readWishlist());
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => {
      unsubscribe();
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  const savedSpots = useMemo(
    () => spots.filter((spot) => savedIds.includes(spot.id)),
    [savedIds]
  );

  const isSaved = (id: string) => savedIds.includes(id);

  const toggleSpot = (id: string) => {
    updateWishlist((current) =>
      current.includes(id) ? current.filter((savedId) => savedId !== id) : [...current, id]
    );
  };

  const removeSpot = (id: string) => {
    updateWishlist((current) => current.filter((savedId) => savedId !== id));
  };

  return {
    isReady,
    savedIds,
    savedSpots,
    isSaved,
    toggleSpot,
    removeSpot
  };
}

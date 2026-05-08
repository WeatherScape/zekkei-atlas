"use client";

import { useEffect, useMemo, useState } from "react";
import { spots } from "@/data/spots";

const WISHLIST_KEY = "zekkei-atlas-wishlist";

function readWishlist() {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(WISHLIST_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((id) => typeof id === "string") : [];
  } catch {
    return [];
  }
}

export function useWishlist() {
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setSavedIds(readWishlist());
    setIsReady(true);
  }, []);

  useEffect(() => {
    if (!isReady) return;
    window.localStorage.setItem(WISHLIST_KEY, JSON.stringify(savedIds));
  }, [isReady, savedIds]);

  const savedSpots = useMemo(
    () => spots.filter((spot) => savedIds.includes(spot.id)),
    [savedIds]
  );

  const isSaved = (id: string) => savedIds.includes(id);

  const toggleSpot = (id: string) => {
    setSavedIds((current) =>
      current.includes(id) ? current.filter((savedId) => savedId !== id) : [...current, id]
    );
  };

  const removeSpot = (id: string) => {
    setSavedIds((current) => current.filter((savedId) => savedId !== id));
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

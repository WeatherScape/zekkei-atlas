import { Spot } from "@/data/spots";

export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function difficultyLabel(difficulty: Spot["difficulty"]) {
  return {
    easy: "気軽",
    normal: "標準",
    hard: "上級"
  }[difficulty];
}

export function difficultyTone(difficulty: Spot["difficulty"]) {
  return {
    easy: "border-emerald-300/30 bg-emerald-300/10 text-emerald-100",
    normal: "border-cyan-300/30 bg-cyan-300/10 text-cyan-100",
    hard: "border-rose-300/30 bg-rose-300/10 text-rose-100"
  }[difficulty];
}

export function budgetLabel(level: Spot["budgetLevel"]) {
  return {
    low: "ライト",
    medium: "スタンダード",
    high: "プレミアム"
  }[level];
}

export function normalizeText(value: string) {
  return value.toLowerCase().trim();
}

export function isDomestic(spot: Spot) {
  return spot.country === "日本";
}

export function scoreSpotForPlanner(
  spot: Spot,
  preferences: {
    scenery: string;
    season: string;
    companion: string;
    transport: string;
    mood: string;
  }
) {
  const text = normalizeText(
    [
      spot.name,
      spot.country,
      spot.region,
      spot.description,
      ...spot.tags,
      ...spot.bestSeason,
      ...spot.bestTime,
      ...spot.travelStyle,
      ...spot.highlights
    ].join(" ")
  );
  const sceneryTerms = preferences.scenery
    .split(/[、,\s]+/)
    .map(normalizeText)
    .filter(Boolean);

  let score = spot.photoScore;
  sceneryTerms.forEach((term) => {
    if (text.includes(term)) score += 18;
  });
  if (preferences.season && spot.bestSeason.includes(preferences.season)) score += 18;
  if (preferences.companion.includes("彼女") || preferences.companion.includes("恋人")) {
    if (spot.travelStyle.includes("カップル旅")) score += 14;
  }
  if (preferences.transport.includes("車") || preferences.transport.includes("レンタカー")) {
    if (spot.travelStyle.includes("ドライブ旅")) score += 12;
  }
  if (preferences.mood.includes("特別") || preferences.mood.includes("一生")) {
    if (spot.travelStyle.includes("一生に一度の旅")) score += 16;
  }
  return score;
}

export function getNearbySpots(current: Spot, items: Spot[]) {
  return items
    .filter((spot) => spot.id !== current.id)
    .map((spot) => {
      const sharedTags = spot.tags.filter((tag) => current.tags.includes(tag)).length;
      const sharedSeason = spot.bestSeason.filter((season) =>
        current.bestSeason.includes(season)
      ).length;
      const regionMatch = spot.region === current.region ? 3 : 0;
      const countryMatch = spot.country === current.country ? 1 : 0;
      return { spot, score: sharedTags * 2 + sharedSeason + regionMatch + countryMatch };
    })
    .sort((a, b) => b.score - a.score || b.spot.photoScore - a.spot.photoScore)
    .slice(0, 3)
    .map(({ spot }) => spot);
}

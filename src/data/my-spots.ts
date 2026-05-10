import { spots, type Spot } from "@/data/spots";
import { normalizeText } from "@/lib/utils";

export type MySpotStatus = "want" | "planning" | "visited";
export type MySpotSourceType = "instagram" | "tiktok" | "youtube" | "x" | "maps" | "other";

export type MySpot = {
  id: string;
  name: string;
  sourceUrl?: string;
  sourceType: MySpotSourceType;
  memo?: string;
  image?: string;
  country?: string;
  region?: string;
  latitude?: number;
  longitude?: number;
  tags: string[];
  bestSeason: string[];
  status: MySpotStatus;
  createdAt: string;
  updatedAt: string;
};

export type MySpotDraft = {
  name?: string;
  sourceUrl?: string;
  sourceType?: MySpotSourceType;
  memo?: string;
  image?: string;
  country?: string;
  region?: string;
  latitude?: number;
  longitude?: number;
  tags?: string[];
  bestSeason?: string[];
  status?: MySpotStatus;
};

const tagRules: Array<{ terms: string[]; tags: string[]; seasons?: string[] }> = [
  { terms: ["海", "beach", "ocean", "island", "islands", "okinawa", "離島", "島"], tags: ["海", "離島"], seasons: ["夏"] },
  { terms: ["星", "star", "night", "milky", "夜空"], tags: ["星空"], seasons: ["夏", "秋"] },
  { terms: ["夕日", "sunset", "夕焼け"], tags: ["夕日"], seasons: ["春", "夏", "秋"] },
  { terms: ["紅葉", "autumn", "fall", "maple"], tags: ["紅葉"], seasons: ["秋"] },
  { terms: ["雪", "snow", "winter", "aurora", "オーロラ"], tags: ["雪", "オーロラ"], seasons: ["冬"] },
  { terms: ["滝", "waterfall", "falls"], tags: ["滝"], seasons: ["春", "夏"] },
  { terms: ["雲海", "cloud sea"], tags: ["雲海"], seasons: ["秋", "冬"] },
  { terms: ["drive", "road", "bridge", "ドライブ", "橋"], tags: ["ドライブ"], seasons: ["春", "夏", "秋"] },
  { terms: ["couple", "date", "彼女", "恋人", "記念日"], tags: ["カップル"], seasons: ["春", "夏", "秋", "冬"] }
];

export function detectSourceType(url?: string): MySpotSourceType {
  const value = normalizeText(url ?? "");
  if (value.includes("instagram.com")) return "instagram";
  if (value.includes("tiktok.com")) return "tiktok";
  if (value.includes("youtube.com") || value.includes("youtu.be")) return "youtube";
  if (value.includes("x.com") || value.includes("twitter.com")) return "x";
  if (value.includes("maps.app.goo.gl") || value.includes("google.com/maps")) return "maps";
  return "other";
}

export function findOfficialSpot(nameOrUrl?: string) {
  const value = normalizeText(nameOrUrl ?? "");
  if (!value) return undefined;
  return spots.find((spot) => {
    const terms = [spot.id, spot.name, spot.country, spot.region, ...spot.tags].map(normalizeText);
    return terms.some((term) => term && value.includes(term));
  });
}

export function enrichDraftSpot(draft: MySpotDraft): MySpotDraft {
  const sourceText = [draft.name, draft.sourceUrl, draft.memo].filter(Boolean).join(" ");
  const official = findOfficialSpot(sourceText);
  const tags = new Set<string>(draft.tags ?? []);
  const seasons = new Set<string>(draft.bestSeason ?? []);

  tagRules.forEach((rule) => {
    if (rule.terms.some((term) => normalizeText(sourceText).includes(normalizeText(term)))) {
      rule.tags.forEach((tag) => tags.add(tag));
      rule.seasons?.forEach((season) => seasons.add(season));
    }
  });

  official?.tags.forEach((tag) => tags.add(tag === "島" ? "離島" : tag));
  official?.bestSeason.forEach((season) => seasons.add(season));

  return {
    ...draft,
    name: draft.name?.trim() || official?.name || "",
    sourceType: detectSourceType(draft.sourceUrl),
    image: draft.image?.trim() || official?.image,
    country: draft.country?.trim() || official?.country,
    region: draft.region?.trim() || official?.region,
    latitude: draft.latitude ?? official?.latitude,
    longitude: draft.longitude ?? official?.longitude,
    tags: Array.from(tags).filter(Boolean).slice(0, 8),
    bestSeason: Array.from(seasons).filter(Boolean).slice(0, 4),
    status: draft.status ?? "want"
  };
}

export function officialSpotToMySpot(spot: Spot): MySpot {
  const now = new Date().toISOString();
  return {
    id: `official-${spot.id}`,
    name: spot.name,
    sourceType: "other",
    memo: spot.description,
    image: spot.image,
    country: spot.country,
    region: spot.region,
    latitude: spot.latitude,
    longitude: spot.longitude,
    tags: spot.tags.map((tag) => (tag === "島" ? "離島" : tag)),
    bestSeason: spot.bestSeason,
    status: "want",
    createdAt: now,
    updatedAt: now
  };
}

export function mySpotToMapSpot(spot: MySpot): Spot {
  return {
    id: spot.id,
    name: spot.name,
    country: spot.country || "未設定",
    region: spot.region || "位置未設定",
    description: spot.memo || "SNSで見つけた行きたい絶景。あとで旅程に育てられます。",
    image: spot.image || "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=85",
    latitude: spot.latitude ?? 0,
    longitude: spot.longitude ?? 0,
    tags: spot.tags,
    bestSeason: spot.bestSeason,
    bestTime: ["あとで整理"],
    travelStyle: ["My Atlas"],
    difficulty: "normal",
    photoScore: spot.image ? 90 : 78,
    budgetLevel: "medium",
    duration: "あとで計画",
    highlights: [spot.sourceUrl ? "SNSから保存" : "自分で追加", ...(spot.tags.slice(0, 2))],
    tips: ["位置や季節はあとから編集できます"]
  };
}

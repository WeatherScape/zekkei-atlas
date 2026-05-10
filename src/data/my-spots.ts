import { spots, type Spot } from "@/data/spots";
import { normalizeText } from "@/lib/utils";

export type MySpotStatus = "someday" | "thisYear" | "planning" | "visited";
export type LegacyMySpotStatus = MySpotStatus | "want";
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
  wishLevel?: number;
  companion?: string;
  bestTime?: string[];
  firstStepMemo?: string;
  catchCopy?: string;
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
  status?: LegacyMySpotStatus;
  wishLevel?: number;
  companion?: string;
  bestTime?: string[];
  firstStepMemo?: string;
  catchCopy?: string;
};

const tagRules: Array<{ terms: string[]; tags: string[]; seasons?: string[]; bestTime?: string[] }> = [
  { terms: ["海", "beach", "ocean", "island", "islands", "okinawa", "離島", "島"], tags: ["海", "島"], seasons: ["夏"], bestTime: ["昼", "夕方"] },
  { terms: ["星", "star", "night", "milky", "星空"], tags: ["星空"], seasons: ["夏", "秋"], bestTime: ["夜"] },
  { terms: ["夕日", "sunset", "sunrise", "朝日"], tags: ["夕日"], seasons: ["春", "夏", "秋"], bestTime: ["夕方"] },
  { terms: ["紅葉", "autumn", "fall", "maple"], tags: ["紅葉"], seasons: ["秋"], bestTime: ["朝", "夕方"] },
  { terms: ["雪", "snow", "winter", "aurora", "オーロラ"], tags: ["雪"], seasons: ["冬"], bestTime: ["夜"] },
  { terms: ["滝", "waterfall", "falls"], tags: ["滝"], seasons: ["春", "夏"], bestTime: ["朝"] },
  { terms: ["雲海", "cloud sea"], tags: ["雲海"], seasons: ["秋", "冬"], bestTime: ["朝"] },
  { terms: ["drive", "road", "bridge", "ドライブ", "橋"], tags: ["ドライブ"], seasons: ["春", "夏", "秋"], bestTime: ["昼"] },
  { terms: ["couple", "date", "彼女", "恋人", "記念日"], tags: ["恋人と行きたい"], seasons: ["春", "夏", "秋", "冬"] },
  { terms: ["bucket", "once", "一生", "人生", "死ぬまで"], tags: ["一生に一度"], seasons: ["春", "夏", "秋", "冬"] }
];

export const mySpotStatusLabels: Record<MySpotStatus, string> = {
  someday: "いつか行きたい",
  thisYear: "今年行きたい",
  planning: "計画中",
  visited: "行った"
};

export function normalizeMySpotStatus(status?: LegacyMySpotStatus): MySpotStatus {
  if (status === "thisYear" || status === "planning" || status === "visited" || status === "someday") {
    return status;
  }
  return "someday";
}

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

function fallbackCatchCopy(draft: MySpotDraft, tags: string[]) {
  if (draft.catchCopy?.trim()) return draft.catchCopy.trim();
  if (tags.includes("一生に一度")) return "人生で一度は、この景色の前に立ちたい。";
  if (tags.includes("星空")) return "夜空まで旅の記憶に残る場所。";
  if (tags.includes("海") || tags.includes("島")) return "青の向こうに、次の旅の理由がある。";
  return "いつか、を本当に行く日に変える景色。";
}

export function enrichDraftSpot(draft: MySpotDraft): MySpotDraft {
  const sourceText = [draft.name, draft.sourceUrl, draft.memo, draft.country, draft.region, ...(draft.tags ?? [])]
    .filter(Boolean)
    .join(" ");
  const official = findOfficialSpot(sourceText);
  const tags = new Set<string>(draft.tags ?? []);
  const seasons = new Set<string>(draft.bestSeason ?? []);
  const bestTime = new Set<string>(draft.bestTime ?? []);

  tagRules.forEach((rule) => {
    if (rule.terms.some((term) => normalizeText(sourceText).includes(normalizeText(term)))) {
      rule.tags.forEach((tag) => tags.add(tag === "離島" ? "島" : tag));
      rule.seasons?.forEach((season) => seasons.add(season));
      rule.bestTime?.forEach((time) => bestTime.add(time));
    }
  });

  official?.tags.forEach((tag) => tags.add(tag === "離島" ? "島" : tag));
  official?.bestSeason.forEach((season) => seasons.add(season));
  official?.bestTime.forEach((time) => bestTime.add(time));

  const normalizedTags = Array.from(tags).filter(Boolean).slice(0, 8);

  return {
    ...draft,
    name: draft.name?.trim() || official?.name || "",
    sourceType: detectSourceType(draft.sourceUrl),
    image: draft.image?.trim() || official?.image,
    country: draft.country?.trim() || official?.country,
    region: draft.region?.trim() || official?.region,
    latitude: draft.latitude ?? official?.latitude,
    longitude: draft.longitude ?? official?.longitude,
    tags: normalizedTags,
    bestSeason: Array.from(seasons).filter(Boolean).slice(0, 4),
    bestTime: Array.from(bestTime).filter(Boolean).slice(0, 4),
    status: normalizeMySpotStatus(draft.status),
    wishLevel: draft.wishLevel ?? (normalizedTags.includes("一生に一度") ? 5 : 4),
    companion: draft.companion?.trim() || (normalizedTags.includes("恋人と行きたい") ? "恋人" : undefined),
    firstStepMemo: draft.firstStepMemo?.trim() || undefined,
    catchCopy: fallbackCatchCopy(draft, normalizedTags)
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
    tags: spot.tags.map((tag) => (tag === "離島" ? "島" : tag)),
    bestSeason: spot.bestSeason,
    status: "someday",
    wishLevel: spot.photoScore >= 95 ? 5 : 4,
    bestTime: spot.bestTime,
    catchCopy: "スターター候補から追加した、いつか見たい絶景。",
    firstStepMemo: "気になったら、行ける季節と予算を調べる。",
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
    description: spot.memo || spot.catchCopy || "SNSで見つけた、いつか行きたい景色。",
    image: spot.image || "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=85",
    latitude: spot.latitude ?? 0,
    longitude: spot.longitude ?? 0,
    tags: spot.tags,
    bestSeason: spot.bestSeason,
    bestTime: spot.bestTime?.length ? spot.bestTime : ["あとで整理"],
    travelStyle: ["My Atlas", `status:${spot.status}`, ...(spot.companion ? [`companion:${spot.companion}`] : [])],
    difficulty: "normal",
    photoScore: Math.min(99, Math.max(70, (spot.wishLevel ?? 4) * 18 + (spot.image ? 8 : 0))),
    budgetLevel: "medium",
    duration: "あとで計画",
    highlights: [spot.catchCopy || "いつか行きたい景色", ...(spot.tags.slice(0, 2))],
    tips: [spot.firstStepMemo || "場所・季節・予算を少しずつ整理する。"]
  };
}

import { spots, type Spot } from "@/data/spots";
import { normalizeText } from "@/lib/utils";

export type MySpotStatus = "someday" | "thisYear" | "planning" | "visited";
export type LegacyMySpotStatus = MySpotStatus | "want";
export type MySpotSourceType = "instagram" | "tiktok" | "youtube" | "x" | "maps" | "other";
export type MySpotTheme =
  | "nature"
  | "starry"
  | "sea"
  | "mountain"
  | "onsen"
  | "history"
  | "city"
  | "food"
  | "hotel"
  | "cafe"
  | "drive"
  | "overseas"
  | "lifetime";

export const mySpotThemeOptions: Array<{ value: MySpotTheme; label: string; tags: string[] }> = [
  { value: "nature", label: "自然景観", tags: ["自然", "絶景", "滝", "雲海"] },
  { value: "starry", label: "星空", tags: ["星空"] },
  { value: "sea", label: "海・島", tags: ["海", "島", "離島"] },
  { value: "mountain", label: "山・森", tags: ["山", "森", "紅葉"] },
  { value: "onsen", label: "温泉", tags: ["温泉"] },
  { value: "history", label: "歴史的建造物", tags: ["歴史", "建造物", "世界遺産"] },
  { value: "city", label: "街歩き", tags: ["街歩き", "街"] },
  { value: "food", label: "グルメ", tags: ["グルメ", "食"] },
  { value: "hotel", label: "ホテル", tags: ["ホテル", "宿"] },
  { value: "cafe", label: "カフェ", tags: ["カフェ"] },
  { value: "drive", label: "ドライブ", tags: ["ドライブ", "橋"] },
  { value: "overseas", label: "海外", tags: ["海外"] },
  { value: "lifetime", label: "一生に一度", tags: ["一生に一度"] }
];

export const mySpotThemeLabels = Object.fromEntries(
  mySpotThemeOptions.map((theme) => [theme.value, theme.label])
) as Record<MySpotTheme, string>;

const themeValues = new Set(mySpotThemeOptions.map((theme) => theme.value));

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
  reason?: string;
  activities: string[];
  themes: MySpotTheme[];
  wishLevel?: number;
  companion?: string;
  bestTime?: string[];
  firstStepMemo?: string;
  nextStep?: string;
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
  reason?: string;
  activities?: string[];
  themes?: MySpotTheme[];
  wishLevel?: number;
  companion?: string;
  bestTime?: string[];
  firstStepMemo?: string;
  nextStep?: string;
  catchCopy?: string;
};

const tagRules: Array<{ terms: string[]; tags: string[]; themes?: MySpotTheme[]; seasons?: string[]; bestTime?: string[]; activities?: string[] }> = [
  { terms: ["海", "beach", "ocean", "island", "islands", "okinawa", "離島", "島"], tags: ["海", "島"], themes: ["sea"], seasons: ["夏"], bestTime: ["昼", "夕方"], activities: ["海を見る", "写真を撮る"] },
  { terms: ["星", "star", "night", "milky", "星空"], tags: ["星空"], themes: ["starry"], seasons: ["夏", "秋"], bestTime: ["夜"], activities: ["星空を見る"] },
  { terms: ["夕日", "sunset", "sunrise", "朝日"], tags: ["夕日"], seasons: ["春", "夏", "秋"], bestTime: ["夕方"], activities: ["夕日を見る", "写真を撮る"] },
  { terms: ["紅葉", "autumn", "fall", "maple"], tags: ["紅葉"], themes: ["mountain", "nature"], seasons: ["秋"], bestTime: ["朝", "夕方"], activities: ["紅葉を見る"] },
  { terms: ["雪", "snow", "winter", "aurora", "オーロラ"], tags: ["雪"], themes: ["nature"], seasons: ["冬"], bestTime: ["夜"], activities: ["雪景色を見る"] },
  { terms: ["滝", "waterfall", "falls"], tags: ["滝"], themes: ["nature"], seasons: ["春", "夏"], bestTime: ["朝"], activities: ["滝を見る"] },
  { terms: ["雲海", "cloud sea"], tags: ["雲海"], themes: ["nature", "mountain"], seasons: ["秋", "冬"], bestTime: ["朝"], activities: ["朝日を見る"] },
  { terms: ["drive", "road", "bridge", "ドライブ", "橋"], tags: ["ドライブ"], themes: ["drive"], seasons: ["春", "夏", "秋"], bestTime: ["昼"], activities: ["ドライブする"] },
  { terms: ["couple", "date", "彼女", "恋人", "記念日"], tags: ["恋人と行きたい"], seasons: ["春", "夏", "秋", "冬"], activities: ["大切な人と過ごす"] },
  { terms: ["bucket", "once", "一生", "人生", "死ぬまで"], tags: ["一生に一度"], themes: ["lifetime"], seasons: ["春", "夏", "秋", "冬"] },
  { terms: ["hotel", "resort", "旅館", "ホテル", "宿"], tags: ["ホテル"], themes: ["hotel"], activities: ["ホテルに泊まる"] },
  { terms: ["cafe", "coffee", "カフェ"], tags: ["カフェ"], themes: ["cafe"], activities: ["カフェで過ごす"] },
  { terms: ["food", "gourmet", "ごはん", "グルメ"], tags: ["グルメ"], themes: ["food"], activities: ["ご当地グルメを食べる"] },
  { terms: ["onsen", "温泉"], tags: ["温泉"], themes: ["onsen"], activities: ["温泉に入る"] },
  { terms: ["海外", "abroad", "foreign", "world"], tags: ["海外"], themes: ["overseas"] }
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
    const id = normalizeText(spot.id);
    const name = normalizeText(spot.name);
    return Boolean(
      (id.length >= 4 && value.includes(id)) ||
        (name.length >= 3 && value.includes(name)) ||
        (value.length >= 3 && name.includes(value))
    );
  });
}

function fallbackCatchCopy(draft: MySpotDraft, tags: string[]) {
  if (draft.catchCopy?.trim()) return draft.catchCopy.trim();
  if (tags.includes("一生に一度")) return "人生で一度は、この景色の前に立ちたい。";
  if (tags.includes("星空")) return "夜空まで旅の記憶に残る場所。";
  if (tags.includes("海") || tags.includes("島")) return "青の向こうに、次の旅の理由がある。";
  return "いつか、を本当に行く日に変える景色。";
}

function normalizeThemes(values?: string[]): MySpotTheme[] {
  return Array.from(
    new Set((values ?? []).filter((value): value is MySpotTheme => themeValues.has(value as MySpotTheme)))
  ).slice(0, 5);
}

function normalizeList(values?: string[]) {
  return Array.from(new Set((values ?? []).map((value) => value.trim()).filter(Boolean))).slice(0, 8);
}

function inferThemesFromTags(tags: string[], country?: string) {
  const themes = new Set<MySpotTheme>();
  const tagText = normalizeText(tags.join(" "));
  mySpotThemeOptions.forEach((theme) => {
    if (theme.tags.some((tag) => tagText.includes(normalizeText(tag)))) {
      themes.add(theme.value);
    }
  });
  if (country && country !== "日本") themes.add("overseas");
  if (themes.size === 0) themes.add("nature");
  return Array.from(themes).slice(0, 5);
}

function fallbackNextStep(draft: MySpotDraft, tags: string[], themes: MySpotTheme[]) {
  const current = draft.nextStep?.trim() || draft.firstStepMemo?.trim();
  if (current) return current;
  if (themes.includes("overseas")) return "パスポート・航空券・ベストシーズンを調べる。";
  if (tags.includes("星空")) return "月齢と星空がきれいに見える時期を調べる。";
  if (tags.includes("海") || tags.includes("島")) return "行きやすい季節と現地での移動手段を調べる。";
  return "行けそうな季節とざっくり予算を調べる。";
}

export function enrichDraftSpot(draft: MySpotDraft): MySpotDraft {
  const sourceText = [
    draft.name,
    draft.sourceUrl,
    draft.memo,
    draft.reason,
    draft.country,
    draft.region,
    ...(draft.tags ?? []),
    ...(draft.activities ?? [])
  ]
    .filter(Boolean)
    .join(" ");
  const official = findOfficialSpot(sourceText);
  const tags = new Set<string>(draft.tags ?? []);
  const seasons = new Set<string>(draft.bestSeason ?? []);
  const bestTime = new Set<string>(draft.bestTime ?? []);
  const themes = new Set<MySpotTheme>(normalizeThemes(draft.themes));
  const activities = new Set<string>(normalizeList(draft.activities));

  tagRules.forEach((rule) => {
    if (rule.terms.some((term) => normalizeText(sourceText).includes(normalizeText(term)))) {
      rule.tags.forEach((tag) => tags.add(tag === "離島" ? "島" : tag));
      rule.themes?.forEach((theme) => themes.add(theme));
      rule.seasons?.forEach((season) => seasons.add(season));
      rule.bestTime?.forEach((time) => bestTime.add(time));
      rule.activities?.forEach((activity) => activities.add(activity));
    }
  });

  official?.tags.forEach((tag) => tags.add(tag === "離島" ? "島" : tag));
  official?.bestSeason.forEach((season) => seasons.add(season));
  official?.bestTime.forEach((time) => bestTime.add(time));

  const normalizedTags = Array.from(tags).filter(Boolean).slice(0, 8);
  inferThemesFromTags(normalizedTags, draft.country?.trim() || official?.country).forEach((theme) => themes.add(theme));
  const normalizedThemes = normalizeThemes(Array.from(themes));

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
    reason: draft.reason?.trim() || draft.memo?.trim() || undefined,
    activities: normalizeList(Array.from(activities)),
    themes: normalizedThemes,
    wishLevel: draft.wishLevel ?? (normalizedTags.includes("一生に一度") ? 5 : 4),
    companion: draft.companion?.trim() || (normalizedTags.includes("恋人と行きたい") ? "恋人" : undefined),
    firstStepMemo: draft.firstStepMemo?.trim() || undefined,
    nextStep: fallbackNextStep(draft, normalizedTags, normalizedThemes),
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
    reason: "この景色を、いつか自分の目で見てみたい。",
    activities: spot.tags.includes("星空")
      ? ["星空を見る", "写真を撮る"]
      : spot.tags.includes("海")
        ? ["海を見る", "写真を撮る"]
        : ["景色を眺める", "写真を撮る"],
    themes: inferThemesFromTags(spot.tags, spot.country),
    wishLevel: spot.photoScore >= 95 ? 5 : 4,
    bestTime: spot.bestTime,
    catchCopy: "スターター候補から追加した、いつか見たい絶景。",
    firstStepMemo: "気になったら、行ける季節と予算を調べる。",
    nextStep: "気になったら、行ける季節と予算を調べる。",
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
    description: spot.reason || spot.memo || spot.catchCopy || "SNSで見つけた、いつか行きたい景色。",
    image: spot.image || "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=85",
    latitude: spot.latitude ?? 0,
    longitude: spot.longitude ?? 0,
    tags: Array.from(new Set([...spot.tags, ...spot.themes.map((theme) => mySpotThemeLabels[theme])])),
    bestSeason: spot.bestSeason,
    bestTime: spot.bestTime?.length ? spot.bestTime : ["あとで整理"],
    travelStyle: [
      "My Atlas",
      `status:${spot.status}`,
      ...(spot.themes[0] ? [`theme:${spot.themes[0]}`] : []),
      ...(spot.companion ? [`companion:${spot.companion}`] : [])
    ],
    difficulty: "normal",
    photoScore: Math.min(99, Math.max(70, (spot.wishLevel ?? 4) * 18 + (spot.image ? 8 : 0))),
    budgetLevel: "medium",
    duration: "あとで計画",
    highlights: [spot.catchCopy || "いつか行きたい景色", ...(spot.activities.slice(0, 2))],
    tips: [spot.nextStep || spot.firstStepMemo || "場所・季節・予算を少しずつ整理する。"]
  };
}

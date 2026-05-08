import { spots, type Spot } from "@/data/spots";
import { budgetLabel, scoreSpotForPlanner } from "@/lib/utils";

export type TravelPlanInput = {
  departure: string;
  days: string;
  budget: string;
  companion: string;
  scenery: string;
  season: string;
  transport: string;
  mood: string;
};

export type TravelPlan = {
  recommendations: Spot[];
  reason: string;
  itinerary: Array<{ day: string; title: string; detail: string }>;
  photoTime: string;
  caution: string[];
  budget: string;
  packing: string[];
};

function includesAny(value: string, terms: string[]) {
  return terms.some((term) => value.includes(term));
}

function curatedMatches(input: TravelPlanInput) {
  const text = `${input.scenery} ${input.season} ${input.transport} ${input.mood}`.toLowerCase();

  if (includesAny(text, ["海外", "一生"])) {
    return ["uyuni", "iceland", "cappadocia"];
  }
  if (includesAny(text, ["雪", "冬", "オーロラ"])) {
    return ["shirakawago", "biei", "lapland"];
  }
  if (includesAny(text, ["紅葉", "秋"])) {
    return ["kamikochi", "shirakawago", "aso"];
  }
  if (includesAny(text, ["海", "ドライブ", "レンタカー"]) && includesAny(text, ["ドライブ", "車", "レンタカー"])) {
    return ["miyako", "tsunoshima", "shimanami"];
  }
  if (includesAny(text, ["海", "星空", "夏"])) {
    return ["hateruma", "ishigaki", "miyako"];
  }
  return [];
}

export function generateTravelPlan(input: TravelPlanInput): TravelPlan {
  const curatedIds = curatedMatches(input);
  const ranked = [...spots]
    .map((spot) => {
      const curatedBoost = curatedIds.includes(spot.id) ? 120 - curatedIds.indexOf(spot.id) * 8 : 0;
      return {
        spot,
        score:
          curatedBoost +
          scoreSpotForPlanner(spot, {
            scenery: input.scenery,
            season: input.season,
            companion: input.companion,
            transport: input.transport,
            mood: input.mood
          })
      };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(({ spot }) => spot);

  const top = ranked[0];
  const second = ranked[1] ?? ranked[0];

  return {
    recommendations: ranked,
    reason: `${top.name}は「${input.scenery}」と「${input.mood}」の相性が高く、${input.season}に${top.bestTime.join("・")}の景色を狙いやすい候補です。${input.companion}との旅でも移動と滞在のバランスが取りやすく、写真映えスコアも${top.photoScore}/100と強いです。`,
    itinerary: [
      {
        day: "Day 1",
        title: `${input.departure}から移動、夕方の光を狙う`,
        detail: `${input.transport}で${top.region}へ。到着後は${top.highlights[0]}を軽めに下見し、夕方から夜にかけて旅の導入になる写真を撮ります。`
      },
      {
        day: "Day 2",
        title: `${top.name}を中心にメイン絶景へ`,
        detail: `${top.highlights.slice(0, 2).join("、")}を軸に、日中はアクティビティ、夜は${top.tags.includes("星空") ? "星空" : "静かな夜景"}の時間を確保します。`
      },
      {
        day: "Day 3",
        title: `${second.name}も軽く組み合わせて帰路へ`,
        detail: `朝は${top.bestTime.includes("朝") || top.bestTime.includes("早朝") ? "もう一度撮影" : "カフェと散策"}を入れ、余裕があれば${second.name}の雰囲気も味わって帰ります。`
      }
    ],
    photoTime: `${top.bestTime.join(" / ")}。特に${top.bestTime[0]}は人が少なく、光の方向も読みやすい時間帯です。`,
    caution: [
      top.tips[0],
      top.country !== "日本"
        ? "パスポート、海外保険、通信手段を事前に確認してください。"
        : "天候で見え方が大きく変わるため、代替スポットを1つ持っておくと安心です。",
      top.difficulty === "hard"
        ? "体力と装備に余裕を持ち、無理な行程にしないでください。"
        : "人気時間帯は混みやすいため、撮影場所は少し早めに到着してください。"
    ],
    budget: `${input.budget}を目安に、${budgetLabel(top.budgetLevel)}帯。移動費と宿泊費を先に押さえると計画しやすいです。`,
    packing: Array.from(
      new Set([
        "モバイルバッテリー",
        "歩きやすい靴",
        "カメラ用予備バッテリー",
        top.tags.includes("海") ? "日焼け止め" : "薄手の羽織り",
        top.tags.includes("星空") ? "三脚" : "小さめのデイバッグ",
        top.difficulty === "hard" ? "レインウェア" : "折りたたみ傘"
      ])
    )
  };
}

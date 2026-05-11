import { mySpotThemeLabels, type MySpot } from "@/data/my-spots";

export type MySpotPlan = {
  title: string;
  bestTiming: string;
  duration: string;
  budget: string;
  firstResearch: string[];
  itinerary: Array<{ day: string; title: string; detail: string }>;
  similarSpots: MySpot[];
};

function estimateDuration(spot: MySpot) {
  if (spot.themes.includes("overseas") || spot.country && spot.country !== "日本") return "4泊6日〜7泊";
  if (spot.tags.includes("島") || spot.themes.includes("sea")) return "2泊3日〜3泊4日";
  if (spot.themes.includes("cafe") || spot.themes.includes("food")) return "日帰り〜1泊2日";
  return "1泊2日〜2泊3日";
}

function estimateBudget(spot: MySpot) {
  if (spot.themes.includes("overseas") || spot.country && spot.country !== "日本") return "20万円〜45万円";
  if (spot.tags.includes("島") || spot.themes.includes("hotel")) return "8万円〜18万円";
  if (spot.themes.includes("cafe") || spot.themes.includes("food")) return "1万円〜5万円";
  return "4万円〜12万円";
}

function bestTiming(spot: MySpot) {
  const season = spot.bestSeason.length ? spot.bestSeason.join("・") : "行きたい季節";
  const time = spot.bestTime?.length ? spot.bestTime.join("・") : "いちばん見たい時間帯";
  if (spot.tags.includes("星空")) return `${season}の新月前後、${time}を狙うのがおすすめです。`;
  if (spot.tags.includes("紅葉")) return `${season}の見頃を2〜3週間前から確認すると動きやすいです。`;
  if (spot.tags.includes("雪")) return `${season}の天気が安定する日を見ながら、早めに宿を押さえるのが安心です。`;
  return `${season}、特に${time}の景色を軸に計画すると満足度が上がります。`;
}

function firstResearch(spot: MySpot) {
  const items = new Set<string>();
  items.add(spot.nextStep || spot.firstStepMemo || "ベストシーズンと移動手段を調べる");
  if (spot.themes.includes("overseas")) items.add("パスポート期限と航空券の相場を確認する");
  if (spot.tags.includes("星空")) items.add("月齢・天気・光害の少ない場所を確認する");
  if (spot.tags.includes("海") || spot.tags.includes("島")) items.add("現地での移動手段と船/飛行機の本数を確認する");
  if (spot.companion) items.add(`${spot.companion}と行けそうな時期を相談する`);
  items.add("残したSNS投稿を見返して、撮りたい構図を決める");
  return Array.from(items).slice(0, 5);
}

function similarSpotsFor(spot: MySpot, allSpots: MySpot[]) {
  return allSpots
    .filter((item) => item.id !== spot.id)
    .map((item) => {
      const tagScore = item.tags.filter((tag) => spot.tags.includes(tag)).length;
      const themeScore = item.themes.filter((theme) => spot.themes.includes(theme)).length * 2;
      const regionScore = item.country && item.country === spot.country ? 1 : 0;
      return { item, score: tagScore + themeScore + regionScore };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(({ item }) => item);
}

export function generateMySpotPlan(spot: MySpot, allSpots: MySpot[] = []): MySpotPlan {
  const activity = spot.activities[0] || "景色をゆっくり眺める";
  const companion = spot.companion || "大切な人";
  const theme = spot.themes[0] ? mySpotThemeLabels[spot.themes[0]] : "絶景";

  return {
    title: "この場所を本当に行くなら、まずはここから。",
    bestTiming: bestTiming(spot),
    duration: estimateDuration(spot),
    budget: estimateBudget(spot),
    firstResearch: firstResearch(spot),
    itinerary: [
      {
        day: "Day 1",
        title: "移動と余白の日",
        detail: `${spot.region || spot.country || spot.name}に向かい、到着後は無理に詰め込まず、周辺の雰囲気と食事を楽しむ。`
      },
      {
        day: "Day 2",
        title: `${spot.name}を主役にする日`,
        detail: `${theme}としての魅力を味わいながら、${activity}を旅の中心にして、${spot.reason || spot.catchCopy || "行きたいと思った理由"}をちゃんと回収する時間を作る。`
      },
      {
        day: "Day 3",
        title: "記憶を持ち帰る日",
        detail: `朝の散歩やカフェ時間を入れて、${companion}と次に行きたい場所も話しながら帰路へ。`
      }
    ],
    similarSpots: similarSpotsFor(spot, allSpots)
  };
}

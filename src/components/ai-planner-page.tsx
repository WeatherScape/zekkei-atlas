"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  ArrowRight,
  Bot,
  Camera,
  CheckCircle2,
  Coins,
  Loader2,
  Luggage,
  MapPin,
  ShieldAlert,
  Sparkles
} from "lucide-react";
import { seasonOptions, spots, Spot } from "@/data/spots";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { GlassPanel } from "@/components/ui/glass-panel";
import { WishlistButton } from "@/components/wishlist-button";
import { budgetLabel, scoreSpotForPlanner } from "@/lib/utils";

type PlannerResult = {
  recommendations: Spot[];
  reason: string;
  itinerary: Array<{ day: string; title: string; detail: string }>;
  photoTime: string;
  caution: string[];
  budget: string;
  packing: string[];
};

export function AiPlannerPage() {
  const searchParams = useSearchParams();
  const queryString = searchParams.toString();
  const [departure, setDeparture] = useState("広島");
  const [days, setDays] = useState("2泊3日");
  const [budget, setBudget] = useState("20万円以内");
  const [companion, setCompanion] = useState("彼女");
  const [scenery, setScenery] = useState("海、星空、夕日");
  const [season, setSeason] = useState("夏");
  const [transport, setTransport] = useState("飛行機・レンタカー");
  const [mood, setMood] = useState("特別感重視");
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<PlannerResult | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(queryString);
    const prompt = params.get("prompt");
    if (prompt) {
      setScenery(prompt);
      setMood(prompt.includes("一生") ? "一生に一度の特別感" : "写真映え重視");
    }
  }, [queryString]);

  const context = useMemo(
    () => ({ departure, days, budget, companion, scenery, season, transport, mood }),
    [budget, companion, days, departure, mood, scenery, season, transport]
  );

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsGenerating(true);
    window.setTimeout(() => {
      setResult(generatePlannerResult(context));
      setIsGenerating(false);
    }, 650);
  };

  return (
    <main className="min-h-screen bg-atlas-ink text-white">
      <section className="relative overflow-hidden px-5 pb-20 pt-32 md:px-8">
        <div className="absolute inset-0 bg-night-rim" />
        <div className="absolute inset-0 bg-atlas-grid bg-[length:72px_72px] opacity-30" />
        <div className="relative mx-auto max-w-7xl">
          <div className="mb-10 max-w-4xl">
            <Badge className="mb-4 border-cyan-200/40 bg-cyan-200/[0.12] text-cyan-50">
              AI Travel Planner
            </Badge>
            <h1 className="text-balance text-4xl font-semibold tracking-normal md:text-6xl">
              条件を入れるだけで、絶景旅の候補と旅程を生成。
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-8 text-slate-300">
              外部AI APIなしのモック生成ですが、ローカルの絶景データを条件でスコアリングして、旅の提案として読める形に整えます。
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-[420px_minmax(0,1fr)]">
            <GlassPanel className="p-5 md:p-7 lg:sticky lg:top-28 lg:h-fit">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-cyan-200/25 bg-cyan-200/10 text-cyan-100">
                  <Bot className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold">Trip Inputs</h2>
                  <p className="text-sm text-slate-400">旅の条件</p>
                </div>
              </div>

              <form className="space-y-4" onSubmit={handleSubmit}>
                <Field label="出発地" value={departure} onChange={setDeparture} placeholder="広島" />
                <div className="grid grid-cols-2 gap-3">
                  <Field label="日数" value={days} onChange={setDays} placeholder="2泊3日" />
                  <Field label="予算" value={budget} onChange={setBudget} placeholder="20万円以内" />
                </div>
                <Field label="同行者" value={companion} onChange={setCompanion} placeholder="彼女 / 友人 / ひとり" />
                <Field label="見たい景色" value={scenery} onChange={setScenery} placeholder="海、星空、夕日" />
                <div className="grid grid-cols-2 gap-3">
                  <label className="space-y-2">
                    <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                      季節
                    </span>
                    <select
                      value={season}
                      onChange={(event) => setSeason(event.target.value)}
                      className="h-12 w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 text-sm text-white outline-none transition focus:border-cyan-200/50"
                    >
                      {seasonOptions.map((option) => (
                        <option key={option}>{option}</option>
                      ))}
                    </select>
                  </label>
                  <Field label="移動手段" value={transport} onChange={setTransport} placeholder="飛行機・レンタカー" />
                </div>
                <Field label="旅行のテンション" value={mood} onChange={setMood} placeholder="特別感重視" />

                <Button type="submit" className="w-full" size="lg" disabled={isGenerating}>
                  {isGenerating ? <Loader2 className="h-5 w-5 animate-spin" /> : <Sparkles className="h-5 w-5" />}
                  {isGenerating ? "プラン生成中..." : "AIプランを生成"}
                </Button>
              </form>
            </GlassPanel>

            <div className="space-y-6">
              {result ? (
                <PlannerResultView result={result} context={context} />
              ) : (
                <GlassPanel className="flex min-h-[620px] flex-col justify-between overflow-hidden p-7">
                  <div>
                    <Badge className="mb-5 border-cyan-200/40 bg-cyan-200/[0.12] text-cyan-50">
                      Mock AI Output
                    </Badge>
                    <h2 className="text-3xl font-semibold">条件をもとに、絶景候補を組み立てます。</h2>
                    <p className="mt-4 max-w-2xl leading-8 text-slate-300">
                      例の条件なら、海・星空・夕日・カップル旅・夏を重視して、離島系スポットを高く評価します。
                    </p>
                  </div>
                  <div className="grid gap-4 md:grid-cols-3">
                    {spots.slice(0, 3).map((spot) => (
                      <div key={spot.id} className="rounded-3xl border border-white/10 bg-white/[0.06] p-4">
                        <img src={spot.image} alt={spot.name} className="h-36 w-full rounded-2xl object-cover" />
                        <h3 className="mt-4 font-semibold">{spot.name}</h3>
                        <p className="mt-1 text-sm text-slate-400">{spot.region}</p>
                      </div>
                    ))}
                  </div>
                </GlassPanel>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <label className="space-y-2">
      <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
        {label}
      </span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="h-12 w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-200/50"
      />
    </label>
  );
}

function PlannerResultView({
  result,
  context
}: {
  result: PlannerResult;
  context: {
    departure: string;
    days: string;
    budget: string;
    companion: string;
    scenery: string;
    season: string;
    transport: string;
    mood: string;
  };
}) {
  const top = result.recommendations[0];

  return (
    <div className="space-y-6">
      <GlassPanel className="overflow-hidden">
        <div className="relative min-h-[420px] p-7">
          <img src={top.image} alt={top.name} className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/70 to-slate-950/25" />
          <div className="relative z-10 max-w-2xl">
            <Badge className="mb-4 border-cyan-200/40 bg-cyan-200/[0.12] text-cyan-50">
              Best Match
            </Badge>
            <h2 className="text-4xl font-semibold md:text-6xl">{top.name}</h2>
            <p className="mt-3 flex items-center gap-2 text-cyan-100">
              <MapPin className="h-4 w-4" />
              {top.region} / {top.country}
            </p>
            <p className="mt-6 text-lg leading-9 text-slate-200">{result.reason}</p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <WishlistButton spotId={top.id} size="lg" />
              <Link href={`/spots/${top.id}`} className={buttonVariants({ variant: "secondary", size: "lg" })}>
                詳細を見る
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </GlassPanel>

      <div className="grid gap-5 md:grid-cols-3">
        {result.recommendations.map((spot, index) => (
          <GlassPanel key={spot.id} className="overflow-hidden">
            <img src={spot.image} alt={spot.name} className="h-48 w-full object-cover" />
            <div className="p-5">
              <Badge>#{index + 1}</Badge>
              <h3 className="mt-3 text-2xl font-semibold">{spot.name}</h3>
              <p className="mt-2 text-sm text-cyan-100">{spot.region} / {spot.country}</p>
              <p className="mt-4 line-clamp-3 text-sm leading-7 text-slate-300">{spot.description}</p>
              <div className="mt-5 flex gap-2">
                <WishlistButton spotId={spot.id} size="sm" />
                <Link href={`/spots/${spot.id}`} className={buttonVariants({ variant: "outline", size: "sm" })}>
                  詳細
                </Link>
              </div>
            </div>
          </GlassPanel>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <GlassPanel className="p-6 md:p-8">
          <h2 className="text-3xl font-semibold">{context.days}プラン</h2>
          <div className="mt-6 space-y-4">
            {result.itinerary.map((item) => (
              <div key={item.day} className="rounded-3xl border border-white/10 bg-white/[0.06] p-5">
                <p className="flex items-center gap-2 text-sm font-semibold text-cyan-100">
                  <CheckCircle2 className="h-4 w-4" />
                  {item.day}
                </p>
                <h3 className="mt-2 text-xl font-semibold">{item.title}</h3>
                <p className="mt-2 leading-7 text-slate-300">{item.detail}</p>
              </div>
            ))}
          </div>
        </GlassPanel>

        <div className="space-y-5">
          <SideInfo icon={<Camera className="h-5 w-5" />} title="写真を撮るべき時間帯" items={[result.photoTime]} />
          <SideInfo icon={<Coins className="h-5 w-5" />} title="予算感" items={[result.budget]} />
          <SideInfo icon={<Luggage className="h-5 w-5" />} title="持ち物" items={result.packing} />
          <SideInfo icon={<ShieldAlert className="h-5 w-5" />} title="注意点" items={result.caution} />
        </div>
      </div>
    </div>
  );
}

function SideInfo({ icon, title, items }: { icon: React.ReactNode; title: string; items: string[] }) {
  return (
    <GlassPanel className="p-5">
      <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold">
        <span className="text-cyan-100">{icon}</span>
        {title}
      </h3>
      <div className="space-y-2">
        {items.map((item) => (
          <p key={item} className="rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 text-sm leading-7 text-slate-300">
            {item}
          </p>
        ))}
      </div>
    </GlassPanel>
  );
}

function generatePlannerResult(context: {
  departure: string;
  days: string;
  budget: string;
  companion: string;
  scenery: string;
  season: string;
  transport: string;
  mood: string;
}): PlannerResult {
  const recommendations = [...spots]
    .map((spot) => ({
      spot,
      score: scoreSpotForPlanner(spot, {
        scenery: context.scenery,
        season: context.season,
        companion: context.companion,
        transport: context.transport,
        mood: context.mood
      })
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(({ spot }) => spot);

  const top = recommendations[0];
  const second = recommendations[1];

  return {
    recommendations,
    reason: `${top.name}は「${context.scenery}」と「${context.mood}」の相性が高く、${context.season}に${top.bestTime.join("・")}の景色を狙いやすい候補です。${context.companion}との旅でも移動と滞在のバランスが取りやすく、写真映えスコアも${top.photoScore}/100と強いです。`,
    itinerary: [
      {
        day: "Day 1",
        title: `${context.departure}から移動、夕方の光を狙う`,
        detail: `${context.transport}で${top.region}へ。到着後は${top.highlights[0]}を軽めに下見し、夕方から夜にかけて旅の導入になる写真を撮ります。`
      },
      {
        day: "Day 2",
        title: `${top.name}を中心にメイン絶景へ`,
        detail: `${top.highlights.slice(0, 2).join("、")}を軸に、日中はアクティビティ、夜は${top.tags.includes("星空") ? "星空" : "静かな夜景"}の時間を確保します。`
      },
      {
        day: "Day 3",
        title: `${second.name}を軽く組み合わせて帰路へ`,
        detail: `朝の時間に${top.bestTime.includes("朝") || top.bestTime.includes("早朝") ? "もう一度撮影" : "カフェと散策"}を入れ、余裕があれば${second.name}の雰囲気も味わって帰ります。`
      }
    ],
    photoTime: `${top.bestTime.join(" / ")}。特に${top.bestTime[0]}は人が少なく、光の方向も読みやすい時間帯です。`,
    caution: [
      `${top.tips[0]}`,
      top.country !== "日本" ? "パスポート、海外保険、通信手段を事前に確認してください。" : "天候で見え方が大きく変わるため、代替スポットを1つ持っておくと安心です。",
      top.difficulty === "hard" ? "体力と装備に余裕を持ち、無理な行程にしないでください。" : "人気時間帯は混みやすいため、撮影場所は少し早めに到着してください。"
    ],
    budget: `${context.budget}を目安に、${budgetLabel(top.budgetLevel)}帯。移動費と宿泊費を先に押さえると計画しやすいです。`,
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

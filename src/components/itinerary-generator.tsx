"use client";

import { useState } from "react";
import { CalendarDays, CheckCircle2, Sparkles } from "lucide-react";
import { Spot } from "@/data/spots";
import { Button } from "@/components/ui/button";
import { GlassPanel } from "@/components/ui/glass-panel";

export function ItineraryGenerator({ spot }: { spot: Spot }) {
  const [generated, setGenerated] = useState(false);

  const days = [
    {
      day: "Day 1",
      title: "移動、夕日スポット、地元グルメ",
      detail: `${spot.region}へ移動し、夕方は${spot.bestTime.includes("夕方") ? "ベスト時間帯の光" : "旅の導入に合う柔らかい光"}を狙って撮影。夜は土地の食事でコンディションを整えます。`
    },
    {
      day: "Day 2",
      title: "メイン絶景、アクティビティ、星空",
      detail: `${spot.highlights[0]}を中心に過ごす日。午後は周辺散策、夜は${spot.tags.includes("星空") ? "星空撮影" : "静かな夜景散歩"}まで余白を残します。`
    },
    {
      day: "Day 3",
      title: "朝日、カフェ、帰路",
      detail: `${spot.bestTime.includes("早朝") || spot.bestTime.includes("朝") ? "朝の光で最後の撮影" : "朝はゆっくり余韻を味わい"}、カフェや土産時間を入れて帰路へ。`
    }
  ];

  return (
    <GlassPanel className="p-6">
      <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-200/25 bg-cyan-200/10 text-cyan-100">
        <Sparkles className="h-6 w-6" />
      </div>
      <h2 className="text-2xl font-semibold">AI旅プラン生成</h2>
      <p className="mt-3 text-sm leading-7 text-slate-300">
        このスポットを中心に2泊3日の旅程を作る
      </p>
      <Button className="mt-5 w-full" onClick={() => setGenerated(true)}>
        <CalendarDays className="h-4 w-4" />
        旅程を生成
      </Button>

      {generated ? (
        <div className="mt-6 space-y-4">
          {days.map((item) => (
            <div key={item.day} className="rounded-3xl border border-white/10 bg-white/[0.06] p-4">
              <p className="flex items-center gap-2 text-sm font-semibold text-cyan-100">
                <CheckCircle2 className="h-4 w-4" />
                {item.day}
              </p>
              <h3 className="mt-2 font-semibold text-white">{item.title}</h3>
              <p className="mt-2 text-sm leading-7 text-slate-300">{item.detail}</p>
            </div>
          ))}
        </div>
      ) : null}
    </GlassPanel>
  );
}

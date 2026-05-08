"use client";

import { Radar, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export function MapEmptyState({ onReset }: { onReset: () => void }) {
  return (
    <div className="absolute inset-4 z-20 flex items-center justify-center rounded-[28px] border border-white/[0.12] bg-slate-950/[0.68] p-8 text-center backdrop-blur-2xl">
      <div className="max-w-md">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-cyan-200/30 bg-cyan-200/10 text-cyan-100">
          <Radar className="h-7 w-7" />
        </div>
        <h3 className="mt-5 text-2xl font-semibold text-white">条件に合う絶景が見つかりません</h3>
        <p className="mt-3 text-sm leading-7 text-slate-300">
          タグや季節を少し広げると、次の旅先候補が見つかりやすくなります。
        </p>
        <Button variant="primary" className="mt-6" onClick={onReset}>
          <RotateCcw className="h-4 w-4" />
          条件をリセット
        </Button>
      </div>
    </div>
  );
}

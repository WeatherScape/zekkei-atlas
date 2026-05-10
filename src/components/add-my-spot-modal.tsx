"use client";

import { FormEvent, ReactNode, useEffect, useMemo, useState } from "react";
import { Bot, Check, ImageIcon, LinkIcon, MapPin, Sparkles, X } from "lucide-react";
import { enrichDraftSpot, type MySpot, type MySpotDraft, type MySpotStatus } from "@/data/my-spots";
import { seasonOptions } from "@/data/spots";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FilterChip } from "@/components/filter-chip";
import { useMySpots } from "@/hooks/use-my-spots";
import { cn } from "@/lib/utils";

const statusOptions: Array<{ value: MySpotStatus; label: string }> = [
  { value: "want", label: "行きたい" },
  { value: "planning", label: "計画中" },
  { value: "visited", label: "行った" }
];

export function AddMySpotModal({
  open,
  onClose,
  initialName = "",
  initialSourceUrl = "",
  initialLatitude,
  initialLongitude,
  editingSpot
}: {
  open: boolean;
  onClose: () => void;
  initialName?: string;
  initialSourceUrl?: string;
  initialLatitude?: number;
  initialLongitude?: number;
  editingSpot?: MySpot;
}) {
  const { addMySpot, updateMySpot } = useMySpots();
  const [name, setName] = useState(initialName);
  const [sourceUrl, setSourceUrl] = useState(initialSourceUrl);
  const [memo, setMemo] = useState("");
  const [image, setImage] = useState("");
  const [country, setCountry] = useState("");
  const [region, setRegion] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [tagsText, setTagsText] = useState("");
  const [bestSeason, setBestSeason] = useState<string[]>([]);
  const [status, setStatus] = useState<MySpotStatus>("want");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!open) return;
    if (editingSpot) {
      setName(editingSpot.name);
      setSourceUrl(editingSpot.sourceUrl ?? "");
      setMemo(editingSpot.memo ?? "");
      setImage(editingSpot.image ?? "");
      setCountry(editingSpot.country ?? "");
      setRegion(editingSpot.region ?? "");
      setLatitude(typeof editingSpot.latitude === "number" ? String(editingSpot.latitude) : "");
      setLongitude(typeof editingSpot.longitude === "number" ? String(editingSpot.longitude) : "");
      setTagsText(editingSpot.tags.join(", "));
      setBestSeason(editingSpot.bestSeason);
      setStatus(editingSpot.status);
      return;
    }
    setName(initialName);
    setSourceUrl(initialSourceUrl);
    setMemo("");
    setImage("");
    setCountry("");
    setRegion("");
    setLatitude(typeof initialLatitude === "number" ? String(initialLatitude) : "");
    setLongitude(typeof initialLongitude === "number" ? String(initialLongitude) : "");
    setTagsText("");
    setBestSeason([]);
    setStatus("want");
  }, [editingSpot, initialLatitude, initialLongitude, initialName, initialSourceUrl, open]);

  const draft = useMemo<MySpotDraft>(
    () => ({
      name,
      sourceUrl,
      memo,
      image,
      country,
      region,
      latitude: Number.isFinite(Number(latitude)) && latitude.trim() ? Number(latitude) : undefined,
      longitude: Number.isFinite(Number(longitude)) && longitude.trim() ? Number(longitude) : undefined,
      tags: tagsText
        .split(/[、,\s]+/)
        .map((tag) => tag.trim())
        .filter(Boolean),
      bestSeason,
      status
    }),
    [bestSeason, country, image, latitude, longitude, memo, name, region, sourceUrl, status, tagsText]
  );

  const preview = useMemo(() => enrichDraftSpot(draft), [draft]);

  if (!open) return null;

  const toggleSeason = (season: string) => {
    setBestSeason((current) =>
      current.includes(season) ? current.filter((item) => item !== season) : [...current, season]
    );
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (editingSpot) {
      updateMySpot(editingSpot.id, {
        name: preview.name?.trim() || "名前未設定の絶景",
        sourceUrl: preview.sourceUrl?.trim() || undefined,
        sourceType: preview.sourceType ?? "other",
        memo: preview.memo?.trim() || undefined,
        image: preview.image?.trim() || undefined,
        country: preview.country?.trim() || undefined,
        region: preview.region?.trim() || undefined,
        latitude: preview.latitude,
        longitude: preview.longitude,
        tags: preview.tags ?? [],
        bestSeason: preview.bestSeason ?? [],
        status: preview.status ?? "want"
      });
    } else {
      addMySpot(preview);
    }
    setSaved(true);
    window.setTimeout(() => {
      setSaved(false);
      onClose();
    }, 520);
  };

  return (
    <div className="fixed inset-0 z-[5000] flex items-end justify-center bg-slate-950/78 p-3 backdrop-blur-xl md:items-center md:p-6">
      <form
        onSubmit={handleSubmit}
        className="grid max-h-[92vh] w-full max-w-5xl overflow-hidden rounded-[32px] border border-white/[0.14] bg-slate-950 shadow-glass md:grid-cols-[1.08fr_0.92fr]"
      >
        <div className="max-h-[92vh] overflow-y-auto p-5 md:p-7">
          <div className="mb-6 flex items-start justify-between gap-4">
            <div>
              <Badge className="mb-3 border-cyan-200/40 bg-cyan-200/[0.12] text-cyan-50">
                Add to My Atlas
              </Badge>
              <h2 className="text-3xl font-semibold text-white">
                {editingSpot ? "My Spotを編集" : "SNSで見つけた絶景を追加"}
              </h2>
              <p className="mt-2 text-sm leading-7 text-slate-300">
                URLや場所名を貼るだけで、タグや季節をAI風に整理して保存できます。
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-white/10 bg-white/10 p-2 text-slate-200 transition hover:bg-white/20"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="mb-6 grid grid-cols-3 gap-2 text-xs">
            {["1. 貼る", "2. 整理", "3. 保存"].map((step, index) => (
              <div
                key={step}
                className={cn(
                  "rounded-2xl border px-3 py-2 text-center font-semibold",
                  index === 1
                    ? "border-cyan-200/40 bg-cyan-200/10 text-cyan-50"
                    : "border-white/10 bg-white/[0.04] text-slate-300"
                )}
              >
                {step}
              </div>
            ))}
          </div>

          <div className="space-y-4">
            <Field label="場所名" required>
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                required={!sourceUrl.trim()}
                placeholder="例: 角島大橋、ラウターブルンネン、済州島..."
                className="h-12 w-full rounded-2xl border border-white/10 bg-white/[0.06] px-4 text-white outline-none placeholder:text-slate-500 focus:border-cyan-200/50"
              />
            </Field>

            <Field label="SNS / 地図 URL">
              <div className="relative">
                <LinkIcon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-cyan-100" />
                <input
                  value={sourceUrl}
                  onChange={(event) => setSourceUrl(event.target.value)}
                  placeholder="Instagram / TikTok / YouTube / Google Maps など"
                  className="h-12 w-full rounded-2xl border border-white/10 bg-white/[0.06] pl-11 pr-4 text-white outline-none placeholder:text-slate-500 focus:border-cyan-200/50"
                />
              </div>
            </Field>

            <Field label="行きたい理由・メモ">
              <textarea
                value={memo}
                onChange={(event) => setMemo(event.target.value)}
                placeholder="この投稿の海がきれい、星空を撮りたい、記念日に行きたい..."
                rows={3}
                className="w-full resize-none rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-cyan-200/50"
              />
            </Field>

            <div className="grid gap-4 md:grid-cols-2">
              <Field label="画像URL">
                <input
                  value={image}
                  onChange={(event) => setImage(event.target.value)}
                  placeholder="任意"
                  className="h-12 w-full rounded-2xl border border-white/10 bg-white/[0.06] px-4 text-white outline-none placeholder:text-slate-500 focus:border-cyan-200/50"
                />
              </Field>
              <Field label="タグ">
                <input
                  value={tagsText}
                  onChange={(event) => setTagsText(event.target.value)}
                  placeholder="海, 星空, カップル"
                  className="h-12 w-full rounded-2xl border border-white/10 bg-white/[0.06] px-4 text-white outline-none placeholder:text-slate-500 focus:border-cyan-200/50"
                />
              </Field>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Field label="国">
                <input
                  value={country}
                  onChange={(event) => setCountry(event.target.value)}
                  placeholder="日本、スイス、韓国..."
                  className="h-12 w-full rounded-2xl border border-white/10 bg-white/[0.06] px-4 text-white outline-none placeholder:text-slate-500 focus:border-cyan-200/50"
                />
              </Field>
              <Field label="地域">
                <input
                  value={region}
                  onChange={(event) => setRegion(event.target.value)}
                  placeholder="山口県、沖縄県、アルプス..."
                  className="h-12 w-full rounded-2xl border border-white/10 bg-white/[0.06] px-4 text-white outline-none placeholder:text-slate-500 focus:border-cyan-200/50"
                />
              </Field>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Field label="緯度">
                <input
                  value={latitude}
                  onChange={(event) => setLatitude(event.target.value)}
                  placeholder="任意。例: 34.347"
                  className="h-12 w-full rounded-2xl border border-white/10 bg-white/[0.06] px-4 text-white outline-none placeholder:text-slate-500 focus:border-cyan-200/50"
                />
              </Field>
              <Field label="経度">
                <input
                  value={longitude}
                  onChange={(event) => setLongitude(event.target.value)}
                  placeholder="任意。例: 130.878"
                  className="h-12 w-full rounded-2xl border border-white/10 bg-white/[0.06] px-4 text-white outline-none placeholder:text-slate-500 focus:border-cyan-200/50"
                />
              </Field>
            </div>

            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                行きたい季節
              </p>
              <div className="flex flex-wrap gap-2">
                {seasonOptions.map((season) => (
                  <FilterChip
                    key={season}
                    label={season}
                    active={bestSeason.includes(season)}
                    onClick={() => toggleSeason(season)}
                  />
                ))}
              </div>
            </div>

            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                ステータス
              </p>
              <div className="flex flex-wrap gap-2">
                {statusOptions.map((item) => (
                  <FilterChip
                    key={item.value}
                    label={item.label}
                    active={status === item.value}
                    onClick={() => setStatus(item.value)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        <aside className="max-h-[92vh] overflow-y-auto border-t border-white/10 bg-white/[0.045] p-5 md:border-l md:border-t-0 md:p-7">
          <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-cyan-50">
            <Bot className="h-4 w-4" />
            AI整理プレビュー
          </div>
          <div className="overflow-hidden rounded-[28px] border border-white/[0.12] bg-slate-950/60">
            <div className="relative h-56">
              {preview.image ? (
                <img src={preview.image} alt={preview.name || "preview"} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-cyan-200/12 via-slate-900 to-blue-950">
                  <ImageIcon className="h-10 w-10 text-cyan-100/70" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <p className="mb-2 flex items-center gap-1.5 text-xs text-cyan-100">
                  <MapPin className="h-3.5 w-3.5" />
                  {[preview.region, preview.country].filter(Boolean).join(" / ") || "位置はあとで整理"}
                </p>
                <h3 className="text-2xl font-semibold text-white">
                  {preview.name || "名前未設定の絶景"}
                </h3>
              </div>
            </div>
            <div className="space-y-4 p-5">
              <div className="flex flex-wrap gap-2">
                {(preview.tags?.length ? preview.tags : ["あとで整理"]).map((tag) => (
                  <Badge key={tag}>#{tag}</Badge>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <PreviewMetric label="季節" value={preview.bestSeason?.join(" / ") || "未設定"} />
                <PreviewMetric label="保存元" value={preview.sourceType || "other"} />
                <PreviewMetric
                  label="地図"
                  value={typeof preview.latitude === "number" && typeof preview.longitude === "number" ? "表示できます" : "位置未設定"}
                />
                <PreviewMetric label="状態" value={statusOptions.find((item) => item.value === preview.status)?.label || "行きたい"} />
              </div>
              {preview.memo ? (
                <p className="rounded-2xl border border-white/10 bg-white/[0.05] p-4 text-sm leading-7 text-slate-300">
                  {preview.memo}
                </p>
              ) : null}
            </div>
          </div>

          <Button type="submit" size="lg" className="mt-5 w-full" disabled={!name.trim() && !sourceUrl.trim()}>
            {saved ? <Check className="h-5 w-5" /> : <Sparkles className="h-5 w-5" />}
            {saved ? "My Atlasを更新しました" : editingSpot ? "変更を保存" : "My Atlasに保存"}
          </Button>
          <p className="mt-3 text-xs leading-6 text-slate-400">
            本物のSNS連携や投稿解析は使わず、入力内容とローカルデータで整理しています。
          </p>
        </aside>
      </form>
    </div>
  );
}

function Field({
  label,
  required,
  children
}: {
  label: string;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
        {label}
        {required ? <span className="ml-1 text-cyan-100">*</span> : null}
      </span>
      {children}
    </label>
  );
}

function PreviewMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.055] p-3">
      <p className="text-xs text-slate-400">{label}</p>
      <p className="mt-1 font-medium text-white">{value}</p>
    </div>
  );
}

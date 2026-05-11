"use client";

import { FormEvent, ReactNode, useEffect, useMemo, useState } from "react";
import { Bot, Check, ImageIcon, LinkIcon, MapPin, Sparkles, Upload, X } from "lucide-react";
import {
  enrichDraftSpot,
  mySpotThemeOptions,
  mySpotStatusLabels,
  normalizeMySpotStatus,
  type MySpot,
  type MySpotDraft,
  type MySpotStatus
} from "@/data/my-spots";
import { seasonOptions } from "@/data/spots";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FilterChip } from "@/components/filter-chip";
import { useMySpots } from "@/hooks/use-my-spots";
import { cn } from "@/lib/utils";

const statusOptions: Array<{ value: MySpotStatus; label: string }> = [
  { value: "someday", label: "いつか行きたい" },
  { value: "thisYear", label: "今年行きたい" },
  { value: "planning", label: "計画中" },
  { value: "visited", label: "行った" }
];

const bestTimeOptions = ["朝", "昼", "夕方", "夜"];
const activitySuggestions = [
  "星空を見る",
  "朝日を見る",
  "ドライブする",
  "ご当地グルメを食べる",
  "写真を撮る",
  "ホテルに泊まる",
  "海で泳ぐ",
  "トレッキングする",
  "夕日を見る"
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
  const [bestTime, setBestTime] = useState<string[]>([]);
  const [status, setStatus] = useState<MySpotStatus>("someday");
  const [reason, setReason] = useState("");
  const [activitiesText, setActivitiesText] = useState("");
  const [themes, setThemes] = useState<string[]>([]);
  const [wishLevel, setWishLevel] = useState(4);
  const [companion, setCompanion] = useState("");
  const [firstStepMemo, setFirstStepMemo] = useState("");
  const [catchCopy, setCatchCopy] = useState("");
  const [imageError, setImageError] = useState("");
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
      setBestTime(editingSpot.bestTime ?? []);
      setStatus(editingSpot.status);
      setReason(editingSpot.reason ?? editingSpot.memo ?? "");
      setActivitiesText(editingSpot.activities.join(", "));
      setThemes(editingSpot.themes);
      setWishLevel(editingSpot.wishLevel ?? 4);
      setCompanion(editingSpot.companion ?? "");
      setFirstStepMemo(editingSpot.nextStep ?? editingSpot.firstStepMemo ?? "");
      setCatchCopy(editingSpot.catchCopy ?? "");
      setImageError("");
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
    setBestTime([]);
    setStatus("someday");
    setReason("");
    setActivitiesText("");
    setThemes([]);
    setWishLevel(4);
    setCompanion("");
    setFirstStepMemo("");
    setCatchCopy("");
    setImageError("");
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
        .split(/[,、\s]+/)
        .map((tag) => tag.trim())
        .filter(Boolean),
      bestSeason,
      bestTime,
      status,
      reason,
      activities: activitiesText
        .split(/[,、\n]+/)
        .map((activity) => activity.trim())
        .filter(Boolean),
      themes: themes as MySpotDraft["themes"],
      wishLevel,
      companion,
      firstStepMemo,
      nextStep: firstStepMemo,
      catchCopy
    }),
    [
      bestSeason,
      bestTime,
      catchCopy,
      companion,
      country,
      firstStepMemo,
      image,
      latitude,
      longitude,
      memo,
      name,
      reason,
      region,
      sourceUrl,
      status,
      tagsText,
      activitiesText,
      themes,
      wishLevel
    ]
  );

  const preview = useMemo(() => enrichDraftSpot(draft), [draft]);

  if (!open) return null;

  const toggleSeason = (season: string) => {
    setBestSeason((current) =>
      current.includes(season) ? current.filter((item) => item !== season) : [...current, season]
    );
  };

  const toggleBestTime = (time: string) => {
    setBestTime((current) =>
      current.includes(time) ? current.filter((item) => item !== time) : [...current, time]
    );
  };

  const toggleActivity = (activity: string) => {
    const current = activitiesText
      .split(/[,、\n]+/)
      .map((item) => item.trim())
      .filter(Boolean);
    const next = current.includes(activity)
      ? current.filter((item) => item !== activity)
      : [...current, activity];
    setActivitiesText(next.join(", "));
  };

  const toggleTheme = (theme: string) => {
    setThemes((current) =>
      current.includes(theme) ? current.filter((item) => item !== theme) : [...current, theme]
    );
  };

  const handleImageFile = async (file?: File) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setImageError("画像ファイルを選んでください。");
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      setImageError("画像は8MB以下にしてください。");
      return;
    }

    setImageError("");
    try {
      const dataUrl = await fileToCompressedDataUrl(file);
      setImage(dataUrl);
    } catch {
      setImageError("画像を読み込めませんでした。別の画像で試してください。");
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const patch = {
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
      bestTime: preview.bestTime ?? [],
      status: normalizeMySpotStatus(preview.status),
      reason: preview.reason?.trim() || undefined,
      activities: preview.activities ?? [],
      themes: preview.themes ?? [],
      wishLevel: preview.wishLevel,
      companion: preview.companion?.trim() || undefined,
      firstStepMemo: preview.firstStepMemo?.trim() || undefined,
      nextStep: preview.nextStep?.trim() || preview.firstStepMemo?.trim() || undefined,
      catchCopy: preview.catchCopy?.trim() || undefined
    };

    if (editingSpot) {
      updateMySpot(editingSpot.id, patch);
    } else {
      addMySpot(patch);
    }

    setSaved(true);
    window.setTimeout(() => {
      setSaved(false);
      onClose();
    }, 520);
  };

  return (
    <div className="fixed inset-0 z-[5000] flex items-end justify-center bg-slate-950/78 p-0 backdrop-blur-xl md:items-center md:p-6">
      <form
        onSubmit={handleSubmit}
        className="max-h-[96svh] w-full max-w-5xl overflow-y-auto rounded-t-[30px] border border-white/[0.14] bg-slate-950 shadow-glass md:grid md:max-h-[92vh] md:grid-cols-[1.08fr_0.92fr] md:overflow-hidden md:rounded-[32px]"
      >
        <div className="p-5 pb-24 md:max-h-[92vh] md:overflow-y-auto md:p-7">
          <div className="mb-6 flex items-start justify-between gap-4">
            <div>
              <Badge className="mb-3 border-cyan-200/40 bg-cyan-200/[0.12] text-cyan-50">
                Add to My Atlas
              </Badge>
              <h2 className="text-3xl font-semibold text-white">
                {editingSpot ? "My Spotを編集" : "行きたい景色を追加"}
              </h2>
              <p className="mt-2 text-sm leading-7 text-slate-300">
                SNS URL、場所名、行きたい理由を残して、いつか行きたいを本当に行く候補に育てます。
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
            {["1. 残す", "2. 整える", "3. 旅に近づける"].map((step, index) => (
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
                  placeholder="InstagramやXで見つけた場所名・URLを貼り付け"
                  className="h-12 w-full rounded-2xl border border-white/10 bg-white/[0.06] pl-11 pr-4 text-white outline-none placeholder:text-slate-500 focus:border-cyan-200/50"
                />
              </div>
            </Field>

            <Field label="SNS投稿メモ">
              <textarea
                value={memo}
                onChange={(event) => setMemo(event.target.value)}
                placeholder="投稿の雰囲気、残したきっかけ、あとで見返したい情報..."
                rows={3}
                className="w-full resize-none rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-cyan-200/50"
              />
            </Field>

            <Field label="行きたい理由">
              <textarea
                value={reason}
                onChange={(event) => setReason(event.target.value)}
                placeholder="この絶景を人生で一度は見たい、彼女と記念日に行きたい、星空を見てみたい..."
                rows={3}
                className="w-full resize-none rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-cyan-200/50"
              />
            </Field>

            <ChoiceGroup label="そこでやりたいこと">
              {activitySuggestions.map((activity) => (
                <FilterChip
                  key={activity}
                  label={activity}
                  active={activitiesText
                    .split(/[,、\n]+/)
                    .map((item) => item.trim())
                    .includes(activity)}
                  onClick={() => toggleActivity(activity)}
                />
              ))}
            </ChoiceGroup>
            <input
              value={activitiesText}
              onChange={(event) => setActivitiesText(event.target.value)}
              placeholder="星空を見る, 写真を撮る, ホテルに泊まる"
              className="h-12 w-full rounded-2xl border border-white/10 bg-white/[0.06] px-4 text-white outline-none placeholder:text-slate-500 focus:border-cyan-200/50"
            />

            <ChoiceGroup label="テーマ">
              {mySpotThemeOptions.map((theme) => (
                <FilterChip
                  key={theme.value}
                  label={theme.label}
                  active={themes.includes(theme.value)}
                  onClick={() => toggleTheme(theme.value)}
                />
              ))}
            </ChoiceGroup>

            <div className="grid gap-4 md:grid-cols-2">
              <Field label="画像">
                <div className="space-y-2">
                  <label className="flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-2xl border border-cyan-200/25 bg-cyan-200/[0.08] px-4 text-sm font-semibold text-cyan-50 transition hover:bg-cyan-200/[0.14]">
                    <Upload className="h-4 w-4" />
                    手元の画像を選ぶ
                    <input
                      type="file"
                      accept="image/*"
                      className="sr-only"
                      onChange={(event) => handleImageFile(event.target.files?.[0])}
                    />
                  </label>
                  <input
                    value={image.startsWith("data:") ? "" : image}
                    onChange={(event) => setImage(event.target.value)}
                    placeholder="画像URLでもOK"
                    className="h-12 w-full rounded-2xl border border-white/10 bg-white/[0.06] px-4 text-white outline-none placeholder:text-slate-500 focus:border-cyan-200/50"
                  />
                  {image.startsWith("data:") ? (
                    <p className="text-xs leading-5 text-cyan-100">選んだ画像をこのスポットに使います。</p>
                  ) : null}
                  {imageError ? <p className="text-xs leading-5 text-rose-200">{imageError}</p> : null}
                </div>
              </Field>
              <Field label="タグ">
                <input
                  value={tagsText}
                  onChange={(event) => setTagsText(event.target.value)}
                  placeholder="海, 星空, 恋人と行きたい"
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

            <div className="grid gap-4 md:grid-cols-2">
              <Field label="誰と行きたい">
                <input
                  value={companion}
                  onChange={(event) => setCompanion(event.target.value)}
                  placeholder="恋人、友達、家族、ひとり..."
                  className="h-12 w-full rounded-2xl border border-white/10 bg-white/[0.06] px-4 text-white outline-none placeholder:text-slate-500 focus:border-cyan-200/50"
                />
              </Field>
              <Field label="次にやること">
                <input
                  value={firstStepMemo}
                  onChange={(event) => setFirstStepMemo(event.target.value)}
                  placeholder="航空券を調べる、ベストシーズンを調べる、ホテル候補を控える..."
                  className="h-12 w-full rounded-2xl border border-white/10 bg-white/[0.06] px-4 text-white outline-none placeholder:text-slate-500 focus:border-cyan-200/50"
                />
              </Field>
            </div>

            <Field label="キャッチコピー">
              <input
                value={catchCopy}
                onChange={(event) => setCatchCopy(event.target.value)}
                placeholder="例: 一生に一度、星が海に落ちる夜を見に行く。"
                className="h-12 w-full rounded-2xl border border-white/10 bg-white/[0.06] px-4 text-white outline-none placeholder:text-slate-500 focus:border-cyan-200/50"
              />
            </Field>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  行きたい度
                </p>
                <span className="text-sm font-semibold text-cyan-100">{wishLevel}/5</span>
              </div>
              <input
                type="range"
                min={1}
                max={5}
                value={wishLevel}
                onChange={(event) => setWishLevel(Number(event.target.value))}
                className="w-full accent-cyan-200"
              />
            </div>

            <ChoiceGroup label="行きたい季節">
              {seasonOptions.map((season) => (
                <FilterChip
                  key={season}
                  label={season}
                  active={bestSeason.includes(season)}
                  onClick={() => toggleSeason(season)}
                />
              ))}
            </ChoiceGroup>

            <ChoiceGroup label="見たい時間帯">
              {bestTimeOptions.map((time) => (
                <FilterChip key={time} label={time} active={bestTime.includes(time)} onClick={() => toggleBestTime(time)} />
              ))}
            </ChoiceGroup>

            <ChoiceGroup label="ステータス">
              {statusOptions.map((item) => (
                <FilterChip
                  key={item.value}
                  label={item.label}
                  active={status === item.value}
                  onClick={() => setStatus(item.value)}
                />
              ))}
            </ChoiceGroup>
          </div>

          <div className="sticky bottom-0 z-20 -mx-5 mt-6 border-t border-white/10 bg-slate-950/92 p-4 backdrop-blur-xl md:hidden">
            <Button type="submit" size="lg" className="w-full" disabled={!name.trim() && !sourceUrl.trim()}>
              {saved ? <Check className="h-5 w-5" /> : <Sparkles className="h-5 w-5" />}
              {saved ? "この景色を、あなたの地図に残しました" : editingSpot ? "変更を反映" : "My Atlasに残す"}
            </Button>
          </div>
        </div>

        <aside className="border-t border-white/10 bg-white/[0.045] p-5 pb-6 md:max-h-[92vh] md:overflow-y-auto md:border-l md:border-t-0 md:p-7">
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
              <p className="text-lg font-semibold leading-8 text-white">
                {preview.catchCopy || "いつか、を本当に行く日に変える景色。"}
              </p>
              <div className="flex flex-wrap gap-2">
                {(preview.tags?.length ? preview.tags : ["あとで整理"]).map((tag) => (
                  <Badge key={tag}>#{tag}</Badge>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <PreviewMetric label="季節" value={preview.bestSeason?.join(" / ") || "未設定"} />
                <PreviewMetric label="時間帯" value={preview.bestTime?.join(" / ") || "未設定"} />
                <PreviewMetric label="行きたい度" value={`${preview.wishLevel ?? wishLevel}/5`} />
                <PreviewMetric label="状態" value={mySpotStatusLabels[(preview.status ?? "someday") as MySpotStatus]} />
                <PreviewMetric
                  label="地図"
                  value={typeof preview.latitude === "number" && typeof preview.longitude === "number" ? "表示できます" : "位置未設定"}
                />
                <PreviewMetric label="出典" value={preview.sourceType || "other"} />
              </div>
              {preview.memo ? (
                <p className="rounded-2xl border border-white/10 bg-white/[0.05] p-4 text-sm leading-7 text-slate-300">
                  {preview.memo}
                </p>
              ) : null}
              {preview.reason ? (
                <div className="rounded-2xl border border-cyan-200/15 bg-cyan-200/[0.07] p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-cyan-100/75">行きたい理由</p>
                  <p className="mt-2 text-sm leading-7 text-white">{preview.reason}</p>
                </div>
              ) : null}
              {preview.activities?.length ? (
                <div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">そこでやりたいこと</p>
                  <div className="flex flex-wrap gap-2">
                    {preview.activities.map((activity) => (
                      <Badge key={activity} className="bg-white/[0.08] text-slate-100">
                        {activity}
                      </Badge>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          </div>

          <Button type="submit" size="lg" className="sticky bottom-3 z-10 mt-5 hidden w-full md:inline-flex" disabled={!name.trim() && !sourceUrl.trim()}>
            {saved ? <Check className="h-5 w-5" /> : <Sparkles className="h-5 w-5" />}
            {saved ? "この景色を、あなたの地図に残しました" : editingSpot ? "変更を反映" : "My Atlasに残す"}
          </Button>
          <p className="mt-3 text-xs leading-6 text-slate-400">
            本物のSNS連携や投稿解析は使わず、入力内容とローカルデータで整理しています。
          </p>
        </aside>
      </form>
    </div>
  );
}

function fileToCompressedDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Failed to read image"));
    reader.onload = () => {
      const image = new Image();
      image.onerror = () => reject(new Error("Failed to load image"));
      image.onload = () => {
        const maxSize = 1400;
        const scale = Math.min(1, maxSize / Math.max(image.width, image.height));
        const width = Math.max(1, Math.round(image.width * scale));
        const height = Math.max(1, Math.round(image.height * scale));
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const context = canvas.getContext("2d");
        if (!context) {
          reject(new Error("Canvas is not available"));
          return;
        }
        context.drawImage(image, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", 0.84));
      };
      image.src = String(reader.result);
    };
    reader.readAsDataURL(file);
  });
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

function ChoiceGroup({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
        {label}
      </p>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
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

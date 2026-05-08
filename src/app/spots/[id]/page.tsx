import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Camera,
  Clock,
  Compass,
  Luggage,
  MapPin,
  ShieldAlert,
  Sparkles,
  SunMedium
} from "lucide-react";
import { spots, Spot } from "@/data/spots";
import { Badge } from "@/components/ui/badge";
import { GlassPanel } from "@/components/ui/glass-panel";
import { buttonVariants } from "@/components/ui/button";
import { ItineraryGenerator } from "@/components/itinerary-generator";
import { SpotCard } from "@/components/spot-card";
import { WishlistButton } from "@/components/wishlist-button";
import { budgetLabel, difficultyLabel, getNearbySpots } from "@/lib/utils";

export function generateStaticParams() {
  return spots.map((spot) => ({ id: spot.id }));
}

export function generateMetadata({ params }: { params: { id: string } }) {
  const spot = spots.find((item) => item.id === params.id);
  return {
    title: spot ? `${spot.name} | ZEKKEI ATLAS` : "Spot | ZEKKEI ATLAS",
    description: spot?.description
  };
}

export default function SpotDetailPage({ params }: { params: { id: string } }) {
  const spot = spots.find((item) => item.id === params.id);
  if (!spot) notFound();

  const nearby = getNearbySpots(spot, spots);
  const packing = getPackingList(spot);
  const cautions = getCautions(spot);

  return (
    <main className="min-h-screen bg-atlas-ink text-white">
      <section className="relative min-h-[88svh] overflow-hidden">
        <img src={spot.image} alt={spot.name} className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/70 to-slate-950/25" />
        <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-atlas-ink to-transparent" />
        <div className="relative z-10 mx-auto flex min-h-[88svh] max-w-7xl flex-col justify-end px-5 pb-14 pt-32 md:px-8">
          <Link href="/map" className={buttonVariants({ variant: "secondary", size: "sm", className: "mb-8 w-fit" })}>
            <ArrowLeft className="h-4 w-4" />
            地図へ戻る
          </Link>
          <div className="max-w-4xl">
            <div className="mb-5 flex flex-wrap gap-2">
              {spot.tags.map((tag) => (
                <Badge key={tag} className="bg-slate-950/40">
                  #{tag}
                </Badge>
              ))}
            </div>
            <p className="mb-3 flex items-center gap-2 text-sm font-medium text-cyan-100">
              <MapPin className="h-4 w-4" />
              {spot.region} / {spot.country}
            </p>
            <h1 className="text-balance text-5xl font-semibold tracking-normal md:text-8xl">
              {spot.name}
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-9 text-slate-200 md:text-xl">
              {spot.description}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <WishlistButton spotId={spot.id} size="lg" />
              <Link href="/ai-planner" className={buttonVariants({ variant: "secondary", size: "lg" })}>
                <Sparkles className="h-5 w-5" />
                AIで旅程相談
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-5 py-12 md:px-8 lg:grid-cols-4">
        <Metric icon={<SunMedium className="h-5 w-5" />} label="Best Season" value={spot.bestSeason.join(" / ")} />
        <Metric icon={<Clock className="h-5 w-5" />} label="Best Time" value={spot.bestTime.join(" / ")} />
        <Metric icon={<Compass className="h-5 w-5" />} label="Difficulty" value={difficultyLabel(spot.difficulty)} />
        <Metric icon={<Camera className="h-5 w-5" />} label="Photo Score" value={`${spot.photoScore}/100`} />
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-5 py-12 md:px-8 lg:grid-cols-[1fr_380px]">
        <div className="space-y-8">
          <GlassPanel className="p-6 md:p-8">
            <h2 className="text-3xl font-semibold">この絶景の楽しみ方</h2>
            <p className="mt-5 text-lg leading-9 text-slate-300">{spot.description}</p>
            <div className="mt-7 grid gap-4 md:grid-cols-3">
              {spot.highlights.map((highlight) => (
                <div key={highlight} className="rounded-3xl border border-white/10 bg-white/[0.06] p-5">
                  <Sparkles className="mb-5 h-5 w-5 text-cyan-100" />
                  <p className="font-medium leading-7 text-white">{highlight}</p>
                </div>
              ))}
            </div>
          </GlassPanel>

          <div className="grid gap-6 md:grid-cols-2">
            <InfoList icon={<Luggage className="h-5 w-5" />} title="持っていくもの" items={packing} />
            <InfoList icon={<ShieldAlert className="h-5 w-5" />} title="注意点" items={cautions} />
          </div>

          <GlassPanel className="p-6 md:p-8">
            <h2 className="text-3xl font-semibold">近くのおすすめスポット</h2>
            <div className="mt-6 grid gap-5 md:grid-cols-3">
              {nearby.map((nearbySpot) => (
                <SpotCard key={nearbySpot.id} spot={nearbySpot} compact />
              ))}
            </div>
          </GlassPanel>
        </div>

        <aside className="space-y-6 lg:sticky lg:top-28 lg:h-fit">
          <ItineraryGenerator spot={spot} />
          <GlassPanel className="p-6">
            <h3 className="text-xl font-semibold">Trip Snapshot</h3>
            <div className="mt-5 space-y-3">
              <Snapshot label="予算感" value={budgetLabel(spot.budgetLevel)} />
              <Snapshot label="おすすめ日数" value={spot.duration} />
              <Snapshot label="旅スタイル" value={spot.travelStyle.slice(0, 3).join(" / ")} />
              <Snapshot label="座標" value={`${spot.latitude.toFixed(2)}, ${spot.longitude.toFixed(2)}`} />
            </div>
          </GlassPanel>
        </aside>
      </section>
    </main>
  );
}

function Metric({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <GlassPanel className="p-5">
      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl border border-cyan-200/20 bg-cyan-200/10 text-cyan-100">
        {icon}
      </div>
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">{label}</p>
      <p className="mt-2 text-lg font-semibold text-white">{value}</p>
    </GlassPanel>
  );
}

function InfoList({
  icon,
  title,
  items
}: {
  icon: React.ReactNode;
  title: string;
  items: string[];
}) {
  return (
    <GlassPanel className="p-6">
      <h2 className="flex items-center gap-2 text-2xl font-semibold">
        <span className="text-cyan-100">{icon}</span>
        {title}
      </h2>
      <div className="mt-5 space-y-3">
        {items.map((item) => (
          <div key={item} className="rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 text-sm leading-7 text-slate-200">
            {item}
          </div>
        ))}
      </div>
    </GlassPanel>
  );
}

function Snapshot({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3">
      <span className="text-sm text-slate-400">{label}</span>
      <span className="text-right text-sm font-medium text-white">{value}</span>
    </div>
  );
}

function getPackingList(spot: Spot) {
  const base = ["モバイルバッテリー", "歩きやすい靴", "薄手の羽織り", "カメラ用の予備バッテリー"];
  if (spot.tags.includes("海")) base.push("日焼け止め", "サングラス", "防水バッグ");
  if (spot.tags.includes("雪") || spot.tags.includes("オーロラ")) base.push("防寒インナー", "手袋", "防水ブーツ");
  if (spot.tags.includes("星空")) base.push("三脚", "赤色ライト", "星空アプリ");
  if (spot.difficulty === "hard") base.push("レインウェア", "行動食", "常備薬");
  return Array.from(new Set(base)).slice(0, 8);
}

function getCautions(spot: Spot) {
  const cautions = [...spot.tips];
  if (spot.bestTime.includes("夜")) cautions.push("夜間移動は明るい時間にルートを確認しておく");
  if (spot.country !== "日本") cautions.push("パスポート残存期間、海外保険、現地通貨の準備を確認する");
  if (spot.difficulty === "hard") cautions.push("天候による中止や遅延を前提に予備日を作る");
  return Array.from(new Set(cautions)).slice(0, 6);
}

"use client";

import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Bot,
  Camera,
  Car,
  Heart,
  Map,
  MessageCircle,
  Plane,
  Search,
  Sparkles,
  SunMedium,
  Trees,
  Waves
} from "lucide-react";
import { popularTags, seasonOptions, spots } from "@/data/spots";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { GlassPanel } from "@/components/ui/glass-panel";
import { FilterChip } from "@/components/filter-chip";
import { AddMySpotModal } from "@/components/add-my-spot-modal";
import { TravelMap } from "@/components/map/TravelMap";
import { SectionHeading } from "@/components/section-heading";
import { SpotCard } from "@/components/spot-card";
import { WishlistButton } from "@/components/wishlist-button";
import { budgetLabel, difficultyLabel } from "@/lib/utils";

const featured = spots
  .filter((spot) => ["hateruma", "uyuni", "cappadocia", "kamikochi", "miyako", "banff"].includes(spot.id))
  .sort((a, b) => b.photoScore - a.photoScore);

const tripStyleCards = [
  { label: "カップル旅", icon: Heart, tone: "from-rose-300/20 to-cyan-200/10" },
  { label: "ひとり旅", icon: Trees, tone: "from-emerald-300/20 to-sky-200/10" },
  { label: "ドライブ旅", icon: Car, tone: "from-amber-300/20 to-cyan-200/10" },
  { label: "海外旅行", icon: Plane, tone: "from-indigo-300/20 to-cyan-200/10" },
  { label: "週末旅", icon: SunMedium, tone: "from-cyan-300/20 to-blue-200/10" },
  { label: "写真旅", icon: Camera, tone: "from-fuchsia-300/20 to-cyan-200/10" },
  { label: "アクティビティ旅", icon: Waves, tone: "from-teal-300/20 to-slate-200/10" },
  { label: "一生に一度の旅", icon: Sparkles, tone: "from-yellow-200/20 to-cyan-200/10" }
];

const seasonalCopy: Record<string, string> = {
  春: "桜、花畑、新緑。やわらかい光で旅の始まりを切り取る季節。",
  夏: "海、星空、離島。青と夜空のコントラストが主役になる季節。",
  秋: "紅葉、雲海、渓谷。朝夕の光がもっともドラマチックに映る季節。",
  冬: "雪景色、温泉、オーロラ。静けさと透明感が旅を深くする季節。"
};

const atlasSteps = [
  {
    title: "SNSで見つけた場所を残す",
    description: "InstagramやX、Google Mapsで気になった場所名やURLを、そのままMy Atlasへ。",
    icon: Search
  },
  {
    title: "行きたい理由をメモする",
    description: "なぜ惹かれたのか、そこで何をしたいのかまで残すから、後で見返しても熱量が消えません。",
    icon: Heart
  },
  {
    title: "自分だけの地図にピンが増える",
    description: "絶景、ホテル、カフェ、海外スポット。行きたい場所が地図上に育っていきます。",
    icon: Map
  },
  {
    title: "いつかを予定に変える",
    description: "AI風の第一歩提案で、季節、予算、次に調べることを整理できます。",
    icon: Sparkles
  }
];

export function HomePage() {
  const [query, setQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSeason, setSelectedSeason] = useState("夏");
  const [selectedMapSpot, setSelectedMapSpot] = useState(featured[0]);

  const seasonalSpots = useMemo(
    () =>
      spots
        .filter((spot) => spot.bestSeason.includes(selectedSeason))
        .sort((a, b) => b.photoScore - a.photoScore)
        .slice(0, 4),
    [selectedSeason]
  );

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setModalOpen(true);
  };

  return (
    <main className="overflow-hidden bg-atlas-ink text-white">
      <section className="relative min-h-[100svh] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=2200&q=90"
          alt="星空と山岳湖の絶景"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="hero-vignette absolute inset-0" />
        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-atlas-ink to-transparent" />

        <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-7xl flex-col justify-end px-5 pb-10 pt-32 md:px-8 md:pb-14">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75 }}
            className="max-w-5xl"
          >
            <Badge className="mb-6 border-cyan-200/40 bg-cyan-200/[0.12] text-cyan-50">
              ZEKKEI ATLAS / Private Travel Map
            </Badge>
            <h1 className="text-balance text-6xl font-semibold tracking-normal text-white md:text-8xl lg:text-9xl">
              いつか行きたいを、後悔にしない。
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-9 text-slate-200 md:text-2xl">
              SNSで見つけた景色、ふと思い出した旅先、人生で見たい場所を、自分だけの地図に残そう。
            </p>
            <p className="mt-4 max-w-3xl text-sm leading-8 text-slate-300 md:text-base">
              ZEKKEI ATLASは、行きたい場所を保存し、理由ややりたいことまで整理して、“本当に行く”ための旅マップを作れるアプリです。
            </p>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18, duration: 0.65 }}
            onSubmit={handleSearch}
            className="glass-highlight mt-8 flex max-w-4xl flex-col gap-3 rounded-[28px] border border-white/[0.14] bg-slate-950/[0.42] p-3 shadow-glass backdrop-blur-2xl md:flex-row md:items-center"
          >
            <label className="flex min-h-14 flex-1 items-center gap-3 rounded-2xl bg-white/[0.06] px-4">
              <Search className="h-5 w-5 text-cyan-100" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="InstagramやXで見つけた場所名・URLを貼り付け"
                className="h-12 w-full bg-transparent text-base text-white outline-none placeholder:text-slate-400"
              />
            </label>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link href="/map" className={buttonVariants({ variant: "primary", size: "lg", className: "w-full sm:w-auto" })}>
                <Map className="h-5 w-5" />
                自分の旅地図を作る
              </Link>
              <Button type="submit" variant="secondary" size="lg" className="w-full sm:w-auto">
                <Sparkles className="h-5 w-5" />
                最初の景色を残す
              </Button>
            </div>
          </motion.form>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.34, duration: 0.8 }}
            className="mt-8 flex gap-3 overflow-x-auto pb-2"
          >
            {popularTags.map((tag) => (
              <Link
                key={tag}
                href={`/map?tag=${encodeURIComponent(tag)}`}
                className="shrink-0 rounded-full border border-white/[0.14] bg-white/10 px-4 py-2 text-sm text-slate-100 backdrop-blur-xl transition hover:border-cyan-200/50 hover:bg-cyan-200/[0.12]"
              >
                #{tag}
              </Link>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20 md:px-8">
        <div className="mb-10 grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
          <SectionHeading
            eyebrow="How It Grows"
            title="行きたい気持ちが、地図に育っていく。"
            description="保存で終わらせず、理由、やりたいこと、次の一歩まで残す。ZEKKEI ATLASは、憧れを予定に近づけるプライベート旅マップです。"
          />
          <div className="rounded-[30px] border border-amber-200/20 bg-amber-200/[0.07] p-5 text-sm leading-7 text-amber-50 shadow-glass">
            Google Mapsの代替ではありません。公開SNSでもありません。自分だけが見返せる、人生で見たい景色のためのトラベルノートです。
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {atlasSteps.map((step, index) => {
            const Icon = step.icon;
            return (
              <GlassPanel key={step.title} className="p-5">
                <div className="mb-8 flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-200/25 bg-cyan-200/[0.11] text-cyan-100">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                    Step {index + 1}
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-white">{step.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-300">{step.description}</p>
              </GlassPanel>
            );
          })}
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-5 py-24 md:px-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
        <SectionHeading
          eyebrow="AI as a Companion"
          title="行きたい気持ちを、旅の第一歩へ。"
          description="保存した場所や、行きたい理由、季節、同行者の気分をもとに、AIが次の旅の第一歩を整理します。"
        />
        <GlassPanel className="p-5 md:p-7">
          <div className="space-y-5">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10">
                <MessageCircle className="h-5 w-5 text-cyan-100" />
              </div>
              <div className="rounded-3xl rounded-tl-sm bg-white/10 px-5 py-4 text-sm leading-7 text-slate-100">
                My Atlasに保存した沖縄の海と星空スポットを、2泊3日の候補に整理して
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-cyan-200/40 bg-cyan-200/[0.15]">
                <Bot className="h-5 w-5 text-cyan-100" />
              </div>
              <div className="rounded-3xl rounded-tl-sm border border-cyan-200/20 bg-cyan-200/10 px-5 py-4 text-sm leading-7 text-cyan-50">
                この場所を本当に行くなら、まずはここから。波照間島は新月前後、石垣島は移動の拠点、宮古島はドライブの日として組み立てられます。
              </div>
            </div>
            <div className="flex flex-wrap gap-2 pt-2">
              {["彼女と行く絶景", "夏の海", "星空が見える場所", "車なしで行ける場所", "2泊3日で行ける場所", "写真映え重視", "一生に一度の絶景"].map((chip) => (
                <Link
                  key={chip}
                  href={`/ai-planner?prompt=${encodeURIComponent(chip)}`}
                  className="rounded-full border border-white/[0.12] bg-white/[0.06] px-3 py-2 text-xs text-slate-200 transition hover:border-cyan-200/40 hover:bg-cyan-200/10"
                >
                  {chip}
                </Link>
              ))}
            </div>
          </div>
        </GlassPanel>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-12 md:px-8">
        <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            eyebrow="Starter Spots"
            title="まずは、行きたい景色を1つ残してみる。"
            description="気になる絶景をMy Atlasに追加すると、あなた専用の旅地図にピンが増えていきます。"
          />
          <Link href="/map" className={buttonVariants({ variant: "outline", size: "md" })}>
            すべて見る
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {featured.slice(0, 6).map((spot) => (
            <SpotCard key={spot.id} spot={spot} />
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-5 py-24 md:px-8 lg:grid-cols-[1.25fr_0.75fr]">
        <div>
          <SectionHeading
            eyebrow="Map Preview"
            title="行きたい場所が、地図に増えていく。"
            description="SNSで見つけた場所も、ふと思い出した旅先も、My Atlasに残せば、自分だけの旅地図として育っていきます。"
          />
          <div className="mt-8">
            <TravelMap
              spots={featured}
              selectedSpotId={selectedMapSpot.id}
              onSelect={setSelectedMapSpot}
              onReset={() => setSelectedMapSpot(featured[0])}
              className="min-h-[520px]"
            />
          </div>
        </div>
        <GlassPanel className="self-end p-6">
          <img
            src={selectedMapSpot.image}
            alt={selectedMapSpot.name}
            className="h-64 w-full rounded-[22px] object-cover"
          />
          <div className="mt-6">
            <div className="mb-3 flex flex-wrap gap-2">
              {selectedMapSpot.tags.slice(0, 3).map((tag) => (
                <Badge key={tag}>{tag}</Badge>
              ))}
            </div>
            <h3 className="text-3xl font-semibold text-white">{selectedMapSpot.name}</h3>
            <p className="mt-2 text-sm text-cyan-100">
              {selectedMapSpot.region} / {selectedMapSpot.country}
            </p>
            <p className="mt-4 leading-7 text-slate-300">{selectedMapSpot.description}</p>
            <div className="mt-6 grid grid-cols-2 gap-3 text-sm">
              <Info label="Season" value={selectedMapSpot.bestSeason.join(" / ")} />
              <Info label="Time" value={selectedMapSpot.bestTime.join(" / ")} />
              <Info label="Difficulty" value={difficultyLabel(selectedMapSpot.difficulty)} />
              <Info label="Budget" value={budgetLabel(selectedMapSpot.budgetLevel)} />
            </div>
            <div className="mt-6 flex gap-3">
              <WishlistButton spotId={selectedMapSpot.id} label="この景色を残す" savedLabel="My Atlasに追加済み" className="flex-1" />
              <Link href={`/spots/${selectedMapSpot.id}`} className={buttonVariants({ variant: "primary", size: "md", className: "flex-1" })}>
                詳細を見る
              </Link>
            </div>
          </div>
        </GlassPanel>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16 md:px-8">
        <div className="mb-8 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            eyebrow="Seasonal Discovery"
            title="季節で、見える景色は変わる。"
            description={seasonalCopy[selectedSeason]}
          />
          <div className="flex gap-2 overflow-x-auto pb-1">
            {seasonOptions.map((season) => (
              <FilterChip
                key={season}
                label={season}
                active={selectedSeason === season}
                onClick={() => setSelectedSeason(season)}
              />
            ))}
          </div>
        </div>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {seasonalSpots.map((spot) => (
            <SpotCard key={spot.id} spot={spot} compact />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-24 md:px-8">
        <SectionHeading
          eyebrow="Trip Style"
          title="旅のスタイルから、景色を選び直す。"
          description="誰と、どう移動して、どんな温度感で過ごしたいか。目的地より先に、旅の感覚から選べます。"
        />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {tripStyleCards.map((style) => {
            const Icon = style.icon;
            const count = spots.filter((spot) => spot.travelStyle.includes(style.label)).length;
            return (
              <Link
                key={style.label}
                href={`/map?style=${encodeURIComponent(style.label)}`}
                className="group rounded-[28px] border border-white/[0.12] bg-white/[0.065] p-5 shadow-glass transition hover:-translate-y-1 hover:border-cyan-200/40"
              >
                <div className={`mb-8 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/[0.12] bg-gradient-to-br ${style.tone}`}>
                  <Icon className="h-6 w-6 text-cyan-100" />
                </div>
                <h3 className="text-xl font-semibold text-white">{style.label}</h3>
                <p className="mt-2 text-sm text-slate-400">{count} spots curated</p>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="px-5 pb-20 md:px-8">
        <div className="relative mx-auto min-h-[420px] max-w-7xl overflow-hidden rounded-[36px] border border-white/[0.12] p-8 shadow-glass md:p-14">
          <img
            src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1800&q=90"
            alt="夕日に照らされる旅路"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/75 to-slate-950/30" />
          <div className="relative z-10 max-w-2xl">
            <Badge className="mb-5 border-cyan-200/40 bg-cyan-200/[0.12] text-cyan-50">
              Next Journey
            </Badge>
            <h2 className="text-balance text-4xl font-semibold tracking-normal text-white md:text-6xl">
              行きたい場所を、忘れないだけで終わらせない。
            </h2>
            <p className="mt-5 text-lg leading-8 text-slate-200">
              保存した景色に、理由と次の一歩を足していく。いつか行きたい場所を、本当に行く予定に変えていきましょう。
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/map" className={buttonVariants({ variant: "primary", size: "lg" })}>
                自分の旅地図を作る
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link href="/ai-planner" className={buttonVariants({ variant: "secondary", size: "lg" })}>
                AIに相談する
                <Sparkles className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <AddMySpotModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        initialName={query.startsWith("http") ? "" : query}
        initialSourceUrl={query.startsWith("http") ? query : ""}
      />
    </main>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white/[0.06] p-4">
      <p className="text-slate-400">{label}</p>
      <p className="mt-1 font-medium text-white">{value}</p>
    </div>
  );
}

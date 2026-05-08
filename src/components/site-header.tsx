"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Compass, Heart, Map, Sparkles } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { useWishlist } from "@/hooks/use-wishlist";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/map", label: "Map" },
  { href: "/ai-planner", label: "AI Planner" },
  { href: "/wishlist", label: "Wishlist" }
];

export function SiteHeader() {
  const pathname = usePathname();
  const { savedIds } = useWishlist();

  return (
    <header className="fixed left-0 right-0 top-0 z-50 px-4 py-4 md:px-8">
      <div className="mx-auto flex max-w-7xl items-center justify-between rounded-full border border-white/[0.12] bg-slate-950/50 px-4 py-3 shadow-glass backdrop-blur-2xl">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full border border-cyan-200/40 bg-cyan-200/[0.15] text-cyan-100">
            <Compass className="h-5 w-5" />
          </span>
          <span>
            <span className="block text-sm font-semibold leading-none tracking-[0.18em] text-white">
              ZEKKEI
            </span>
            <span className="block text-xs font-medium leading-none tracking-[0.22em] text-cyan-100/70">
              ATLAS
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => {
            const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-medium transition",
                  active ? "bg-white text-slate-950" : "text-slate-300 hover:bg-white/10 hover:text-white"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <Link href="/map" className={buttonVariants({ variant: "secondary", size: "sm", className: "hidden md:inline-flex" })}>
            <Map className="h-4 w-4" />
            地図へ
          </Link>
          <Link href="/ai-planner" className={buttonVariants({ variant: "primary", size: "sm", className: "hidden sm:inline-flex" })}>
            <Sparkles className="h-4 w-4" />
            AI相談
          </Link>
          <Link
            href="/wishlist"
            className="relative flex h-10 w-10 items-center justify-center rounded-full border border-white/[0.12] bg-white/10 text-white transition hover:bg-white/20"
            aria-label="保存リスト"
          >
            <Heart className="h-4 w-4" />
            {savedIds.length > 0 ? (
              <span className="absolute -right-1 -top-1 min-w-[1.25rem] rounded-full bg-cyan-200 px-1.5 py-0.5 text-center text-[10px] font-bold text-slate-950">
                {savedIds.length}
              </span>
            ) : null}
          </Link>
        </div>
      </div>
    </header>
  );
}

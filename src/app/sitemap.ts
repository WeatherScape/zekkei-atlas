import type { MetadataRoute } from "next";
import { spots } from "@/data/spots";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://zekkei-atlas.vercel.app";
  const now = new Date();

  return [
    "",
    "/map",
    "/wishlist",
    "/ai-planner",
    ...spots.map((spot) => `/spots/${spot.id}`)
  ].map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified: now,
    changeFrequency: path.startsWith("/spots") ? "monthly" : "weekly",
    priority: path === "" ? 1 : path.startsWith("/spots") ? 0.7 : 0.85
  }));
}

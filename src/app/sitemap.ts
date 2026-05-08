import type { MetadataRoute } from "next";
import { spots } from "@/data/spots";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://zekkei-atlas.vercel.app";
  const now = new Date();
  const routes = [
    "",
    "/map",
    "/wishlist",
    "/ai-planner",
    ...spots.map((spot) => `/spots/${spot.id}`)
  ];

  return routes.map((path) => {
    const isSpotPage = path.startsWith("/spots");

    return {
      url: `${siteUrl}${path}`,
      lastModified: now,
      changeFrequency: isSpotPage ? ("monthly" as const) : ("weekly" as const),
      priority: path === "" ? 1 : isSpotPage ? 0.7 : 0.85
    };
  });
}

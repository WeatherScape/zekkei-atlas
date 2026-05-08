import { Spot } from "@/data/spots";

export type MapPoint = {
  id: string;
  x: number;
  y: number;
  spot: Spot;
};

const WORLD_BOUNDS = {
  minLon: -125,
  maxLon: 145,
  minLat: -25,
  maxLat: 68
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function projectSpotToMap(spot: Spot): MapPoint {
  const x =
    ((spot.longitude - WORLD_BOUNDS.minLon) /
      (WORLD_BOUNDS.maxLon - WORLD_BOUNDS.minLon)) *
    100;
  const y =
    ((WORLD_BOUNDS.maxLat - spot.latitude) /
      (WORLD_BOUNDS.maxLat - WORLD_BOUNDS.minLat)) *
    100;

  return {
    id: spot.id,
    x: clamp(x, 5, 95),
    y: clamp(y, 8, 90),
    spot
  };
}

export function distanceBetweenSpots(a: Spot, b: Spot) {
  const toRad = (value: number) => (value * Math.PI) / 180;
  const earthRadiusKm = 6371;
  const dLat = toRad(b.latitude - a.latitude);
  const dLon = toRad(b.longitude - a.longitude);
  const lat1 = toRad(a.latitude);
  const lat2 = toRad(b.latitude);

  const haversine =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

  return earthRadiusKm * 2 * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine));
}

export function getRelatedTrailSpots(selected: Spot, spots: Spot[]) {
  return spots
    .filter((spot) => spot.id !== selected.id)
    .map((spot) => {
      const sharedTags = spot.tags.filter((tag) => selected.tags.includes(tag)).length;
      const sharedSeason = spot.bestSeason.filter((season) =>
        selected.bestSeason.includes(season)
      ).length;
      const sameCountry = spot.country === selected.country ? 2 : 0;
      const distanceScore = Math.max(0, 6 - distanceBetweenSpots(selected, spot) / 450);
      return {
        spot,
        score: sharedTags * 3 + sharedSeason + sameCountry + distanceScore
      };
    })
    .sort((a, b) => b.score - a.score || b.spot.photoScore - a.spot.photoScore)
    .slice(0, 3)
    .map(({ spot }) => spot);
}

export function buildDensityGroups(points: MapPoint[], threshold = 8) {
  const visited = new Set<string>();
  const groups: MapPoint[][] = [];

  points.forEach((point) => {
    if (visited.has(point.id)) return;
    const group = points.filter((candidate) => {
      if (visited.has(candidate.id)) return false;
      const dx = candidate.x - point.x;
      const dy = candidate.y - point.y;
      return Math.sqrt(dx * dx + dy * dy) <= threshold;
    });
    group.forEach((item) => visited.add(item.id));
    groups.push(group);
  });

  return groups.map((group) => {
    const center = group.reduce(
      (acc, point) => ({ x: acc.x + point.x / group.length, y: acc.y + point.y / group.length }),
      { x: 0, y: 0 }
    );
    return { center, points: group };
  });
}

export function spreadClusterPoint(
  point: MapPoint,
  group: MapPoint[],
  index: number,
  selected: boolean
) {
  if (group.length <= 1 || selected) return point;

  const radius = group.length > 6 ? 5.4 : 3.8;
  const angle = (index / group.length) * Math.PI * 2 - Math.PI / 2;
  const ring = group.length > 8 && index % 2 === 0 ? 1.35 : 1;

  return {
    ...point,
    x: clamp(point.x + Math.cos(angle) * radius * ring, 4, 96),
    y: clamp(point.y + Math.sin(angle) * radius * ring, 7, 91)
  };
}

import { MapExplorer } from "@/components/map-explorer";

type MapPageProps = {
  searchParams?: {
    search?: string | string[];
    q?: string | string[];
    tag?: string | string[];
    style?: string | string[];
    season?: string | string[];
    time?: string | string[];
    scope?: string | string[];
    difficulty?: string | string[];
  };
};

function getParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

export default function MapPage({ searchParams }: MapPageProps) {
  return (
    <MapExplorer
      initialSearch={getParam(searchParams?.search) || getParam(searchParams?.q)}
      initialTag={getParam(searchParams?.tag)}
      initialStyle={getParam(searchParams?.style)}
      initialSeason={getParam(searchParams?.season)}
      initialTime={getParam(searchParams?.time)}
      initialScope={getParam(searchParams?.scope)}
      initialDifficulty={getParam(searchParams?.difficulty)}
    />
  );
}

import { AiPlannerPage } from "@/components/ai-planner-page";

type AiPlannerRouteProps = {
  searchParams?: {
    prompt?: string | string[];
  };
};

export default function Page({ searchParams }: AiPlannerRouteProps) {
  const prompt = Array.isArray(searchParams?.prompt)
    ? searchParams?.prompt[0] ?? ""
    : searchParams?.prompt ?? "";

  return <AiPlannerPage initialPrompt={prompt} />;
}

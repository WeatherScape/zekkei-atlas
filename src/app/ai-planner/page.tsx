import { Suspense } from "react";
import { AiPlannerPage } from "@/components/ai-planner-page";

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-atlas-ink" />}>
      <AiPlannerPage />
    </Suspense>
  );
}

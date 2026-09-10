import { createFileRoute } from "@tanstack/react-router";

import { ChaosZone } from "@/components/ChaosZone";

export const Route = createFileRoute("/events/non-technical")({
  head: () => ({
    meta: [
      { title: "Non-Technical Events | EXCLADE 2K26" },
      { name: "description", content: "Explore the non-technical event operations of EXCLADE 2K26." },
    ],
  }),
  component: NonTechnicalEventsPage,
});

function NonTechnicalEventsPage() {
  return <ChaosZone />;
}
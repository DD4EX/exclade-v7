import { createFileRoute } from "@tanstack/react-router";

import { TechnicalOperations } from "@/components/TechnicalOperations";

export const Route = createFileRoute("/events/technical")({
  head: () => ({
    meta: [
      { title: "Technical Events | EXCLADE 2K26" },
      { name: "description", content: "Explore the technical event operations of EXCLADE 2K26." },
    ],
  }),
  component: TechnicalEventsPage,
});

function TechnicalEventsPage() {
  return <TechnicalOperations />;
}
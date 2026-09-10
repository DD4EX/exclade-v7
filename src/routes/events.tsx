import { createFileRoute, Outlet } from "@tanstack/react-router";

const title = "Events | EXCLADE 2K26 Operations";
const description =
  "Choose a technical or non-technical EXCLADE 2K26 event operation.";

export const Route = createFileRoute("/events")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: EventsPage,
});

function EventsPage() {
  return <Outlet />;
}

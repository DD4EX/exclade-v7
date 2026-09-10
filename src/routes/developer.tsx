import { createFileRoute } from "@tanstack/react-router";

import { DeveloperPage } from "@/components/DeveloperPage";

const title = "Developer | EXCLADE 2K26";
const description = "Developer profile and creative technology showcase for EXCLADE 2K26.";

export const Route = createFileRoute("/developer")({
    head: () => ({
        meta: [
            { title },
            { name: "description", content: description },
            { property: "og:title", content: title },
            { property: "og:description", content: description },
        ],
    }),
    component: DeveloperRoute,
});

function DeveloperRoute() {
    return <DeveloperPage />;
}

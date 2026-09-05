import { createFileRoute } from "@tanstack/react-router";

import { ContactSection } from "@/components/ContactSection";

const title = "Contact | EXCLADE 2K26 Communication Terminal";
const description =
  "Contact the EXCLADE 2K26 crew for event questions, registration support, media requests and coordination at KSR College of Engineering.";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  return <ContactSection />;
}
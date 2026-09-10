import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

import { CinematicLoader } from "@/components/CinematicLoader";

export const Route = createFileRoute("/intro")({
  head: () => ({
    meta: [
      { title: "Introduction | EXCLADE 2K26" },
      { name: "description", content: "The EXCLADE 2K26 symposium introduction." },
    ],
  }),
  component: IntroPage,
});

function IntroPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = window.setTimeout(() => navigate({ to: "/", replace: true }), 3000);
    return () => window.clearTimeout(timer);
  }, [navigate]);

  return (
    <>
      <CinematicLoader />
      <Link className="intro-skip" to="/" replace>SKIP INTRO <span aria-hidden="true">→</span></Link>
    </>
  );
}
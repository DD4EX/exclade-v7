import { createFileRoute, Link } from "@tanstack/react-router";

import { LabDashboard } from "@/components/LabDashboard";
import { eventDateRangeLabel } from "@/data/eventDates";

export const Route = createFileRoute("/events/")({
  component: EventsIndexPage,
});

function EventsIndexPage() {
  return (
    <>
      <LabDashboard />
      <section className="reginfo-cta" aria-label="Full schedule">
        <p>{eventDateRangeLabel} — see every event with its venue, timing and team size.</p>
        <div className="reginfo-cta-actions">
          <Link className="primary-cta" to="/schedule">VIEW FULL SCHEDULE <span aria-hidden="true">→</span></Link>
          <Link className="secondary-cta" to="/registration">[ HOW TO REGISTER ]</Link>
        </div>
      </section>
    </>
  );
}
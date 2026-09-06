import { useEffect, useState } from "react";
import { Clock3, MapPin, X } from "lucide-react";
import { operationSchedule, type OperationScheduleEvent } from "@/data/operationSchedule";

type ScheduleDay = "day1" | "day2";

export function OperationSchedule() {
  const [activeDay, setActiveDay] = useState<ScheduleDay>("day1");
  const [visibleDay, setVisibleDay] = useState<ScheduleDay>("day1");
  const [switching, setSwitching] = useState(false);
  const [selectedVenue, setSelectedVenue] = useState<OperationScheduleEvent | null>(null);

  useEffect(() => {
    if (!switching) return;
    const timer = window.setTimeout(() => {
      setVisibleDay(activeDay);
      setSwitching(false);
    }, 380);
    return () => window.clearTimeout(timer);
  }, [activeDay, switching]);

  const selectDay = (day: ScheduleDay) => {
    if (day === activeDay || switching) return;
    setActiveDay(day);
    setSwitching(true);
  };

  const events = operationSchedule[visibleDay];
  const dayLabel = visibleDay === "day1" ? "DAY - 1" : "DAY - 2";

  return (
    <section className="schedule-section" aria-labelledby="schedule-title">
      <div className="schedule-scan-line" aria-hidden="true" />
      <div className="schedule-inner">
        <div className="schedule-heading reveal-on-scroll">
          <div>
            <p className="eyebrow">EVENT LOCATIONS &amp; TIMINGS</p>
            <h2 id="schedule-title">OPERATION SCHEDULE</h2>
          </div>
          <span className="schedule-system">EXCLADE 2K26 // VENUE DATABASE // SCHEDULE LOCKED</span>
        </div>

        <div className="schedule-switcher" aria-label="Choose event day">
          <div className="schedule-switcher-copy" aria-live="polite">
            <span>{switching ? "DATABASE RECONFIGURATION..." : "DATABASE ACTIVE"}</span>
            <strong>{dayLabel}</strong>
          </div>
          <div className="schedule-tabs" role="tablist" aria-label="Operation schedule days">
            {(["day1", "day2"] as const).map((day, index) => (
              <button
                key={day}
                className={`schedule-tab${activeDay === day ? " is-active" : ""}`}
                type="button"
                role="tab"
                aria-selected={activeDay === day}
                onClick={() => selectDay(day)}
              >
                DAY 0{index + 1}
              </button>
            ))}
          </div>
        </div>

        <div className={`schedule-database${switching ? " is-switching" : ""}`} aria-live="polite">
          <div className="schedule-database-topline">
            <span>{dayLabel}</span>
            <span>{events.length} EVENTS FOUND</span>
          </div>
          <div className="schedule-card-grid">
            {events.map((event, index) => (
              <article className="schedule-card" key={`${visibleDay}-${event.name}`} style={{ animationDelay: `${index * 70}ms` }}>
                <div className="schedule-card-topline">
                  <span>EXC-{visibleDay === "day1" ? "D1" : "D2"}-{String(index + 1).padStart(2, "0")}</span>
                  <span>EVENT {String(index + 1).padStart(2, "0")}</span>
                </div>
                <h3>{event.name}</h3>
                <dl className="schedule-facts">
                  <div>
                    <dt><MapPin aria-hidden="true" size={13} /> VENUE</dt>
                    <dd>{event.venue}</dd>
                  </div>
                  <div>
                    <dt><Clock3 aria-hidden="true" size={13} /> TIME</dt>
                    <dd>{event.time}</dd>
                  </div>
                </dl>
                <button type="button" className="schedule-locate" onClick={() => setSelectedVenue(event)}>
                  LOCATE VENUE <span aria-hidden="true">→</span>
                </button>
              </article>
            ))}
          </div>
        </div>

        <div className="schedule-lockup reveal-on-scroll">
          <span>SCHEDULE LOCKED</span>
          <strong>EXCLADE 2K26</strong>
          <p>KSR COLLEGE OF ENGINEERING<br />DEPARTMENT OF CSE (IoT)</p>
          <em>KNOW YOUR VENUE.<br />KNOW YOUR OPERATION.</em>
        </div>
      </div>

      {selectedVenue && (
        <div className="schedule-venue-overlay" role="presentation" onClick={() => setSelectedVenue(null)}>
          <div className="schedule-venue-modal" role="dialog" aria-modal="true" aria-labelledby="venue-modal-title" onClick={(event) => event.stopPropagation()}>
            <button type="button" className="schedule-modal-close" aria-label="Close venue information" onClick={() => setSelectedVenue(null)}>
              <X aria-hidden="true" size={16} />
            </button>
            <p className="eyebrow">VENUE DATABASE</p>
            <h3 id="venue-modal-title">{selectedVenue.venue}</h3>
            <dl className="schedule-modal-facts">
              <div><dt>EVENT</dt><dd>{selectedVenue.name}</dd></div>
              <div><dt>TIME</dt><dd>{selectedVenue.time}</dd></div>
            </dl>
            <p className="schedule-modal-note">Venue information only. A campus map link has not been supplied.</p>
          </div>
        </div>
      )}
    </section>
  );
}
import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { EventFileModal } from "@/components/EventFileModal";
import { technicalEvents, type TechnicalEvent } from "@/data/technicalEvents";
import { catalogEvents, registrationEventIdFor } from "@/data/eventCatalog";
import { technicalCoordinators } from "@/data/crew";

export function TechnicalOperations() {
  const [openEvent, setOpenEvent] = useState<TechnicalEvent | null>(null);
  const acceptOperation = (event: TechnicalEvent) => {
    window.location.assign(`/register?event=${encodeURIComponent(registrationEventIdFor(event.name))}`);
  };

  return (
    <section id="events" className="tech-section" aria-labelledby="tech-title">
      <div className="tech-traces" aria-hidden="true" />
      <div className="tech-inner">
        <div className="lab-heading reveal-on-scroll">
          <div>
            <p className="eyebrow">TECHNICAL OPERATIONS</p>
            <h2 id="tech-title">ENGINEER. CREATE. DECODE.</h2>
          </div>
          <span className="file-count">05 CLASSIFIED FILES</span>
        </div>

        <div className="tech-layout">
          <div className="case-grid">
            {technicalEvents.map((event, index) => {
              const Icon = event.icon;
              const summary = event.details.split("\n")[0];
              const catalog = catalogEvents.find((item) => item.id === registrationEventIdFor(event.name));
              const coordinator = technicalCoordinators.find((person) => person.assignment === event.name)?.name ?? "EXCLADE OPERATIONS";
              return (
                <article
                  className="case-card reveal-on-scroll"
                  key={event.id}
                  style={{ animationDelay: `${index * 110}ms` }}
                >
                  <span className="case-scan" aria-hidden="true" />
                  <span className="case-nodes" aria-hidden="true" />
                  <div className="case-topline">
                    <span className="case-number">CASE {event.id}</span>
                    <span className="case-code">{event.code}</span>
                  </div>
                  <span className="case-icon"><Icon aria-hidden="true" size={22} strokeWidth={1.5} /></span>
                  <h3>{event.name}</h3>
                  <dl className="case-meta">
                    <div><dt>CLASSIFICATION</dt><dd>{event.category}</dd></div>
                    {catalog && <><div><dt>TIME</dt><dd>{catalog.time}</dd></div><div><dt>VENUE</dt><dd>{catalog.venue}</dd></div></>}
                    <div><dt>COORDINATOR</dt><dd>{coordinator}</dd></div>
                  </dl>
                  <p className="case-desc">{summary}</p>
                  <button type="button" className="case-cta" onClick={() => setOpenEvent(event)}>
                    [ VIEW OPERATION ]
                  </button>
                  <button
                    type="button"
                    className="case-cta"
                    onClick={() => window.location.assign(`/register?event=${encodeURIComponent(registrationEventIdFor(event.name))}`)}
                  >
                    ACCEPT THE OPERATION <span aria-hidden="true">→</span>
                  </button>
                </article>
              );
            })}
          </div>

          <aside className="status-panel reveal-on-scroll" aria-hidden="true">
            <p className="status-title">EXCLADE SYSTEM</p>
            <div>
              <span>OPERATION STATUS</span>
              <strong className="status-online"><i /> ONLINE</strong>
            </div>
            <div>
              <span>TECHNICAL FILES</span>
              <strong>05</strong>
            </div>
            <div>
              <span>ACCESS LEVEL</span>
              <strong>PUBLIC</strong>
            </div>
            <div>
              <span>SYSTEM</span>
              <strong>EXCLADE 2K26</strong>
            </div>
            <span className="status-bars" />
          </aside>
        </div>

          <div className="tech-cta reveal-on-scroll">
           <div className="tech-complete-status" aria-label="Technical operations complete">
             <span>SYSTEM STATUS</span>
             <strong>TECHNICAL OPERATIONS COMPLETE</strong>
             <span>NEXT OPERATION <b>UNLOCKED</b></span>
           </div>
           <h3>ENTER THE CHAOS ZONE</h3>
          <div className="hero-actions">
             <Link className="primary-cta" to="/events/non-technical">ACCEPT THE CHALLENGE <span aria-hidden="true">→</span></Link>
            <Link className="primary-cta" to="/register">REGISTER</Link>
          </div>
        </div>
      </div>

      {openEvent && <EventFileModal event={openEvent} onClose={() => setOpenEvent(null)} onAccept={() => acceptOperation(openEvent)} />}
    </section>
  );
}

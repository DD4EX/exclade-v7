import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import type { TechnicalEvent } from "@/data/technicalEvents";
import type { NonTechnicalEvent } from "@/data/nonTechnicalEvents";
import { allPersonnel, type Person } from "@/data/crew";
import { catalogEvents, registrationEventIdFor } from "@/data/eventCatalog";

type Props = { event: TechnicalEvent | NonTechnicalEvent; onClose: () => void; onAccept: () => void };

export function EventFileModal({ event, onClose, onAccept }: Props) {
  const reduced = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const [stage, setStage] = useState<"accessing" | "granted">(reduced ? "granted" : "accessing");
  const closeRef = useRef<HTMLButtonElement>(null);
  const Icon = event.icon;
  const isOperation = "status" in event;
  const catalog = catalogEvents.find((item) => item.id === registrationEventIdFor(event.name));
  const coordinator = allPersonnel.find((person: Person) => person.assignment?.toUpperCase() === event.name.toUpperCase())?.name;

  useEffect(() => {
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  useEffect(() => {
    if (stage === "granted") return;
    const t = window.setTimeout(() => setStage("granted"), 750);
    return () => window.clearTimeout(t);
  }, [stage]);

  return (
    <div className="file-overlay" onClick={onClose}>
      <div
        className="file-modal"
        role="dialog"
        aria-modal="true"
         aria-label={`${isOperation ? "Operation" : "Case"} ${event.id} — ${event.name}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="file-scan" aria-hidden="true" />
        <div className="file-topline">
           <span className="file-case">{isOperation ? "OPERATION" : "CASE"} {event.id}</span>
           <span className="file-code">{"code" in event ? event.code : "CHAOS-ZONE"}</span>
          <button ref={closeRef} type="button" className="file-x" onClick={onClose} aria-label="Close file">
            <X aria-hidden="true" size={16} />
          </button>
        </div>

        {stage === "accessing" ? (
           <p className="file-accessing" aria-live="polite">ACCESSING {isOperation ? "OPERATION" : "FILE"}…</p>
        ) : (
          <div className="file-body">
            <p className="file-granted">ACCESS GRANTED</p>
            <div className="file-title">
              <span className="file-icon"><Icon aria-hidden="true" size={22} strokeWidth={1.5} /></span>
              <h3>{event.name}</h3>
            </div>
            <dl className="file-facts">
              <div>
                <dt>CLASSIFICATION</dt>
                <dd>{event.category}</dd>
              </div>
              {catalog && <>
                <div><dt>EVENT TIME</dt><dd>{catalog.time}</dd></div>
                <div><dt>VENUE</dt><dd>{catalog.venue}</dd></div>
              </>}
              {coordinator && <div><dt>COORDINATOR</dt><dd>{coordinator}</dd></div>}
            </dl>
            <div className="file-instructions" style={{ whiteSpace: "pre-line", lineHeight: 1.8, fontSize: "0.9rem" }}>
              {event.details}
            </div>
            <button type="button" className="primary-cta file-accept" onClick={onAccept}>
              ACCEPT THE OPERATION <span aria-hidden="true">→</span>
            </button>
            <button type="button" className="secondary-cta file-close" onClick={onClose}>
               [ CLOSE {isOperation ? "OPERATION" : "FILE"} ]
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

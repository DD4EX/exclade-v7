import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { CheckCircle2, LogOut, Mail, RefreshCw, Users } from "lucide-react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { supabase } from "@/integrations/supabase/client";

import { eventDates } from "@/data/eventDates";
import { firebaseAuth } from "@/integrations/firebase/client";

type AdminRegistration = {
  id: string;
  registrationId: string | null;
  fullName: string;
  email: string;
  phone: string;
  college: string;
  department: string;
  year: string;
  teamName: string | null;
  teamLeaderGmail: string | null;
  teamMembers: { name?: string }[];
  events: string[];
  eventDay: number | null;
  registrationAmount: number | null;
  assignedUpiAccount: string | null;
  assignedUpiName: string | null;
  assignedUpiId: string | null;
  paymentNote: string | null;
  screenshotUrl: string | null;
  status: string;
  confirmedAt: string | null;
  detailsSentAt: string | null;
  createdAt: string;
};

type UpiUsage = {
  day: number;
  account_name: string;
  upi_id: string;
  daily_limit: number;
  used_count: number;
};

export const Route = createFileRoute("/admin/dashboard")({
  head: () => ({
    meta: [
      { title: "Registrations | EXCLADE 2K26 Organiser" },
      { name: "description", content: "Private organiser view of EXCLADE 2K26 registrations." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminDashboardPage,
});

function detailsMail(row: AdminRegistration) {
  const day = row.eventDay === 2 ? eventDates[2] : eventDates[1];
  const subject = `EXCLADE 2K26 — Event details for ${row.events.join(", ")}`;
  const body = [
    `Hi ${row.fullName},`,
    "",
    `Your registration for EXCLADE 2K26 is confirmed.`,
    `Event: ${row.events.join(", ")}`,
    `Day: ${day.label}`,
    row.teamName ? `Team: ${row.teamName}` : "",
    "",
    "Please reach your venue 15 minutes before the start time and carry your college ID card.",
    "",
    "— Department of CSE (IoT), KSR College of Engineering",
  ]
    .filter(Boolean)
    .join("\n");
  return `mailto:${row.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

function AdminDashboardPage() {
  const navigate = useNavigate();

  const [rows, setRows] = useState<AdminRegistration[]>([]);
  const [upiUsage, setUpiUsage] = useState<UpiUsage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<"all" | "pending" | "confirmed">("all");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [{ data: registrationData, error: fetchError }, { data: usageData, error: usageError }] = await Promise.all([
        supabase.from("registrations").select("*").order("registration_timestamp", { ascending: false }),
        supabase.from("upi_daily_usage").select("*").gte("usage_date", new Date().toISOString().slice(0, 10)),
      ]);

      if (fetchError) throw fetchError;
      if (usageError) throw usageError;

      setRows(
        (registrationData ?? []).map((row) => ({
          id: row.id,
          registrationId: row.registration_id,
          fullName: row.full_name ?? row.team_leader_name ?? "",
          email: row.email,
          phone: row.phone,
          college: row.college,
          department: row.department,
          year: row.year,
          teamName: row.team_name,
          teamLeaderGmail: row.team_leader_gmail,
          teamMembers: Array.isArray(row.team_members) ? (row.team_members as { name?: string }[]) : [],
          events: row.events ?? [],
          eventDay: row.event_day,
          registrationAmount: row.registration_amount,
          assignedUpiAccount: row.assigned_upi_account,
          assignedUpiName: row.assigned_upi_name,
          assignedUpiId: row.assigned_upi_id,
          paymentNote: row.payment_note,
          screenshotUrl: row.payment_screenshot_url ?? null,
          status: row.status,
          confirmedAt: row.confirmed_at,
          detailsSentAt: row.details_sent_at,
          createdAt: row.registration_timestamp ?? row.created_at,
        })),
      );
      setUpiUsage((usageData ?? []) as UpiUsage[]);
    } catch {
      setError("COULD NOT LOAD REGISTRATIONS");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    return onAuthStateChanged(firebaseAuth, (user) => {
      if (!user) {
        navigate({ to: "/admin", replace: true });
        return;
      }
      void load();
    });
  }, [load, navigate]);

  const visible = useMemo(
    () => (filter === "all" ? rows : rows.filter((row) => row.status === filter)),
    [filter, rows],
  );

  const counts = useMemo(
    () => ({
      total: rows.length,
      confirmed: rows.filter((r) => r.status === "confirmed").length,
      day1: rows.filter((r) => r.eventDay === 1).length,
      day2: rows.filter((r) => r.eventDay === 2).length,
    }),
    [rows],
  );

  const onConfirm = async (row: AdminRegistration) => {
    const next = row.status === "confirmed" ? "pending" : "confirmed";
    await supabase.from("registrations").update({
      status: next,
      confirmed_at: next === "confirmed" ? new Date().toISOString() : null,
    }).eq("id", row.id);
    await load();
  };

  const onSent = async (row: AdminRegistration) => {
    await supabase.from("registrations").update({ details_sent_at: new Date().toISOString() }).eq("id", row.id);
    await load();
  };

  const onLogout = async () => {
    await signOut(firebaseAuth);
    navigate({ to: "/admin", replace: true });
  };

  return (
    <section className="admin-page" aria-labelledby="admin-dash-title">
      <div className="admin-inner">
        <header className="admin-head">
          <div>
            <p className="eyebrow">ORGANISER CONSOLE</p>
            <h1 id="admin-dash-title">REGISTRATIONS</h1>
          </div>
          <div className="admin-head-actions">
            <Link className="secondary-cta" to="/admin/users">
              <Users aria-hidden="true" size={12} /> USERS
            </Link>
            <button type="button" className="secondary-cta" onClick={() => void load()}>
              <RefreshCw aria-hidden="true" size={12} /> REFRESH
            </button>
            <button type="button" className="secondary-cta" onClick={() => void onLogout()}>
              <LogOut aria-hidden="true" size={12} /> SIGN OUT
            </button>
          </div>
        </header>

        <ul className="admin-stats">
          <li>
            <b>{counts.total}</b>
            <span>TOTAL</span>
          </li>
          <li>
            <b>{counts.confirmed}</b>
            <span>CONFIRMED</span>
          </li>
          <li>
            <b>{counts.day1}</b>
            <span>DAY 1</span>
          </li>
          <li>
            <b>{counts.day2}</b>
            <span>DAY 2</span>
          </li>
        </ul>

        <div className="admin-filters" style={{ marginBottom: "1rem" }}>
          {[1, 2].map((day) => {
            const dayUsage = upiUsage.filter((item) => item.day === day);
            const entries = dayUsage.length
              ? dayUsage.map((item) => `${item.account_name} · ${item.used_count} / ${item.daily_limit}`).join("  |  ")
              : "NO USAGE YET";
            return (
              <div key={day} className="admin-chip" style={{ display: "inline-flex", marginRight: "0.5rem" }}>
                DAY {day} — {entries}
              </div>
            );
          })}
        </div>

        <div className="admin-filters">
          {(["all", "pending", "confirmed"] as const).map((key) => (
            <button
              key={key}
              type="button"
              className={filter === key ? "admin-chip is-active" : "admin-chip"}
              onClick={() => setFilter(key)}
            >
              {key.toUpperCase()}
            </button>
          ))}
        </div>

        {error && (
          <p className="register-error" role="alert">
            {error}
          </p>
        )}
        {loading && <p className="admin-muted">LOADING…</p>}
        {!loading && visible.length === 0 && <p className="admin-muted">NO REGISTRATIONS YET.</p>}

        <div className="admin-rows">
          {visible.map((row) => (
            <article className="admin-row" key={row.id}>
              <div className="admin-row-main">
                <h2>{row.fullName}</h2>
                <p className="admin-muted">
                  {row.college} · {row.department} · YEAR {row.year}
                </p>
                <p className="admin-muted">
                  {row.email} · {row.phone}
                </p>
                <p className="admin-row-event">
                  {row.registrationId ?? "—"} · {row.events.join(", ") || "—"} · DAY {row.eventDay ?? "?"}
                  {row.teamName ? ` · TEAM ${row.teamName}` : ""}
                </p>
                {row.teamLeaderGmail && <p className="admin-muted">TEAM LEADER GMAIL: {row.teamLeaderGmail}</p>}
                {row.teamMembers.length > 0 && (
                  <p className="admin-muted">
                    MEMBERS:{" "}
                    {row.teamMembers
                      .map((m) => m.name)
                      .filter(Boolean)
                      .join(", ")}
                  </p>
                )}
                <p className="admin-muted">
                  AMOUNT: ₹{row.registrationAmount ?? "—"} · PAID TO {row.assignedUpiName ?? "—"} ({row.assignedUpiId ?? "—"}) · {new Date(row.createdAt).toLocaleString()}
                </p>
              </div>

              <div className="admin-row-side">
                <span className={`admin-status admin-status-${row.status}`}>
                  {row.status.toUpperCase()}
                </span>
                {row.screenshotUrl && (
                  <a
                    className="admin-link"
                    href={row.screenshotUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    VIEW PAYMENT PROOF ↗
                  </a>
                )}
                <button type="button" className="secondary-cta" onClick={() => void onConfirm(row)}>
                  <CheckCircle2 aria-hidden="true" size={12} />{" "}
                  {row.status === "confirmed" ? "UNDO CONFIRM" : "CONFIRM ATTENDEE"}
                </button>
                <a
                  className="secondary-cta"
                  href={detailsMail(row)}
                  onClick={() => void onSent(row)}
                >
                  <Mail aria-hidden="true" size={12} /> SEND EVENT DETAILS
                </a>
                {row.detailsSentAt && (
                  <span className="admin-muted">
                    DETAILS SENT {new Date(row.detailsSentAt).toLocaleDateString()}
                  </span>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

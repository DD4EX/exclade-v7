import { supabase } from "@/integrations/supabase/client";
import type { EventDay } from "@/data/eventCatalog";

export type TeamMember = { name: string; email?: string; phone?: string };

export type RegistrationPayload = {
  registrationId: string;
  eventId: string;
  eventName: string;
  eventDay: EventDay;
  registrationAmount: number;
  registrationType: "solo" | "team";
  teamName: string;
  teamLeaderName: string;
  teamLeaderGmail: string;
  college: string;
  department: string;
  year: string;
  email: string;
  phone: string;
  teamMembers: TeamMember[];
  assignedUpiAccount: string;
  assignedUpiName: string;
  assignedUpiId: string;
  dailyTransactionSlot: number;
  paymentNote: string;
  qrDataUrl: string;
  screenshot: File;
};

export type RegistrationResult = { ok: boolean; message: string };

const MAX_SCREENSHOT_BYTES = 5 * 1024 * 1024;

export const generateRegistrationId = () => {
  const numeric = `${Date.now()}`.slice(-6).padStart(6, "0");
  const suffix = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `EX26-${suffix}-${numeric}`;
};

export async function submitRegistration(payload: RegistrationPayload): Promise<RegistrationResult> {
  const file = payload.screenshot;
  if (!file.type.startsWith("image/")) {
    return { ok: false, message: "PAYMENT PROOF MUST BE AN IMAGE FILE" };
  }
  if (file.size > MAX_SCREENSHOT_BYTES) {
    return { ok: false, message: "PAYMENT PROOF MUST BE UNDER 5 MB" };
  }

  const extension = file.name.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "") || "jpg";
  const path = `day-${payload.eventDay}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${extension}`;

  const upload = await supabase.storage.from("payment-proofs").upload(path, file, {
    contentType: file.type,
    upsert: false,
  });
  if (upload.error) {
    return { ok: false, message: "PAYMENT PROOF UPLOAD FAILED — PLEASE TRY AGAIN" };
  }

  const { data: publicFile } = supabase.storage.from("payment-proofs").getPublicUrl(path);

  const insert = await supabase.from("registrations").insert({
    registration_id: payload.registrationId,
    event_id: payload.eventId,
    event_name: payload.eventName,
    event_day: payload.eventDay,
    registration_amount: payload.registrationAmount,
    registration_type: payload.registrationType,
    team_name: payload.teamName.trim() || null,
    team_leader_name: payload.teamLeaderName.trim(),
    team_leader_gmail: payload.teamLeaderGmail.trim(),
    full_name: payload.teamLeaderName.trim(),
    email: payload.email.trim(),
    phone: payload.phone.trim(),
    college: payload.college.trim(),
    department: payload.department.trim(),
    year: payload.year,
    team_members: payload.teamMembers,
    assigned_upi_account: payload.assignedUpiAccount,
    assigned_upi_name: payload.assignedUpiName,
    assigned_upi_id: payload.assignedUpiId,
    daily_transaction_slot: payload.dailyTransactionSlot,
    payment_note: payload.paymentNote,
    payment_screenshot_path: path,
    payment_screenshot_url: publicFile.publicUrl,
    qr_data_url: payload.qrDataUrl,
    registration_timestamp: new Date().toISOString(),
    status: "pending",
  });

  if (insert.error) {
    return { ok: false, message: "REGISTRATION COULD NOT BE SAVED — PLEASE TRY AGAIN" };
  }

  return { ok: true, message: "REGISTRATION RECEIVED" };
}

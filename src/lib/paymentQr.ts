import QRCode from "qrcode";

import type { EventDay } from "@/data/eventCatalog";

export type PaymentQr = {
  id: string;
  holder: string;
  upiId: string;
  displayName: string;
};

export const DEFAULT_DAILY_LIMIT = 50;

export const qrsByDay: Record<EventDay, PaymentQr[]> = {
  1: [
    { id: "nandhini", holder: "Nandhini S", displayName: "Nandhini S", upiId: "9944981163@ptaxis" },
    { id: "santhosh", holder: "Santhosh Gurunathan", displayName: "Santhosh Gurunathan", upiId: "itsmesanthosh.guru-1@okaxis" },
  ],
  2: [
    { id: "dhayalan", holder: "Dhayalan", displayName: "Dhayalan", upiId: "dhayalanb2@okhdfcbank" },
    { id: "vinishka", holder: "Vinishka G", displayName: "Vinishka G", upiId: "vinika03042006@oksbi" },
  ],
};

export const buildUpiUri = ({
  upiId,
  payeeName,
  amount,
  note,
}: {
  upiId: string;
  payeeName: string;
  amount: number;
  note: string;
}) => {
  const params = new URLSearchParams({
    pa: upiId,
    pn: payeeName,
    am: amount.toFixed(2),
    cu: "INR",
    tn: note,
  });

  return `upi://pay?${params.toString()}`;
};

export const generatePaymentQrDataUrl = async ({
  upiId,
  payeeName,
  amount,
  note,
}: {
  upiId: string;
  payeeName: string;
  amount: number;
  note: string;
}): Promise<string> => {
  const uri = buildUpiUri({ upiId, payeeName, amount, note });
  return QRCode.toDataURL(uri, {
    errorCorrectionLevel: "M",
    margin: 1,
    width: 420,
    color: {
      dark: "#050505",
      light: "#ffffff",
    },
  });
};

export const buildPaymentNote = ({
  registrationId,
  eventName,
  teamName,
  teamLeaderName,
}: {
  registrationId: string;
  eventName: string;
  teamName?: string;
  teamLeaderName: string;
}) => {
  const label = (teamName && teamName.trim()) || teamLeaderName.trim();
  return `${registrationId} | ${eventName} | ${label}`;
};

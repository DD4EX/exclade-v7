import { QrCode } from "lucide-react";

import type { PaymentQr } from "@/lib/paymentQr";
import type { EventDay } from "@/data/eventCatalog";

export function PaymentQrPanel({
  qr,
  day,
  amount,
  note,
  qrDataUrl,
}: {
  qr: PaymentQr;
  day: EventDay;
  amount: number;
  note: string;
  qrDataUrl: string;
}) {
  return (
    <div className="payment-qr-panel">
      <div className="payment-qr-head">
        <span><QrCode aria-hidden="true" size={13} /> DAY {day} PAYMENT CHANNEL</span>
        <span>UNIQUE SLOT</span>
      </div>
      <img
        className="payment-qr-image"
        src={qrDataUrl}
        alt={`UPI payment QR code for ${qr.holder} (${qr.upiId})`}
        width={360}
        height={360}
        loading="eager"
      />
      <dl className="file-facts">
        <div><dt>PAY TO</dt><dd>{qr.holder}</dd></div>
        <div><dt>UPI ID</dt><dd>{qr.upiId}</dd></div>
        <div><dt>AMOUNT</dt><dd>₹{amount}</dd></div>
        <div><dt>NOTE</dt><dd>{note}</dd></div>
      </dl>
      <p className="register-hint">
        Scan with any UPI app to pay the registration fee for your Day {day} event. Use the assigned account shown above.
      </p>
    </div>
  );
}

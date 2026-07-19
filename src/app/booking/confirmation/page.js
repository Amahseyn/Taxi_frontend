"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const ref = searchParams.get("ref");

  return (
    <div style={{ padding: "80px 20px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
      <div style={{ maxWidth: "500px", padding: "40px", border: "1px solid var(--border-color)", borderRadius: "12px", background: "#fff", boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }}>
        <div style={{ fontSize: "50px", color: "var(--accent-green)", marginBottom: "20px" }}>✓</div>
        <h2 style={{ fontSize: "24px", fontWeight: "800", marginBottom: "12px" }}>Booking Confirmed!</h2>
        <p style={{ color: "var(--text-secondary)", fontSize: "15px", lineHeight: "1.6", marginBottom: "24px" }}>
          Thank you for choosing Colchester Airport Taxi. We have successfully confirmed your booking and processed your payment.
        </p>
        <div style={{ background: "var(--bg-tertiary)", padding: "16px", borderRadius: "8px", fontWeight: "700", fontSize: "16px", marginBottom: "24px" }}>
          Reference: <span style={{ color: "var(--accent-blue)" }}>{ref || "TX-UNKNOWN"}</span>
        </div>
        <p style={{ color: "var(--text-muted)", fontSize: "13px", marginBottom: "24px" }}>
          An email receipt and SMS confirmation have been sent to your contact details.
        </p>
        <a href="/" className="btn-primary" style={{ display: "inline-block" }}>
          Return to Home
        </a>
      </div>
    </div>
  );
}

export default function ConfirmationPage() {
  return (
    <Suspense fallback={<div style={{ textAlign: "center", padding: "80px" }}>Loading confirmation...</div>}>
      <ConfirmationContent />
    </Suspense>
  );
}

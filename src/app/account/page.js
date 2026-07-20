"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const API_BASE = "/api/v1";

export default function AccountPortal() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [selectedBooking, setSelectedBooking] = useState(null); // For amendment modal
  const [amendMessage, setAmendMessage] = useState("");
  const [submittingAmend, setSubmittingAmend] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    fetchBookings(token);
  }, []);

  const fetchBookings = async (token) => {
    try {
      const res = await fetch(`${API_BASE}/bookings/my-bookings`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Failed to load bookings.");
      const data = await res.json();
      setBookings(data);
    } catch (err) {
      setErrorMsg(err.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (bookingId) => {
    if (!confirm("Are you sure you want to cancel this booking?")) return;
    const token = localStorage.getItem("token");
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const res = await fetch(`${API_BASE}/bookings/${bookingId}/cancel`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.detail || "Cancellation failed.");
      }
      setSuccessMsg("Booking cancelled successfully.");
      fetchBookings(token);
    } catch (err) {
      setErrorMsg(err.message);
    }
  };

  const handleAmendSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    setSubmittingAmend(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const res = await fetch(`${API_BASE}/bookings/${selectedBooking.id}/amend-request`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ message: amendMessage })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Amendment request failed.");

      setSuccessMsg("Amendment request sent to the office.");
      setSelectedBooking(null);
      setAmendMessage("");
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setSubmittingAmend(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    router.push("/login");
  };

  if (loading) {
    return <div style={{ padding: "80px", textAlign: "center" }}>Loading portal...</div>;
  }

  return (
    <div style={{ padding: "40px 20px", maxWidth: "900px", margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px", borderBottom: "1px solid var(--border-color)", paddingBottom: "16px" }}>
        <h2 style={{ fontSize: "28px", fontWeight: "800" }}>My Bookings</h2>
        <button onClick={handleLogout} className="btn-secondary" style={{ padding: "10px 20px" }}>
          Sign Out
        </button>
      </div>

      {errorMsg && (
        <div style={{ padding: "12px", background: "#fdf0f0", color: "#a60f0a", borderRadius: "6px", fontWeight: "600", fontSize: "14px", marginBottom: "16px" }}>
          {errorMsg}
        </div>
      )}
      {successMsg && (
        <div style={{ padding: "12px", background: "#f0fdf4", color: "var(--accent-green)", borderRadius: "6px", fontWeight: "600", fontSize: "14px", marginBottom: "16px" }}>
          {successMsg}
        </div>
      )}

      {bookings.length === 0 ? (
        <div style={{ textAlign: "center", padding: "40px", border: "1px dashed var(--border-color)", borderRadius: "8px" }}>
          <p style={{ color: "var(--text-muted)", marginBottom: "16px" }}>You have no bookings yet.</p>
          <a href="/#booking-form" className="btn-primary">Book a Ride</a>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {bookings.map((b) => (
            <div key={b.id} style={{ border: "1px solid var(--border-color)", borderRadius: "10px", padding: "20px", background: "#fff" }}>
              <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "12px", borderBottom: "1px solid var(--border-color)", paddingBottom: "12px", marginBottom: "12px" }}>
                <div>
                  <span style={{ fontWeight: "800", fontSize: "15px" }}>Ref: {b.booking_reference}</span>
                  <span style={{ marginLeft: "12px", padding: "4px 8px", borderRadius: "12px", fontSize: "12px", fontWeight: "700", background: b.booking_status === "confirmed" ? "rgba(17, 152, 73, 0.1)" : "rgba(0,0,0,0.05)", color: b.booking_status === "confirmed" ? "var(--accent-green)" : "var(--text-secondary)" }}>
                    Status: {b.booking_status.toUpperCase()}
                  </span>
                </div>
                <div style={{ fontWeight: "700" }}>Price: £{b.price}</div>
              </div>
              <div style={{ fontSize: "14px", display: "flex", flexDirection: "column", gap: "6px" }}>
                <div><strong>From:</strong> {b.pickup_address}</div>
                <div><strong>To:</strong> {b.destination_address}</div>
                <div><strong>Travel Time:</strong> {b.travel_date} at {b.travel_time}</div>
                <div><strong>Payment:</strong> {b.payment_status.toUpperCase()}</div>
              </div>
              
              {b.booking_status !== "cancelled" && (
                <div style={{ display: "flex", gap: "12px", marginTop: "16px", justifyContent: "flex-end" }}>
                  <button onClick={() => setSelectedBooking(b)} className="btn-secondary" style={{ padding: "8px 16px", fontSize: "13px" }}>
                    Request Amendment
                  </button>
                  <button onClick={() => handleCancel(b.id)} className="btn-secondary" style={{ padding: "8px 16px", fontSize: "13px", color: "#a60f0a", borderColor: "#e0c0c0" }}>
                    Cancel Booking
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Amendment Modal */}
      {selectedBooking && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px", zIndex: 1000 }}>
          <div style={{ background: "#fff", padding: "24px", borderRadius: "12px", maxWidth: "500px", width: "100%", display: "flex", flexDirection: "column", gap: "16px" }}>
            <h3 style={{ fontSize: "18px", fontWeight: "800" }}>Request Amendment for {selectedBooking.booking_reference}</h3>
            <form onSubmit={handleAmendSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <label style={{ fontSize: "14px", fontWeight: "700" }}>Describe the changes you want to make:</label>
              <textarea
                required
                style={{ padding: "12px", border: "1px solid #ccc", borderRadius: "6px", minHeight: "120px" }}
                value={amendMessage}
                onChange={(e) => setAmendMessage(e.target.value)}
                placeholder="e.g. Change pickup time to 14:30, or change passenger count to 3..."
              />
              <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end", marginTop: "8px" }}>
                <button type="button" className="btn-secondary" onClick={() => setSelectedBooking(null)}>
                  Close
                </button>
                <button type="submit" className="btn-primary" disabled={submittingAmend}>
                  {submittingAmend ? "Sending..." : "Submit Request"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

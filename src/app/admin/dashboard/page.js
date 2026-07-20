"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const API_BASE = "/api/v1";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [settings, setSettings] = useState(null);
  const [drivers, setDrivers] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    if (!token || role !== "admin") { router.push("/login"); return; }
    init(token);
  }, []);

  const init = async (token) => {
    setLoading(true);
    try {
      const [statsRes, settingsRes, driversRes, notificationsRes] = await Promise.all([
        fetch(`${API_BASE}/admin/stats`, { headers: { "Authorization": `Bearer ${token}` } }),
        fetch(`${API_BASE}/admin/settings`, { headers: { "Authorization": `Bearer ${token}` } }),
        fetch(`${API_BASE}/admin/drivers`, { headers: { "Authorization": `Bearer ${token}` } }),
        fetch(`${API_BASE}/admin/notifications`, { headers: { "Authorization": `Bearer ${token}` } })
      ]);
      const [statsData, settingsData, driversData, notificationsData] = await Promise.all([
        statsRes.ok ? statsRes.json() : null,
        settingsRes.ok ? settingsRes.json() : null,
        driversRes.ok ? driversRes.json() : null,
        notificationsRes.ok ? notificationsRes.json() : null
      ]);
      setStats(statsData);
      setSettings(settingsData);
      setDrivers(driversData || []);
      setNotifications(notificationsData || []);
      await fetchBookings(token);
    } catch (err) { setErrorMsg(err.message || "Failed to load."); }
    finally { setLoading(false); }
  };

  const fetchBookings = async (token, searchVal = "", statusVal = "") => {
    const params = new URLSearchParams();
    if (searchVal) params.append("search", searchVal);
    if (statusVal) params.append("booking_status", statusVal);
    const res = await fetch(`${API_BASE}/admin/bookings?${params.toString()}`, {
      headers: { "Authorization": `Bearer ${token}` }
    });
    if (res.ok) setBookings(await res.json());
  };

  const markNotificationRead = async (id, token) => {
    await fetch(`${API_BASE}/admin/notifications/${id}/read`, { method: "PATCH", headers: { "Authorization": `Bearer ${token}` } });
    init(token);
  };

  const handleAssignDriver = async (bookingId, driverId) => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_BASE}/admin/bookings/${bookingId}/assign-driver?driver_id=${driverId}`, {
      method: "PATCH", headers: { "Authorization": `Bearer ${token}` }
    });
    if (res.ok) init(token);
  };

  const handleUpdateStatus = async (bookingId, newStatus, newPayment) => {
    const token = localStorage.getItem("token");
    const body = {};
    if (newStatus) body.booking_status = newStatus;
    if (newPayment) body.payment_status = newPayment;
    const res = await fetch(`${API_BASE}/admin/bookings/${bookingId}`, {
      method: "PATCH", headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });
    if (res.ok) init(token);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    router.push("/login");
  };

  const statusBadge = (status) => ({
    pending: { bg: "#fef9e7", color: "#795548", text: "PENDING" },
    confirmed: { bg: "#e8f5e9", color: "#2e7d32", text: "CONFIRMED" },
    completed: { bg: "#e3f2fd", color: "#1565c0", text: "COMPLETED" },
    cancelled: { bg: "#ffebee", color: "#c62828", text: "CANCELLED" }
  }[status] || { bg: "#f5f5f5", color: "#333", text: status?.toUpperCase() });

  if (loading) return (
    <div style={{ padding: "80px", textAlign: "center", background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)", minHeight: "100vh" }}>
      <div style={{ fontSize: "18px", color: "#555" }}>Loading dashboard...</div>
    </div>
  );

  return (
    <div style={{ padding: "28px", maxWidth: "1240px", margin: "0 auto", background: "#fafbfc", minHeight: "100vh" }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "28px", paddingBottom: "16px", borderBottom: "1px solid #e0e0e0" }}>
        <div>
          <h1 style={{ fontSize: "28px", fontWeight: "800", margin: 0, color: "#066aab" }}>Admin Dashboard</h1>
          <p style={{ color: "#666", fontSize: "14px", margin: "6px 0 0 0" }}>Manage bookings, drivers & system settings</p>
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          <button onClick={() => router.push("/admin/drivers")} style={{ padding: "10px 20px", fontSize: "14px", border: "none", borderRadius: "8px", background: "#066aab", color: "#fff", cursor: "pointer", fontWeight: "600" }}>Drivers</button>
          <button onClick={handleLogout} style={{ padding: "10px 20px", fontSize: "14px", border: "1px solid #ddd", borderRadius: "8px", background: "#fff", cursor: "pointer" }}>Logout</button>
        </div>
      </header>

      {errorMsg && <div style={{ padding: "12px 16px", background: "#ffebee", color: "#c62828", borderRadius: "8px", fontSize: "14px", marginBottom: "16px", border: "1px solid #ef9a9a" }}>{errorMsg}</div>}
      {successMsg && <div style={{ padding: "12px 16px", background: "#e8f5e9", color: "#2e7d32", borderRadius: "8px", fontSize: "14px", marginBottom: "16px", border: "1px solid #a5d6a7" }}>{successMsg}</div>}

      {stats && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "14px", marginBottom: "28px" }}>
          {[
            { label: "Today's Bookings", val: stats.today_bookings, accent: "#066aab" },
            { label: "Upcoming Rides", val: stats.upcoming_bookings, accent: "#00c853" },
            { label: "Total Revenue", val: `£${stats.revenue.toFixed(2)}`, accent: "#ff9800" },
            { label: "Customers", val: stats.customer_count, accent: "#9c27b0" }
          ].map((s, i) => (
            <div key={i} style={{ padding: "18px", border: "1px solid #e0e0e0", borderRadius: "12px", background: "#fff", textAlign: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
              <div style={{ fontSize: "12px", fontWeight: "600", color: "#888", textTransform: "uppercase", letterSpacing: "0.5px" }}>{s.label}</div>
              <div style={{ fontSize: "26px", fontWeight: "800", marginTop: "8px", color: s.accent }}>{s.val}</div>
            </div>
          ))}
        </div>
      )}

      <main style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "28px" }}>
        <section>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <h2 style={{ fontSize: "20px", fontWeight: "700", margin: 0, color: "#333" }}>Bookings</h2>
            <form onSubmit={(e) => { e.preventDefault(); fetchBookings(localStorage.getItem("token"), search, statusFilter); }} style={{ display: "flex", gap: "10px" }}>
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search reference or customer..." style={{ padding: "10px 14px", border: "1px solid #ddd", borderRadius: "8px", fontSize: "14px", width: "240px" }} />
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={{ padding: "10px 14px", border: "1px solid #ddd", borderRadius: "8px", fontSize: "14px", background: "#fff" }}>
                <option value="">All Statuses</option><option value="pending">Pending</option><option value="confirmed">Confirmed</option><option value="completed">Completed</option>
              </select>
            </form>
          </div>

          <div style={{ maxHeight: "620px", overflowY: "auto", paddingRight: "6px" }}>
            {bookings.map((b) => (
              <article key={b.id} style={{ border: "1px solid #e0e0e0", borderRadius: "12px", padding: "16px 18px", background: "#fff", marginBottom: "12px", boxShadow: "0 1px 4px rgba(0,0,0,0.03)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px", paddingBottom: "10px", borderBottom: "1px solid #f0f0f0" }}>
                  <div>
                    <span style={{ fontWeight: "700", fontSize: "15px", color: "#222" }}>{b.booking_reference}</span>
                    <span style={{ marginLeft: "10px", fontSize: "13px", color: "#888" }}>{b.journey_type}</span>
                  </div>
                  <span style={{ padding: "4px 12px", borderRadius: "999px", fontSize: "12px", fontWeight: "600", background: statusBadge(b.booking_status).bg, color: statusBadge(b.booking_status).color }}>
                    {statusBadge(b.booking_status).text}
                  </span>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "18px", fontSize: "13px", color: "#555", marginBottom: "10px" }}>
                  <div><strong>Customer:</strong> {b.customer_name} <span style={{ color: "#888" }}>({b.customer_phone})</span></div>
                  <div><strong>Route:</strong> {b.pickup_address} <span style={{ color: "#066aab" }}>→</span> {b.destination_address}</div>
                  <div><strong>When:</strong> {b.travel_date} • {b.travel_time}</div>
                  <div><strong>Distance:</strong> {b.distance_miles} mi ({b.duration_minutes} min)</div>
                  <div><strong>Vehicle:</strong> {b.vehicle_name} • {b.passengers} pax • {b.large_luggage}L+{b.small_luggage}S bags</div>
                  <div><strong>Price:</strong> <span style={{ color: "#066aab", fontWeight: "600" }}>£{b.price}</span>{b.airport_code && <span style={{ color: "#888", fontSize: "12px" }}> (fixed)</span>}</div>
                </div>
                {b.driver_name && (
                  <div style={{ fontSize: "13px", color: "#666", marginBottom: "12px", padding: "8px 12px", background: "#f8f9fa", borderRadius: "8px" }}>
                    <strong>Assigned:</strong> {b.driver_name} • {b.driver_vehicle_make} {b.driver_vehicle_model} <span style={{ color: "#066aab" }}>({b.driver_vehicle_class})</span>
                  </div>
                )}
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center" }}>
                  <button onClick={() => handleUpdateStatus(b.id, "confirmed", null)} disabled={b.booking_status !== "pending"} style={{ padding: "8px 16px", fontSize: "13px", border: "none", borderRadius: "8px", background: b.booking_status === "pending" ? "#066aab" : "#e0e0e0", color: "#fff", cursor: b.booking_status === "pending" ? "pointer" : "default", fontWeight: "600" }}>Accept</button>
                  <select onChange={(e) => { if (e.target.value) handleAssignDriver(b.id, Number(e.target.value)); e.target.value = ""; }} defaultValue="" style={{ padding: "8px 12px", fontSize: "13px", border: "1px solid #ddd", borderRadius: "8px", background: "#fff", cursor: "pointer", minWidth: "200px" }}>
                    <option value="" disabled>Assign Driver...</option>
                    {drivers.filter(d => d.status === "available").map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name} — {d.vehicle?.class || "—"} ({d.vehicle?.make} {d.vehicle?.model || ""})
                      </option>
                    ))}
                    {drivers.filter(d => d.status !== "available").length > 0 && <option disabled style={{ color: "#999" }}>──────────</option>}
                    {drivers.filter(d => d.status !== "available").map((d) => (
                      <option key={d.id} value={d.id} disabled style={{ color: "#999" }}>
                        {d.name} — {d.vehicle?.class || "—"} (busy)
                      </option>
                    ))}
                  </select>
                  <button onClick={() => handleUpdateStatus(b.id, "completed", null)} disabled={b.booking_status !== "confirmed"} style={{ padding: "8px 16px", fontSize: "13px", border: "1px solid #4caf50", borderRadius: "8px", background: b.booking_status === "confirmed" ? "#4caf50" : "#f5f5f5", color: b.booking_status === "confirmed" ? "#fff" : "#999", cursor: b.booking_status === "confirmed" ? "pointer" : "default", fontWeight: "600" }}>Complete</button>
                  <button onClick={() => handleUpdateStatus(b.id, "cancelled", null)} style={{ padding: "8px 16px", fontSize: "13px", border: "1px solid #f44336", borderRadius: "8px", background: "#fff", color: "#f44336", cursor: "pointer", fontWeight: "600" }}>Cancel</button>
                  <button onClick={() => handleUpdateStatus(b.id, null, "paid")} style={{ padding: "8px 16px", fontSize: "13px", border: "1px solid #4caf50", borderRadius: "8px", background: "#fff", color: "#4caf50", cursor: "pointer", fontWeight: "600" }}>Mark Paid</button>
                </div>
              </article>
            ))}
            {bookings.length === 0 && <div style={{ padding: "40px", textAlign: "center", color: "#888", background: "#fff", borderRadius: "12px" }}>No bookings found</div>}
          </div>
        </section>

        <aside>
          <h2 style={{ fontSize: "20px", fontWeight: "700", margin: "0 0 16px 0", color: "#333" }}>Notifications</h2>
          <div style={{ border: "1px solid #e0e0e0", borderRadius: "12px", background: "linear-gradient(135deg, #fffde7 0%, #fff9c4 100%)", maxHeight: "560px", overflowY: "auto" }}>
            {notifications.length === 0 && <div style={{ padding: "30px", textAlign: "center", color: "#888" }}>No notifications</div>}
            {notifications.map((n) => (
              <div key={n.id} style={{ padding: "14px 16px", borderBottom: "1px solid #f0f0f0", background: n.read ? "#fff" : "#fffde7", fontSize: "13px" }}>
                <div style={{ fontWeight: "600", marginBottom: "4px", color: "#222" }}>{n.title}</div>
                <div style={{ color: "#555", marginBottom: "6px" }}>{n.message}</div>
                <div style={{ color: "#999", fontSize: "11px" }}>{new Date(n.created_at).toLocaleString()}</div>
                {!n.read && <button onClick={() => markNotificationRead(n.id, localStorage.getItem("token"))} style={{ marginTop: "8px", padding: "4px 10px", fontSize: "12px", border: "1px solid #ffd54f", borderRadius: "6px", background: "linear-gradient(135deg, #fff9c4 0%, #ffd54f 100%)", color: "#ff8f00", cursor: "pointer" }}>Mark Read</button>}
              </div>
            ))}
          </div>

          <h2 style={{ fontSize: "20px", fontWeight: "700", margin: "24px 0 16px 0", color: "#333" }}>Settings</h2>
          {settings && (
            <form onSubmit={async (e) => { e.preventDefault(); await fetch(`${API_BASE}/admin/settings`, { method: "PUT", headers: { "Authorization": `Bearer ${localStorage.getItem("token")}`, "Content-Type": "application/json" }, body: JSON.stringify(settings) }); }} style={{ padding: "20px", border: "1px solid #e0e0e0", borderRadius: "12px", background: "#fff", display: "grid", gap: "14px" }}>
              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "#555", marginBottom: "6px" }}>Business Name</label>
                <input value={settings.business_name} onChange={(e) => setSettings({ ...settings, business_name: e.target.value })} style={{ width: "100%", padding: "10px 12px", border: "1px solid #ddd", borderRadius: "8px", fontSize: "14px" }} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "#555", marginBottom: "6px" }}>Phone</label>
                <input value={settings.phone} onChange={(e) => setSettings({ ...settings, phone: e.target.value })} style={{ width: "100%", padding: "10px 12px", border: "1px solid #ddd", borderRadius: "8px", fontSize: "14px" }} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "#555", marginBottom: "6px" }}>Email</label>
                <input value={settings.email} onChange={(e) => setSettings({ ...settings, email: e.target.value })} style={{ width: "100%", padding: "10px 12px", border: "1px solid #ddd", borderRadius: "8px", fontSize: "14px" }} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "#555", marginBottom: "6px" }}>Notice Hours</label>
                <input type="number" value={settings.minimum_booking_notice_hours} onChange={(e) => setSettings({ ...settings, minimum_booking_notice_hours: parseInt(e.target.value) })} style={{ width: "100%", padding: "10px 12px", border: "1px solid #ddd", borderRadius: "8px", fontSize: "14px" }} />
              </div>
              <button type="submit" style={{ padding: "12px 20px", border: "none", borderRadius: "8px", background: "#066aab", color: "#fff", fontSize: "14px", fontWeight: "600", cursor: "pointer" }}>Save Settings</button>
            </form>
          )}
        </aside>
      </main>
    </div>
  );
}
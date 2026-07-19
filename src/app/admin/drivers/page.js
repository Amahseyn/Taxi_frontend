"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const API_BASE = "http://localhost:8000/api/v1";

export default function AdminDrivers() {
  const [drivers, setDrivers] = useState([]);
  const [allDrivers, setAllDrivers] = useState([]);
  const [vehicleClasses, setVehicleClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [classFilter, setClassFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDriver, setSelectedDriver] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const filtered = allDrivers
      .filter(d => statusFilter === "all" || d.status === statusFilter)
      .filter(d => classFilter === "all" || d.vehicle?.class === classFilter)
      .filter(d => !searchTerm || d.name.toLowerCase().includes(searchTerm.toLowerCase()) || d.phone.includes(searchTerm));
    setDrivers(filtered);
  }, [statusFilter, classFilter, searchTerm, allDrivers]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    if (!token || role !== "admin") { router.push("/login"); return; }
    loadDrivers(token);
  }, []);

  const loadDrivers = async (token) => {
    setLoading(true);
    try {
      const [driversRes, vehiclesRes] = await Promise.all([
        fetch(`${API_BASE}/admin/drivers?include_inactive=true`, { headers: { "Authorization": `Bearer ${token}` } }),
        fetch(`${API_BASE}/vehicles`, { headers: { "Authorization": `Bearer ${token}` } })
      ]);
      if (!driversRes.ok || !vehiclesRes.ok) throw new Error("Failed to load.");
      const [driversData, vehicleData] = await Promise.all([driversRes.json(), vehiclesRes.json()]);
      setAllDrivers(driversData);
      setDrivers(driversData);
      setVehicleClasses(vehicleData);
    } catch (err) { setErrorMsg(err.message); }
    finally { setLoading(false); }
  };

  const handleDeactivate = async (driverId) => {
    const token = localStorage.getItem("token");
    if (!confirm("Deactivate this driver?")) return;
    await fetch(`${API_BASE}/admin/drivers/${driverId}`, { method: "DELETE", headers: { "Authorization": `Bearer ${token}` } });
    loadDrivers(token);
  };

  if (loading) return <div style={{ padding: "80px", textAlign: "center", background: "#f5f7fa", minHeight: "100vh" }}>Loading...</div>;

  return (
    <div style={{ padding: "28px", maxWidth: "1000px", margin: "0 auto", background: "#fafbfc", minHeight: "100vh" }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px", paddingBottom: "14px", borderBottom: "1px solid #e0e0e0" }}>
        <h1 style={{ fontSize: "26px", fontWeight: "700", margin: 0, color: "#222" }}>Drivers</h1>
        <button onClick={() => router.push("/admin/dashboard")} style={{ padding: "10px 20px", fontSize: "14px", border: "1px solid #ddd", borderRadius: "8px", background: "#fff", cursor: "pointer" }}>← Back to Dashboard</button>
      </header>

      {errorMsg && <div style={{ padding: "10px 16px", background: "#ffebee", color: "#c62828", borderRadius: "8px", fontSize: "13px", marginBottom: "16px" }}>{errorMsg}</div>}
      {successMsg && <div style={{ padding: "10px 16px", background: "#e8f5e9", color: "#2e7d32", borderRadius: "8px", fontSize: "13px", marginBottom: "16px" }}>{successMsg}</div>}

      <div style={{ marginBottom: "20px", display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center" }}>
        {["all", "available", "busy", "inactive"].map(s => (
          <button key={s} onClick={() => setStatusFilter(s)} style={{ padding: "8px 16px", fontSize: "13px", border: statusFilter === s ? "none" : "1px solid #ddd", borderRadius: "20px", background: statusFilter === s ? "#066aab" : "#fff", color: statusFilter === s ? "#fff" : "#555", cursor: "pointer", fontWeight: "500" }}>
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
        <select value={classFilter} onChange={(e) => setClassFilter(e.target.value)} style={{ padding: "8px 14px", fontSize: "13px", border: "1px solid #ddd", borderRadius: "20px", background: "#fff", marginLeft: "8px" }}>
          <option value="all">All Classes</option>
          {vehicleClasses.map((vc) => <option key={vc.id} value={vc.name}>{vc.name}</option>)}
        </select>
        <input type="text" placeholder="Search drivers..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ padding: "8px 14px", fontSize: "13px", border: "1px solid #ddd", borderRadius: "20px", background: "#fff", marginLeft: "8px" }} />
      </div>

      <div style={{ border: "1px solid #e0e0e0", borderRadius: "12px", overflow: "hidden", background: "#fff", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
          <thead>
            <tr style={{ background: "#f8f9fa", borderBottom: "2px solid #e0e0e0" }}>
              <th style={{ padding: "14px 16px", textAlign: "left", fontWeight: "600", color: "#555" }}>Driver</th>
              <th style={{ padding: "14px 16px", textAlign: "left", fontWeight: "600", color: "#555" }}>Contact</th>
              <th style={{ padding: "14px 16px", textAlign: "left", fontWeight: "600", color: "#555" }}>Vehicle</th>
              <th style={{ padding: "14px 16px", textAlign: "left", fontWeight: "600", color: "#555" }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {drivers.map((d) => (
              <tr key={d.id} style={{ borderBottom: "1px solid #f0f0f0" }}>
                <td style={{ padding: "14px 16px", fontWeight: "500", color: "#222" }}>{d.name}</td>
                <td style={{ padding: "14px 16px", color: "#555" }}>{d.phone}{d.email && <><br /><span style={{ color: "#888", fontSize: "12px" }}>{d.email}</span></>}</td>
                <td style={{ padding: "14px 16px", color: "#555" }}>
                  {d.vehicle ? <><span style={{ fontWeight: "500" }}>{d.vehicle.make} {d.vehicle.model}</span><br /><span style={{ color: "#888", fontSize: "12px" }}>{d.vehicle.class} • {d.vehicle.registration_number}</span></> : "—"}
                </td>
                <td style={{ padding: "14px 16px" }}>
                  <span style={{
                    padding: "5px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "600",
                    background: d.status === "available" ? "#e8f5e9" : d.status === "busy" ? "#fff8e1" : "#f5f5f5",
                    color: d.status === "available" ? "#2e7d32" : d.status === "busy" ? "#ff8f00" : "#777"
                  }}>{d.status}</span>
                </td>
              </tr>
            ))}
            {drivers.length === 0 && <tr><td colSpan="4" style={{ padding: "40px", textAlign: "center", color: "#888" }}>No drivers found</td></tr>}
          </tbody>
        </table>
      </div>

      {selectedDriver && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
          <div style={{ background: "#fff", borderRadius: "12px", padding: "24px", maxWidth: "420px", width: "90%" }}>
            <h3 style={{ margin: "0 0 16px 0", fontSize: "20px", fontWeight: "600" }}>Driver Details</h3>
            <div style={{ display: "grid", gap: "12px", fontSize: "14px" }}>
              <div><strong>Name:</strong> {selectedDriver.name}</div>
              <div><strong>Phone:</strong> {selectedDriver.phone}</div>
              <div><strong>Email:</strong> {selectedDriver.email || "—"}</div>
              <div><strong>Status:</strong> {selectedDriver.status}</div>
              {selectedDriver.vehicle && (
                <>
                  <div style={{ height: "1px", background: "#e5e7eb" }}></div>
                  <div><strong>Make:</strong> {selectedDriver.vehicle.make}</div>
                  <div><strong>Model:</strong> {selectedDriver.vehicle.model}</div>
                  <div><strong>Class:</strong> {selectedDriver.vehicle.class}</div>
                  <div><strong>Reg:</strong> {selectedDriver.vehicle.registration_number}</div>
                </>
              )}
            </div>
            <button onClick={() => setSelectedDriver(null)} style={{ marginTop: "20px", padding: "10px 20px", border: "1px solid #ddd", borderRadius: "8px", background: "#fff", fontSize: "14px", cursor: "pointer" }}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
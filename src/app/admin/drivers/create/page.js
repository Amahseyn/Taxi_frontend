"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const API_BASE = "http://localhost:8000/api/v1";

export default function CreateDriver() {
  const [vehicleClasses, setVehicleClasses] = useState([]);
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    email: "",
    status: "inactive",
    notes: "",
    active: true,
    vehicle: {
      vehicle_class_id: "",
      registration_number: "",
      make: "",
      model: "",
      year: "",
      colour: "",
      seats: ""
    }
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const router = useRouter();

  const loadVehicleClasses = async (token) => {
    try {
      const res = await fetch(`${API_BASE}/vehicles`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setVehicleClasses(data);
        if (data.length > 0) {
          setForm((f) => ({ ...f, vehicle: { ...f.vehicle, vehicle_class_id: data[0].code } }));
        }
      }
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    if (!token || role !== "admin") {
      router.push("/login");
      return;
    }
    loadVehicleClasses(token);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("vehicle.")) {
      const field = name.replace("vehicle.", "");
      setForm((f) => ({ ...f, vehicle: { ...f.vehicle, [field]: value } }));
    } else {
      setForm((f) => ({ ...f, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg("");
    setSuccessMsg("");
    const token = localStorage.getItem("token");
    try {
      const selectedClass = vehicleClasses.find(vc => vc.code === form.vehicle.vehicle_class_id);
      const payload = {
        ...form,
        vehicle: {
          ...form.vehicle,
          vehicle_class_id: selectedClass ? selectedClass.id : Number(form.vehicle.vehicle_class_id),
          year: form.vehicle.year ? Number(form.vehicle.year) : null,
          seats: form.vehicle.seats ? Number(form.vehicle.seats) : null,
        }
      };
      const res = await fetch(`${API_BASE}/admin/drivers`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail || "Failed to create driver.");
      }
      setSuccessMsg("Driver created successfully.");
      setTimeout(() => router.push("/admin/drivers"), 800);
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div style={{ padding: "80px", textAlign: "center" }}>Loading...</div>;
  }

  return (
    <div style={{ padding: "40px 20px", maxWidth: "900px", margin: "0 auto" }}>
      <div style={{ marginBottom: "32px", borderBottom: "1px solid var(--border-color)", paddingBottom: "16px" }}>
        <h1 style={{ fontSize: "32px", fontWeight: "800" }}>Add New Driver</h1>
        <p style={{ color: "var(--text-secondary)", fontSize: "14px" }}>Enter driver details and vehicle information below.</p>
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

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
        <div style={{ padding: "24px", border: "1px solid var(--border-color)", borderRadius: "10px", background: "#fff" }}>
          <h3 style={{ fontSize: "18px", fontWeight: "800", marginBottom: "16px" }}>Driver Information</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontSize: "13px", fontWeight: "700" }}>First Name *</label>
              <input type="text" name="first_name" required value={form.first_name} onChange={handleChange} style={{ padding: "10px", border: "1px solid #ccc", borderRadius: "6px", fontSize: "14px" }} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontSize: "13px", fontWeight: "700" }}>Last Name *</label>
              <input type="text" name="last_name" required value={form.last_name} onChange={handleChange} style={{ padding: "10px", border: "1px solid #ccc", borderRadius: "6px", fontSize: "14px" }} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontSize: "13px", fontWeight: "700" }}>Phone *</label>
              <input type="text" name="phone" required value={form.phone} onChange={handleChange} style={{ padding: "10px", border: "1px solid #ccc", borderRadius: "6px", fontSize: "14px" }} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontSize: "13px", fontWeight: "700" }}>Email</label>
              <input type="email" name="email" value={form.email} onChange={handleChange} style={{ padding: "10px", border: "1px solid #ccc", borderRadius: "6px", fontSize: "14px" }} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontSize: "13px", fontWeight: "700" }}>Status</label>
              <select name="status" value={form.status} onChange={handleChange} style={{ padding: "10px", border: "1px solid #ccc", borderRadius: "6px", fontSize: "14px" }}>
                <option value="available">Available</option>
                <option value="busy">Busy</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontSize: "13px", fontWeight: "700" }}>Notes</label>
              <input type="text" name="notes" value={form.notes} onChange={handleChange} style={{ padding: "10px", border: "1px solid #ccc", borderRadius: "6px", fontSize: "14px" }} />
            </div>
          </div>
        </div>

        <div style={{ padding: "24px", border: "1px solid var(--border-color)", borderRadius: "10px", background: "#fff" }}>
          <h3 style={{ fontSize: "18px", fontWeight: "800", marginBottom: "16px" }}>Vehicle Information</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontSize: "13px", fontWeight: "700" }}>Vehicle Class *</label>
              <select name="vehicle.vehicle_class_id" required value={form.vehicle.vehicle_class_id} onChange={handleChange} style={{ padding: "10px", border: "1px solid #ccc", borderRadius: "6px", fontSize: "14px" }}>
                <option value="">Select class</option>
                {vehicleClasses.map((vc) => (
                  <option key={vc.id} value={vc.code}>{vc.name}</option>
                ))}
              </select>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontSize: "13px", fontWeight: "700" }}>Registration Number *</label>
              <input type="text" name="vehicle.registration_number" required value={form.vehicle.registration_number} onChange={handleChange} style={{ padding: "10px", border: "1px solid #ccc", borderRadius: "6px", fontSize: "14px" }} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontSize: "13px", fontWeight: "700" }}>Make *</label>
              <input type="text" name="vehicle.make" required value={form.vehicle.make} onChange={handleChange} style={{ padding: "10px", border: "1px solid #ccc", borderRadius: "6px", fontSize: "14px" }} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontSize: "13px", fontWeight: "700" }}>Model *</label>
              <input type="text" name="vehicle.model" required value={form.vehicle.model} onChange={handleChange} style={{ padding: "10px", border: "1px solid #ccc", borderRadius: "6px", fontSize: "14px" }} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontSize: "13px", fontWeight: "700" }}>Year</label>
              <input type="number" name="vehicle.year" value={form.vehicle.year} onChange={handleChange} style={{ padding: "10px", border: "1px solid #ccc", borderRadius: "6px", fontSize: "14px" }} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontSize: "13px", fontWeight: "700" }}>Colour</label>
              <input type="text" name="vehicle.colour" value={form.vehicle.colour} onChange={handleChange} style={{ padding: "10px", border: "1px solid #ccc", borderRadius: "6px", fontSize: "14px" }} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontSize: "13px", fontWeight: "700" }}>Seats</label>
              <input type="number" name="vehicle.seats" value={form.vehicle.seats} onChange={handleChange} style={{ padding: "10px", border: "1px solid #ccc", borderRadius: "6px", fontSize: "14px" }} />
            </div>
          </div>
        </div>

        <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
          <button type="button" onClick={() => router.push("/admin/drivers")} className="btn-secondary" style={{ padding: "10px 20px" }}>
            Cancel
          </button>
          <button type="submit" disabled={saving} className="btn-primary" style={{ padding: "10px 20px" }}>
            {saving ? "Saving..." : "Save Driver"}
          </button>
        </div>
      </form>
    </div>
  );
}

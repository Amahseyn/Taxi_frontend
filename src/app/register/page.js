"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const API_BASE = "/api/v1";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    phone: ""
  });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const router = useRouter();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail || "Registration failed.");
      }

      setSuccessMsg("Account created successfully! Redirecting to login...");
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (err) {
      setErrorMsg(err.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "80px 20px", display: "flex", justifyContent: "center" }}>
      <div style={{ width: "100%", maxWidth: "440px", padding: "32px", border: "1px solid var(--border-color)", borderRadius: "12px", background: "#fff", boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }}>
        <h2 style={{ fontSize: "28px", fontWeight: "800", textAlign: "center", marginBottom: "24px" }}>Register Account</h2>
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
        <form onSubmit={handleRegister} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <label style={{ fontSize: "14px", fontWeight: "700" }}>Full Name</label>
            <input
              type="text"
              name="name"
              required
              style={{ padding: "12px", border: "1px solid #ccc", borderRadius: "6px" }}
              value={formData.name}
              onChange={handleChange}
            />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <label style={{ fontSize: "14px", fontWeight: "700" }}>Email Address</label>
            <input
              type="email"
              name="email"
              required
              style={{ padding: "12px", border: "1px solid #ccc", borderRadius: "6px" }}
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <label style={{ fontSize: "14px", fontWeight: "700" }}>Phone Number</label>
            <input
              type="tel"
              name="phone"
              required
              style={{ padding: "12px", border: "1px solid #ccc", borderRadius: "6px" }}
              value={formData.phone}
              onChange={handleChange}
            />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <label style={{ fontSize: "14px", fontWeight: "700" }}>Password</label>
            <input
              type="password"
              name="password"
              required
              style={{ padding: "12px", border: "1px solid #ccc", borderRadius: "6px" }}
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          <button type="submit" className="btn-primary" style={{ width: "100%", marginTop: "12px" }} disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
        <p style={{ textAlign: "center", fontSize: "14px", color: "var(--text-muted)", marginTop: "20px" }}>
          Already have an account? <a href="/login" style={{ color: "var(--accent-blue)", fontWeight: "600" }}>Sign In</a>
        </p>
      </div>
    </div>
  );
}

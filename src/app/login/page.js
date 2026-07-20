"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const API_BASE = "/api/v1";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    const params = new URLSearchParams();
    params.append("username", email);
    params.append("password", password);

    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params.toString()
      });

      if (!res.ok) {
        throw new Error("Invalid username or password.");
      }

      const data = await res.json();
      localStorage.setItem("token", data.access_token);
      localStorage.setItem("role", data.role);

      if (data.role === "admin") {
        router.push("/admin/dashboard");
      } else {
        router.push("/account");
      }
    } catch (err) {
      setErrorMsg(err.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "80px 20px", display: "flex", justifyContent: "center" }}>
      <div style={{ width: "100%", maxWidth: "440px", padding: "32px", border: "1px solid var(--border-color)", borderRadius: "12px", background: "#fff", boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }}>
        <h2 style={{ fontSize: "28px", fontWeight: "800", textAlign: "center", marginBottom: "24px" }}>Sign In</h2>
        {errorMsg && (
          <div style={{ padding: "12px", background: "#fdf0f0", color: "#a60f0a", borderRadius: "6px", fontWeight: "600", fontSize: "14px", marginBottom: "16px" }}>
            {errorMsg}
          </div>
        )}
        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <label style={{ fontSize: "14px", fontWeight: "700" }}>Email Address</label>
            <input
              type="email"
              required
              style={{ padding: "12px", border: "1px solid #ccc", borderRadius: "6px" }}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <label style={{ fontSize: "14px", fontWeight: "700" }}>Password</label>
            <input
              type="password"
              required
              style={{ padding: "12px", border: "1px solid #ccc", borderRadius: "6px" }}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="btn-primary" style={{ width: "100%", marginTop: "12px" }} disabled={loading}>
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>
        <p style={{ textAlign: "center", fontSize: "14px", color: "var(--text-muted)", marginTop: "20px" }}>
          Don't have an account? <a href="/register" style={{ color: "var(--accent-blue)", fontWeight: "600" }}>Register</a>
        </p>
      </div>
    </div>
  );
}

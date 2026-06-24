import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const API = "http://localhost:5000";

function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    
    try {
      const res = await fetch(`${API}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Invalid username or password.");

      localStorage.setItem("user", JSON.stringify(data.user));
      window.dispatchEvent(new Event("authChanged"));
      window.dispatchEvent(new Event("cartUpdated"));
      navigate("/");
    } catch (err) { 
      setError(err.message); 
    } finally {
      setLoading(false); 
    }
  };

  return (
    <div className="container-fluid d-flex justify-content-center align-items-center min-vh-100 modern-light-bg">
      
      <style>{`
        .modern-light-bg {
          background-color: #f8fafc;
          background-image: radial-gradient(#e2e8f0 1px, transparent 1px);
          background-size: 24px 24px;
        }
        .modern-light-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          box-shadow: 0 20px 40px -15px rgba(15, 23, 42, 0.06);
          border-radius: 24px;
        }
        .modern-label {
          font-size: 0.8rem;
          font-weight: 600;
          color: #475569;
          letter-spacing: -0.1px;
        }
        .modern-light-input {
          background: #fdfdfd !important;
          border: 1px solid #cbd5e1 !important;
          color: #0f172a !important;
          font-size: 0.95rem !important;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .modern-light-input:focus {
          background: #ffffff !important;
          border-color: #0f172a !important;
          box-shadow: 0 0 0 4px rgba(15, 23, 42, 0.08) !important;
        }
        .modern-light-input::placeholder {
          color: #94a3b8;
        }
        .btn-modern-dark {
          background: #0f172a;
          color: #ffffff;
          border: none;
          transition: all 0.2s ease;
        }
        .btn-modern-dark:hover:not(:disabled) {
          background: #1e293b;
          transform: translateY(-1px);
          box-shadow: 0 8px 20px -6px rgba(15, 23, 42, 0.3);
        }
        .btn-modern-dark:active:not(:disabled) {
          transform: translateY(1px);
        }
        .link-brand {
          color: #0284c7;
          text-decoration: none;
          transition: color 0.2s ease;
        }
        .link-brand:hover {
          color: #0369a1;
          text-decoration: underline;
        }
      `}</style>

      <div className="card modern-light-card p-4 p-md-5" style={{ maxWidth: "430px", width: "100%" }}>
        <div className="text-center mb-4">
          <h2 className="fw-extrabold text-dark mb-1" style={{ letterSpacing: "-1.2px" }}>Welcome Back</h2>
          <p className="text-secondary small fw-light">Please log in to your store account dashboard</p>
        </div>

        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label className="form-label modern-label mb-1.5">Email Address</label>
            <input 
              type="email" 
              name="email" 
              placeholder="example@domain.com"
              className="form-control form-control-lg modern-light-input rounded-3 py-2.5"
              value={form.email} 
              onChange={handleChange} 
              required 
            />
          </div>

          <div className="mb-4">
            <label className="form-label modern-label mb-1.5">Password</label>
            <input 
              type="password" 
              name="password" 
              placeholder="••••••••"
              className="form-control form-control-lg modern-light-input rounded-3 py-2.5"
              value={form.password} 
              onChange={handleChange} 
              required 
            />
          </div>

          {error && (
            <div className="alert alert-danger border-0 p-2.5 small text-center rounded-3 bg-danger-subtle text-danger-emphasis fw-medium mb-4" style={{ fontSize: '0.85rem' }}>
              ✕ {error}
            </div>
          )}

          <button className="btn btn-modern-dark btn-lg w-100 rounded-3 fw-bold py-3 shadow-sm d-flex align-items-center justify-content-center" disabled={loading}>
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Signing you in...
              </>
            ) : "Sign In"}
          </button>
        </form>

        <p className="text-center mt-4 text-muted small mb-0">
          Don't have an account?{" "}
          <span className="link-brand fw-bold" style={{ cursor: "pointer" }} onClick={() => navigate("/register")}>
            Create an account
          </span>
        </p>
      </div>
    </div>
  );
}

export default Login;
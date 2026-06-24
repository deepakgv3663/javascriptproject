import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const API = "http://localhost:5000";

function Register() {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        fullname: "", age: "", email: "", gender: "", password: "", address: "", phone_number: ""
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleRegister = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const res = await fetch(`${API}/auth/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Registration failed");

            alert("Registered successfully! Redirecting to login...");
            navigate("/login");
        } catch (err) {
            setError(err.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container-fluid min-vh-100 d-flex justify-content-center align-items-center position-relative overflow-hidden" 
             style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)" }}>
            
            <div className="position-absolute rounded-circle opacity-25 blur-3xl" style={{ top: "-10%", left: "-10%", width: "40vw", height: "40vw", background: "radial-gradient(#6366f1, transparent 70%)", filter: "blur(80px)" }}></div>
            <div className="position-absolute rounded-circle opacity-25 blur-3xl" style={{ bottom: "-10%", right: "-10%", width: "40vw", height: "40vw", background: "radial-gradient(#ec4899, transparent 70%)", filter: "blur(80px)" }}></div>

            <div className="card border-0 shadow-2xl rounded-4 p-4 p-md-5 position-relative z-1 text-white" 
                 style={{ maxWidth: "500px", width: "100%", background: "rgba(30, 41, 59, 0.7)", backdropFilter: "blur(16px)", border: "1px solid rgba(255, 255, 255, 0.1)" }}>
                
                <div className="text-center mb-4">
                    <h2 className="fw-extrabold tracking-tight mb-2 text-white" style={{ fontSize: "2rem", letterSpacing: "-0.025em" }}>
                        Create Account
                    </h2>
                    <p className="text-secondary small">Join us and start shopping today</p>
                </div>

                <form onSubmit={handleRegister} className="needs-validation">
                    <div className="row g-3">
                        <div className="col-md-7">
                            <label className="form-label small fw-medium text-secondary mb-1">Full Name</label>
                            <input name="fullname" type="text" className="form-control bg-dark-subtle border-0 text-white rounded-3 py-2 px-3 shadow-none custom-input" style={inputStyle} onChange={handleChange} required placeholder="John Doe" />
                        </div>
                        <div className="col-md-5">
                            <label className="form-label small fw-medium text-secondary mb-1">Age</label>
                            <input name="age" type="number" className="form-control bg-dark-subtle border-0 text-white rounded-3 py-2 px-3 shadow-none custom-input" style={inputStyle} onChange={handleChange} required min="1" placeholder="25" />
                        </div>
                    </div>

                    <div className="mt-3">
                        <label className="form-label small fw-medium text-secondary mb-1">Email Address</label>
                        <input name="email" type="email" className="form-control bg-dark-subtle border-0 text-white rounded-3 py-2 px-3 shadow-none custom-input" style={inputStyle} onChange={handleChange} required placeholder="name@example.com" />
                    </div>

                    <div className="row g-3 mt-1">
                        <div className="col-md-5">
                            <label className="form-label small fw-medium text-secondary mb-1">Gender</label>
                            <select name="gender" className="form-select bg-dark-subtle border-0 text-white rounded-3 py-2 px-3 shadow-none custom-input" style={inputStyle} onChange={handleChange} required>
                                <option value="" className="text-dark">Select...</option>
                                <option value="Male" className="text-dark">Male</option>
                                <option value="Female" className="text-dark">Female</option>
                                <option value="Other" className="text-dark">Other</option>
                            </select>
                        </div>
                        <div className="col-md-7">
                            <label className="form-label small fw-medium text-secondary mb-1">Phone Number</label>
                            <input name="phone_number" type="tel" className="form-control bg-dark-subtle border-0 text-white rounded-3 py-2 px-3 shadow-none custom-input" style={inputStyle} onChange={handleChange} required placeholder="+1 (555) 000-0000" />
                        </div>
                    </div>

                    <div className="mt-3">
                        <label className="form-label small fw-medium text-secondary mb-1">Address</label>
                        <textarea name="address" rows="2" className="form-control bg-dark-subtle border-0 text-white rounded-3 py-2 px-3 shadow-none custom-input" style={inputStyle} onChange={handleChange} required placeholder="123 Street Name, City" />
                    </div>

                    <div className="mt-3 mb-4">
                        <label className="form-label small fw-medium text-secondary mb-1">Password</label>
                        <div className="position-relative">
                            <input name="password" type={showPassword ? "text" : "password"} className="form-control bg-dark-subtle border-0 text-white rounded-3 py-2 px-3 pe-5 shadow-none custom-input" style={inputStyle} onChange={handleChange} required placeholder="••••••••" />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="btn position-absolute top-50 end-0 translate-middle-y text-secondary border-0 p-2 shadow-none me-1" style={{ background: "transparent" }}>
                                {showPassword ? "🙈" : "👁️"}
                            </button>
                        </div>
                    </div>

                    {error && (
                        <div className="alert border-0 p-3 small text-center rounded-3 mb-3 d-flex align-items-center justify-content-center" style={{ background: "rgba(239, 68, 68, 0.2)", color: "#fca5a5" }}>
                            <span>⚠️ {error}</span>
                        </div>
                    )}

                    <button className="btn w-100 rounded-3 fw-bold py-3 text-white transition-all position-relative overflow-hidden register-btn" style={buttonStyle} disabled={loading}>
                        {loading ? (
                            <div className="d-flex align-items-center justify-content-center">
                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                Creating Account...
                            </div>
                        ) : "Sign Up"}
                    </button>
                </form>

                <p className="text-center mt-4 mb-0 small text-secondary">
                    Already have an account?{" "}
                    <Link to="/login" className="fw-semibold text-decoration-none custom-link" style={{ color: "#818cf8" }}>Login here</Link>
                </p>
            </div>

            <style>{`
                .custom-input {
                    transition: all 0.2s ease-in-out !important;
                }
                .custom-input:focus {
                    background-color: rgba(15, 23, 42, 0.6) !important;
                    box-shadow: 0 0 0 2px #6366f1 !important;
                }
                .register-btn {
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                }
                .register-btn:hover:not(:disabled) {
                    transform: translateY(-2px);
                    box-shadow: 0 10px 20px -10px #6366f1;
                    filter: brightness(1.1);
                }
                .register-btn:active:not(:disabled) {
                    transform: translateY(0);
                }
                .custom-link:hover {
                    text-decoration: underline !important;
                    color: #a5b4fc !important;
                }
            `}</style>
        </div>
    );
}

const inputStyle = {
    backgroundColor: "rgba(15, 23, 42, 0.4)",
    border: "1px solid rgba(255, 255, 255, 0.05)",
    fontSize: "0.95rem"
};

const buttonStyle = {
    background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
    border: "none",
    letterSpacing: "0.025em"
};

export default Register;

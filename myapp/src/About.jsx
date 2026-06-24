import React from "react";
import { useNavigate } from "react-router-dom";

function About() {
    const navi = useNavigate();

    return (
        <div className="bg-light min-vh-100" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            <style>{`
                .modern-hero-mask {
                    position: relative;
                    text-white;
                    text-align: center;
                    padding: 5rem 1rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 0 10px 30px -15px rgba(0,0,0,0.1);
                    height: 380px;
                    background-image: linear-gradient(rgba(15, 23, 42, 0.75), rgba(15, 23, 42, 0.85)), url('https://images.unsplash.com/photo-1492724441997-5dc865305da7');
                    background-size: cover;
                    background-position: center;
                    border-radius: 0 0 30px 30px;
                }
                .section-title {
                    letter-spacing: -1px;
                    color: #0f172a;
                    font-weight: 800;
                }
                .modern-glass-card {
                    background: #ffffff;
                    border: 1px solid #e2e8f0;
                    border-radius: 20px;
                    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.02), 0 8px 10px -6px rgba(0, 0, 0, 0.02);
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                }
                .interactive-hover-card:hover {
                    transform: translateY(-6px);
                    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 10px 10px -5px rgba(0, 0, 0, 0.02) !important;
                    border-color: #cbd5e1;
                }
                .profile-avatar-frame {
                    width: 90px;
                    height: 90px;
                    overflow: hidden;
                    border-radius: 50%;
                    background: #f8fafc;
                    border: 3px solid #ffffff;
                    box-shadow: 0 4px 10px rgba(0,0,0,0.08);
                    transition: transform 0.3s ease;
                }
                .interactive-hover-card:hover .profile-avatar-frame {
                    transform: scale(1.05);
                }
                .cta-gradient-box {
                    background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
                    border-radius: 24px;
                    box-shadow: 0 20px 40px -15px rgba(15, 23, 42, 0.3);
                }
                .btn-modern-light {
                    background: #ffffff;
                    color: #0f172a !important;
                    border: none;
                    border-radius: 12px;
                    font-size: 0.9rem;
                    font-weight: 600;
                    padding: 0.75rem 1.75rem;
                    transition: all 0.2s ease;
                }
                .btn-modern-light:hover {
                    background: #f8fafc;
                    transform: translateY(-1px);
                    box-shadow: 0 4px 12px rgba(255,255,255,0.15);
                }
            `}</style>

            <div className="modern-hero-mask">
                <div style={{ maxWidth: "720px" }} className="px-3 text-center w-100">
                    <span className="badge bg-white text-dark px-3 py-2 rounded-pill fw-bold text-uppercase mb-3 shadow-sm" style={{ fontSize: "0.72rem", letterSpacing: "0.5px" }}>
                        ✨ Est. Over a Decade
                    </span>
                    <h1 className="display-4 fw-extrabold text-white mb-3" style={{ letterSpacing: "-1.5px" }}>We Build Digital Connectivity</h1>
                    <p className="text-white-50 fs-5 mb-0 fw-light">
                        Bringing elite mobile technology retail and premium-grade technical hardware recovery services straight to Madurai.
                    </p>
                </div>
            </div>

            <div className="container py-5">
                <div className="row justify-content-center text-center mb-5">
                    <div className="col-md-8">
                        <h2 className="section-title mb-3">Who We Are</h2>
                        <p className="text-secondary lh-lg fs-6 fw-light">
                            <strong className="text-dark fw-semibold">ABNA Mobiles</strong> stands as an established hub for flagship smartphones,
                            curated tech essentials, and expert digital logic servicing. By backing our repairs with genuine spare parts
                            and precise hardware solutions, we ensure your personal workspace stays completely unbroken.
                        </p>
                    </div>
                </div>

                <div className="row g-4 text-center mb-5">
                    {[
                        { value: "50K+", label: "Happy Customers Served" },
                        { value: "120K+", label: "Devices Repaired & Tuned" },
                        { value: "10+", label: "Years of Retail Excellence" }
                    ].map((metric, i) => (
                        <div className="col-md-4" key={i}>
                            <div className="modern-glass-card interactive-hover-card p-4 h-100 d-flex flex-column justify-content-center">
                                <h2 className="display-5 fw-extrabold text-primary mb-1" style={{ letterSpacing: "-1px" }}>{metric.value}</h2>
                                <p className="text-muted fw-bold mb-0 small text-uppercase tracking-wider" style={{ fontSize: "0.72rem" }}>{metric.label}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="modern-glass-card p-4 p-md-5 mb-5">
                    <h3 className="section-title text-center mb-4 fs-4">Why Choose My Brand Mobiles?</h3>
                    <div className="row g-4">
                        <div className="col-md-6">
                            <div className="p-3 rounded-4 bg-light h-100">
                                <h6 className="fw-bold text-dark mb-2 d-flex align-items-center gap-2">
                                    <span>🛠️</span> Certified Bench Specialists
                                </h6>
                                <p className="text-secondary small lh-base mb-0 fw-light">Our diagnostic technicians utilize premium micro-soldering platforms and advanced interface repair procedures to execute zero-fault components recovery.</p>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="p-3 rounded-4 bg-light h-100">
                                <h6 className="fw-bold text-dark mb-2 d-flex align-items-center gap-2">
                                    <span>🛡️</span> Factory-Grade Component Stock
                                </h6>
                                <p className="text-secondary small lh-base mb-0 fw-light">We exclusively utilize pristine structural assemblies and premium performance components, maintaining your device’s original structural longevity.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mb-5 text-center">
                    <h3 className="section-title mb-1 fs-3">Our Leadership Team</h3>
                    <p className="text-muted small mb-4 fw-light">Driving innovation and technical precision across all support teams</p>

                    <div className="row g-4 justify-content-center">
                        {[
                            { name: "DEEPAK", role: "Chief Executive Officer", avatar: "https://www.shutterstock.com/image-vector/men-suits-icon-logo-vector-260nw-2560164933.jpg" },
                            { name: "AADHAV", role: "General Operations Manager", avatar: "https://png.pngtree.com/png-vector/20190420/ourmid/pngtree-vector-business-man-icon-png-image_966609.jpg" },
                            { name: "VIJAY", role: "Technical Services Director", avatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQh3xVYqfKTyKrp6cgB0l6G1MGByJCyVOwXog&s" }
                        ].map((member, i) => (
                            <div className="col-sm-6 col-md-4 col-lg-3" key={i}>
                                <div className="modern-glass-card interactive-hover-card p-4 h-100 text-center d-flex flex-column align-items-center justify-content-center">
                                    <div className="profile-avatar-frame mb-3">
                                        <img src={member.avatar} className="w-100 h-100" alt={member.name} style={{ objectFit: "cover" }} />
                                    </div>
                                    <h6 className="fw-bold text-dark mb-1 tracking-wide" style={{ fontSize: "0.95rem" }}>{member.name}</h6>
                                    <p className="text-muted small mb-0 fw-light">{member.role}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="cta-gradient-box text-white text-center p-4 p-md-5">
                    <div className="mx-auto" style={{ maxWidth: "620px" }}>
                        <span className="fs-3 mb-2 d-block fw-bold" style={{ letterSpacing: "-0.5px" }}>📍 Visit Us in Madurai Today</span>
                        <p className="text-white-50 mb-4 small lh-base fw-light">
                            Whether you are upgrading to an flagship smartphone, expanding your production kit setup with genuine accessories,
                            or requiring an on-the-spot display correction, our specialists stand ready to support.
                        </p>
                        <button
                            className="btn btn-modern-light shadow-sm"
                            onClick={() => navi("/contact")}
                        >
                            Contact Us
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default About;
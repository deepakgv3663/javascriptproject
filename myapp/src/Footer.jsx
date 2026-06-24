import React from "react";
import { Link } from "react-router-dom";

function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer
            className="mt-5"
            style={{
                background: "linear-gradient(135deg, #0f172a, #020617)",
                color: "#e2e8f0",
                borderTop: "1px solid rgba(255,255,255,0.08)"
            }}
        >
            <div
                className="container py-5"
                style={{ maxWidth: "1100px" }}
            >
                <div className="row g-4 mb-4">

                    {/* BRAND */}
                    <div className="col-md-5">
                        <h5
                            className="mb-3"
                            style={{
                                fontWeight: "800",
                                letterSpacing: "1px",
                                background: "linear-gradient(90deg,#3b82f6,#06b6d4)",
                                WebkitBackgroundClip: "text",
                                color: "transparent"
                            }}
                        >
                            MY BRAND MOBILES
                        </h5>

                        <p
                            style={{
                                color: "#94a3b8",
                                fontSize: "0.9rem",
                                lineHeight: "1.6",
                                maxWidth: "340px"
                            }}
                        >
                            Madurai's premier hub for professional smartphone retail,
                            factory-grade replacements, and expert hardware restoration diagnostics.
                        </p>

                        <div
                            style={{
                                fontSize: "0.8rem",
                                color: "#64748b",
                                fontFamily: "monospace"
                            }}
                        >
                            Mon - Sat: 10 AM - 10 PM<br/>
                            Sunday: 10 AM - 3 PM<br/>
                        </div>
                    </div>

                    {/* NAVIGATION */}
                    <div className="col-6 col-md-3">
                        <h6
                            style={{
                                fontSize: "0.75rem",
                                letterSpacing: "1px",
                                color: "#e2e8f0",
                                marginBottom: "12px"
                            }}
                        >
                            NAVIGATION
                        </h6>

                        <ul className="list-unstyled d-flex flex-column gap-2">
                            {[
                                { label: "Shop Home", path: "/" },
                                { label: "Our Services", path: "/service" },
                                { label: "About Brand", path: "/about" },
                                { label: "Order History", path: "/order-history" }
                            ].map((link, idx) => (
                                <li key={idx}>
                                    <Link
                                        to={link.path}
                                        style={{
                                            color: "#94a3b8",
                                            textDecoration: "none",
                                            fontSize: "0.9rem",
                                            transition: "all 0.3s ease"
                                        }}
                                        onMouseOver={(e) => {
                                            e.currentTarget.style.color = "#38bdf8";
                                            e.currentTarget.style.transform = "translateX(5px)";
                                        }}
                                        onMouseOut={(e) => {
                                            e.currentTarget.style.color = "#94a3b8";
                                            e.currentTarget.style.transform = "translateX(0px)";
                                        }}
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* CONTACT */}
                    <div className="col-12 col-md-4">
                        <h6
                            style={{
                                fontSize: "0.75rem",
                                letterSpacing: "1px",
                                color: "#e2e8f0",
                                marginBottom: "12px"
                            }}
                        >
                            STORE LOCATION
                        </h6>

                        <p
                            style={{
                                color: "#94a3b8",
                                fontSize: "0.9rem",
                                lineHeight: "1.6"
                            }}
                        >
                            366, Annai Street,<br />
                            Munichalai Main Road,<br />
                            Madurai - 625009, Tamil Nadu
                        </p>

                        <div
                            style={{
                                fontSize: "0.85rem",
                                color: "#94a3b8"
                            }}
                        >
                            <div>
                                <span style={{ color: "#38bdf8" }}>📞 Phone:</span>{" "}
                                <a
                                    href="tel:+919876543210"
                                    style={{
                                        color: "#cbd5f5",
                                        textDecoration: "none"
                                    }}
                                >
                                    +91 98765 43210
                                </a>
                            </div>

                            <div>
                                <span style={{ color: "#38bdf8" }}>✉️ Email:</span>{" "}
                                <a
                                    href="mailto:support@abnamobiles.com"
                                    style={{
                                        color: "#cbd5f5",
                                        textDecoration: "none"
                                    }}
                                >
                                    support@mybrandmobiles.com
                                </a>
                            </div>
                        </div>
                    </div>

                </div>

                {/* BOTTOM BAR */}
                <div
                    className="pt-3 mt-4 d-flex flex-column flex-sm-row justify-content-between align-items-center"
                    style={{
                        borderTop: "1px solid rgba(255,255,255,0.08)",
                        fontSize: "0.75rem",
                        color: "#64748b"
                    }}
                >
                    <p className="mb-1 mb-sm-0">
                        © {currentYear} My Brand Mobiles Private Limited
                    </p>

                    <p className="mb-0">
                        Designed for High Performance Digital Logic
                    </p>
                </div>

            </div>
        </footer>
    );
}

export default Footer;
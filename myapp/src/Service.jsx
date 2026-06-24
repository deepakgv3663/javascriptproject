import React from "react";
import { useNavigate } from "react-router-dom";

function Service() {
    const navi = useNavigate();

    const services = [
        {
            icon: "📱",
            title: "Mobile Sales",
            desc: "Premium flagship smartphones from elite brands including Apple, Samsung, OnePlus, and Xiaomi."
        },
        {
            icon: "🔧",
            title: "Expert Repair",
            desc: "On-the-spot board diagnosis, chip-level micro-soldering, and certified display replacements."
        },
        {
            icon: "🎧",
            title: "Premium Accessories",
            desc: "High-speed GaN chargers, studio-grade audio, drop-proof cases, and pro tempered glass layers."
        },
        {
            icon: "📲",
            title: "Secure Data Transfer",
            desc: "Safe, complete file system and message database migration from your legacy phone to your new device."
        }
    ];

    return (
        <div
            className="min-vh-100 py-5 px-3 position-relative d-flex flex-column align-items-center justify-content-center"
            style={{
                backgroundImage: "linear-gradient(rgba(15, 23, 42, 0.8), rgba(15, 23, 42, 0.85)), url('https://t3.ftcdn.net/jpg/05/19/73/36/360_F_519733648_tSMSHwqxw3TrbgFSXNKJVKncdkC0siTq.jpg')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundAttachment: "fixed"
            }}
        >
            <div className="container" style={{ maxWidth: "1100px" }}>

                <div className="text-center mb-5 text-white">
                    <span className="badge bg-info text-dark px-3 py-2 rounded-pill fw-bold text-uppercase tracking-wider mb-3" style={{ fontSize: "0.75rem" }}>
                        Certified Diagnostics & Solutions
                    </span>
                    <h1 className="display-4 fw-extrabold tracking-tight mb-2">Our Core Ecosystem Services</h1>
                    <p className="text-white-50 mx-auto" style={{ maxWidth: "600px" }}>
                        From pristine hardware purchases to high-precision hardware micro-repairs, we ensure your daily driver operations run seamlessly.
                    </p>
                </div>

                <div className="row g-4 justify-content-center mb-5">
                    {services.map((item, idx) => (
                        <div className="col-sm-6 col-lg-3" key={idx}>
                            <div
                                className="card border-0 h-100 text-center p-4 text-white rounded-4 transition-up"
                                style={{
                                    background: "rgba(255, 255, 255, 0.06)",
                                    backdropFilter: "blur(16px)",
                                    WebkitBackdropFilter: "blur(16px)",
                                    border: "1px solid rgba(255, 255, 255, 0.1)",
                                    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2)"
                                }}
                                onMouseOver={(e) => {
                                    e.currentTarget.style.background = "rgba(255, 255, 255, 0.12)";
                                    e.currentTarget.style.transform = "translateY(-5px)";
                                }}
                                onMouseOut={(e) => {
                                    e.currentTarget.style.background = "rgba(255, 255, 255, 0.06)";
                                    e.currentTarget.style.transform = "translateY(0)";
                                }}
                            >
                                <div className="display-5 mb-3 bg-white bg-opacity-10 d-inline-flex p-3 rounded-circle mx-auto align-items-center justify-content-center" style={{ width: "70px", height: "70px" }}>
                                    {item.icon}
                                </div>
                                <h5 className="fw-bold tracking-wide mb-2">{item.title}</h5>
                                <p className="text-white-50 small mb-0 lh-base">{item.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="row justify-content-center pt-3">
                    <div className="col-md-8 col-lg-6">
                        <div
                            className="p-4 rounded-4 text-center text-white"
                            style={{
                                background: "rgba(0, 198, 255, 0.1)",
                                border: "1px solid rgba(0, 198, 255, 0.25)",
                                backdropFilter: "blur(8px)"
                            }}
                        >
                            <h5 className="fw-bold mb-3">📞 Need Immediate Technical Support?</h5>
                            <div className="d-flex flex-wrap justify-content-center gap-3 gap-md-4 font-monospace small tracking-wide mb-3">
                                <div>
                                    <span className="text-info">Office Number:</span> 0452-123098
                                </div>
                                <div className="d-none d-md-block text-white-50">|</div>
                                <div>
                                    <span className="text-info">Direct Support:</span> +91 98765 43210
                                </div>
                            </div>
                            <button
                                className="btn btn-info text-dark fw-bold px-4 py-2 rounded-3 shadow-sm"
                                onClick={() => navi("/contact")}
                            >
                                Get In Touch ➔
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default Service;
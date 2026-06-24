import React, { useEffect, useState, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";

const API = "http://localhost:5000";

function Navbar() {
    const [count, setCount] = useState(0);
    const [user, setUser] = useState(null);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [ordersDropdownOpen, setOrdersDropdownOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const navigate = useNavigate();
    const dropdownRef = useRef();
    const ordersDropdownRef = useRef();

    // =========
    // LOAD USER
    // =========
    const loadUser = () => {
        const stored = JSON.parse(localStorage.getItem("user"));
        setUser(stored);
    };

    // =========
    // LOAD CART
    // =========
    const loadCart = async () => {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (!storedUser?.id) { setCount(0); return; }

        try {
            const res = await fetch(`${API}/cart?user_id=${storedUser.id}`);
            const data = await res.json();
            setCount(Array.isArray(data) ? data.reduce((sum, item) => sum + Number(item.qty), 0) : 0);
        } catch { setCount(0); }
    };

    // ======
    // LOGOUT
    // ======
    const handleLogout = () => {
        localStorage.removeItem("user");
        setUser(null);
        setCount(0);
        setDropdownOpen(false);
        setOrdersDropdownOpen(false);
        setMobileMenuOpen(false);

        window.dispatchEvent(new Event("authChanged"));
        window.dispatchEvent(new Event("cartUpdated"));

        navigate("/login");
    };

    const handleOrderFilterNavigation = (filterType) => {
        setOrdersDropdownOpen(false);
        setMobileMenuOpen(false);
        navigate("/order-history", { state: { filter: filterType } });
    };

    // ======
    // EVENTS
    // ======
    useEffect(() => {
        loadUser();
        loadCart();

        window.addEventListener("authChanged", loadUser);
        window.addEventListener("cartUpdated", loadCart);

        return () => {
            window.removeEventListener("authChanged", loadUser);
            window.removeEventListener("cartUpdated", loadCart);
        };
    }, []);

    // =====================
    // CLOSE DROPDOWN & MENU
    // =====================
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setDropdownOpen(false);
            }
            if (ordersDropdownRef.current && !ordersDropdownRef.current.contains(e.target)) {
                setOrdersDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const linkClass = ({ isActive }) =>
        `nav-link px-3 py-1.5 position-relative fw-bold transition-all ${isActive
            ? "text-primary active-pill-link"
            : "text-secondary custom-modern-hover"
        }`;

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap');
                
                .glass-nav {
                    background: rgba(255, 255, 255, 0.85) !important;
                    backdrop-filter: blur(20px) saturate(190%);
                    -webkit-backdrop-filter: blur(20px) saturate(190%);
                    font-family: 'Plus Jakarta Sans', sans-serif;
                }
                .custom-modern-hover {
                    color: #64748b !important;
                    transition: color 0.2s ease;
                }
                .custom-modern-hover:hover {
                    color: #0d6efd !important;
                }
                .active-pill-link {
                    color: #0d6efd !important;
                }
                /* Elegant minimalist active under-dot instead of clunky container capsules */
                .active-pill-link::after {
                    content: '';
                    position: absolute;
                    bottom: -4px;
                    left: 50%;
                    transform: translateX(-50%);
                    width: 5px;
                    height: 5px;
                    background-color: #0d6efd;
                    border-radius: 50%;
                }
                .transition-all {
                    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
                }
                .scale-active:active {
                    transform: scale(0.96);
                }
                .custom-badge {
                    font-size: 0.65rem;
                    min-width: 18px;
                    height: 18px;
                    padding: 0 4px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    top: -1px !important;
                    right: -1px !important;
                }
                .avatar-icon-circle {
                    width: 26px;
                    height: 26px;
                    background: linear-gradient(135deg, #475569, #1e293b);
                    color: #fff;
                    font-size: 0.75rem;
                    font-weight: 700;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .dropdown-animate {
                    transform-origin: top right;
                    animation: slideDownIn 0.22s cubic-bezier(0.4, 0, 0.2, 1) forwards;
                }
                @keyframes slideDownIn {
                    from { opacity: 0; transform: translateY(6px) scale(0.97); }
                    to { opacity: 1; transform: translateY(0) scale(1); }
                }
                .utility-icon-wrapper {
                    background-color: #f8fafc;
                    border: 1px solid #e2e8f0;
                    transition: all 0.2s ease;
                }
                .utility-icon-wrapper:hover {
                    background-color: #ffffff !important;
                    border-color: #cbd5e1 !important;
                    box-shadow: 0 10px 15px -3px rgba(0,0,0,0.04) !important;
                }
                .burger-btn {
                    border: none;
                    background: transparent;
                    padding: 6px 10px;
                }
                .dropdown-item-modern {
                    border: none;
                    background: transparent;
                    width: 100%;
                    text-align: left;
                    padding: 9px 14px;
                    font-size: 0.85rem;
                    font-weight: 600;
                    color: #475569;
                    transition: all 0.15s ease;
                }
                .dropdown-item-modern:hover {
                    background-color: #f1f5f9;
                    color: #0d6efd;
                }
                .dropdown-item-modern.text-danger:hover {
                    background-color: #fef2f2;
                    color: #dc3545;
                }
            `}</style>

            <nav className="navbar navbar-expand-lg glass-nav sticky-top border-bottom border-light-subtle py-2.5">
                <div className="container">

                    
                    <h5
                        className="fw-bold d-flex align-items-center gap-2 m-0 text-dark scale-active transition-all"
                        style={{ cursor: "pointer", letterSpacing: "-0.6px", fontSize: "1.1rem" }}
                        onClick={() => { navigate("/"); setMobileMenuOpen(false); }}
                    >
                        <span className="bg-primary text-white p-2 rounded-3 d-flex align-items-center justify-content-center shadow-sm fw-normal" style={{ width: "32px", height: "32px", fontSize: "0.9rem" }}>
                            ⚡
                        </span>
                        <span className="fw-extrabold tracking-tight" style={{ color: "#0f172a" }}>MY BRAND</span>
                    </h5>

                    <div className="navbar-nav mx-auto gap-3 d-none d-lg-flex align-items-center">
                        <NavLink to="/" className={linkClass}>Home</NavLink>
                        <NavLink to="/products" className={linkClass}>Products</NavLink>
                        <NavLink to="/service" className={linkClass}>Service</NavLink>
                        <NavLink to="/about" className={linkClass}>About</NavLink>
                        <NavLink to="/contact" className={linkClass}>Contact</NavLink>

                        <div ref={ordersDropdownRef} className="position-relative d-inline-block">
                            <button
                                className={`nav-link px-3 py-1.5 fw-bold border-0 bg-transparent transition-all ${ordersDropdownOpen ? 'text-primary' : 'text-secondary custom-modern-hover'}`}
                                onClick={() => setOrdersDropdownOpen(!ordersDropdownOpen)}
                                style={{ outline: "none" }}
                            >
                                Orders <span style={{ fontSize: "0.62rem", verticalAlign: "middle" }} className="ms-1">▼</span>
                            </button>

                            {ordersDropdownOpen && (
                                <div
                                    className="dropdown-menu show position-absolute start-50 translate-middle-x mt-2 shadow-lg border border-light-subtle rounded-3 p-1 bg-white dropdown-animate"
                                    style={{ minWidth: "160px", zIndex: 1050 }}
                                >
                                    <button
                                        onClick={() => handleOrderFilterNavigation("confirmed")}
                                        className="dropdown-item-modern text-success rounded-2 mb-0.5"
                                    >
                                        Confirm Orders
                                    </button>
                                    <button
                                        onClick={() => handleOrderFilterNavigation("cancelled")}
                                        className="dropdown-item-modern text-danger rounded-2"
                                    >
                                        Cancel Orders
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                   
                    <div className="d-flex align-items-center gap-2">

                        <div
                            onClick={() => navigate("/cart")}
                            className="position-relative d-flex align-items-center justify-content-center rounded-circle utility-icon-wrapper scale-active"
                            style={{ cursor: "pointer", width: "38px", height: "38px" }}
                        >
                            <span style={{ fontSize: "1rem" }}>🛒</span>
                            {count > 0 && (
                                <span className="badge bg-danger position-absolute custom-badge rounded-pill border border-2 border-white">
                                    {count}
                                </span>
                            )}
                        </div>

                        <div className="d-none d-sm-block">
                            {user ? (
                                <div ref={dropdownRef} className="position-relative">
                                    <button
                                        className="btn bg-white border rounded-pill p-1 pe-2.5 ps-1 d-flex align-items-center gap-2 shadow-sm scale-active transition-all"
                                        onClick={() => setDropdownOpen(!dropdownOpen)}
                                    >
                                        <div className="avatar-icon-circle">
                                            {user.email ? user.email.charAt(0).toUpperCase() : "U"}
                                        </div>
                                        <span className="fw-bold text-dark small" style={{ maxWidth: "90px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                            {user.email ? user.email.split("@")[0] : "Account"}
                                        </span>
                                        <span style={{ fontSize: "0.6rem", color: "#94a3b8" }}>▼</span>
                                    </button>

                                    {dropdownOpen && (
                                        <div className="dropdown-menu show position-absolute end-0 mt-2 shadow-lg border border-light-subtle rounded-3 p-1 bg-white dropdown-animate" style={{ minWidth: "160px", zIndex: 1050 }}>
                                            <button
                                                onClick={handleLogout}
                                                className="dropdown-item-modern text-danger rounded-2"
                                            >
                                                Logout
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <button
                                    className="btn btn-primary rounded-pill px-3.5 py-1.5 fw-bold shadow-sm scale-active transition-all"
                                    style={{ fontSize: "0.82rem" }}
                                    onClick={() => navigate("/login")}
                                >
                                    Login
                                </button>
                            )}
                        </div>

                        <button
                            className="burger-btn d-lg-none scale-active transition-all ms-1"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            aria-label="Toggle navigation"
                        >
                            <span style={{ fontSize: "1.2rem", color: "#334155" }}>{mobileMenuOpen ? "✕" : "☰"}</span>
                        </button>
                    </div>
                </div>

                {mobileMenuOpen && (
                    <div className="w-100 d-lg-none border-top mt-2 pt-2 px-3 dropdown-animate bg-white">
                        <div className="d-flex flex-column gap-1 pb-3">
                            <NavLink to="/" onClick={() => setMobileMenuOpen(false)} className="nav-link p-2 fw-bold text-dark border-bottom border-light">Home</NavLink>
                            <NavLink to="/products" onClick={() => setMobileMenuOpen(false)} className="nav-link p-2 fw-bold text-dark border-bottom border-light">Products</NavLink>
                            <NavLink to="/service" onClick={() => setMobileMenuOpen(false)} className="nav-link p-2 fw-bold text-dark border-bottom border-light">Service</NavLink>
                            <NavLink to="/about" onClick={() => setMobileMenuOpen(false)} className="nav-link p-2 fw-bold text-dark border-bottom border-light">About</NavLink>
                            <NavLink to="/contact" onClick={() => setMobileMenuOpen(false)} className="nav-link p-2 fw-bold text-dark border-bottom border-light">Contact</NavLink>

                           
                            <div className="border-bottom border-light py-2 bg-light rounded-3 px-2 mt-2">
                                <span className="small text-muted fw-bold d-block mb-1.5 px-1" style={{ fontSize: '0.7rem', letterSpacing: '0.3px' }}>ORDERS TRACKER</span>
                                <button
                                    onClick={() => handleOrderFilterNavigation("confirmed")}
                                    className="btn btn-sm text-start w-100 fw-bold py-1.5 text-success bg-transparent border-0"
                                >
                                    Confirm Orders
                                </button>
                                <button
                                    onClick={() => handleOrderFilterNavigation("cancelled")}
                                    className="btn btn-sm text-start w-100 fw-bold py-1.5 text-danger bg-transparent border-0"
                                >
                                    Cancel Orders
                                </button>
                            </div>

                            <div className="pt-2 d-block d-sm-none">
                                {user ? (
                                    <div className="bg-light rounded-3 p-2">
                                        <div className="small fw-bold text-muted mb-2 text-truncate px-1">👤 {user.email}</div>
                                        <button onClick={handleLogout} className="btn btn-sm btn-danger w-100 rounded-2 fw-bold">Logout</button>
                                    </div>
                                ) : (
                                    <button onClick={() => { setMobileMenuOpen(false); navigate("/login"); }} className="btn btn-primary w-100 rounded-3 py-2 fw-bold">Login</button>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </nav>
        </>
    );
}

export default Navbar;
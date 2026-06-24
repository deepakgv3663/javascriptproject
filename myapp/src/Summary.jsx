import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function Summary() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const [editMode, setEditMode] = useState(false);

  const [cartItems, setCartItems] = useState(
    (state?.cart || []).map((item) => ({
      ...item,
      qty: item.qty ? item.qty : 1,
    }))
  );

  const [user, setUser] = useState(() => {
    if (state?.user) return state.user;

    const savedUserStr = localStorage.getItem("user");
    if (savedUserStr) {
      try {
        const parsedUser = JSON.parse(savedUserStr);
        return {
          name: parsedUser.name || "Deepak G V",
          phone: parsedUser.phone || "9876543210",
          address: parsedUser.address || parsedUser.delivery_address || "Madurai, Tamil Nadu",
          pincode: parsedUser.pincode || parsedUser.pin || "625001",
        };
      } catch (err) {
        console.error("Error parsing user data from localStorage", err);
      }
    }

    // return {
    //   name: "Deepak G V",
    //   phone: "9876543210",
    //   address: "Madurai, Tamil Nadu",
    //   pincode: "625001",
    // };
  });

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const increaseQty = (id) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, qty: (item.qty || 1) + 1 } : item
      )
    );
  };

  const decreaseQty = (id) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, qty: (item.qty || 1) > 1 ? item.qty - 1 : 1 }
          : item
      )
    );
  };


  const subtotal = cartItems.reduce(
    (sum, item) => sum + (item.price || 0) * (item.qty || 1),
    0
  );

  const delivery = subtotal > 2000 ? 200 : 100;
  const gst = Math.round(subtotal * 0.05);
  const total = subtotal + delivery + gst;

  if (!cartItems.length) {
    return (
      <div className="container my-5 text-center py-5" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        <div className="fs-1 mb-3">🔍</div>
        <h4 className="fw-extrabold text-dark mb-2">No items selected</h4>
        <p className="text-muted small">Please go back and select products to checkout.</p>
        <button className="btn btn-outline-secondary mt-3 px-4 py-2 rounded-3 fw-semibold text-dark small" onClick={() => navigate(-1)}>
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="container my-5" style={{ maxWidth: "1140px", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>

      <style>{`
        .checkout-heading {
          letter-spacing: -1.5px;
          color: #0f172a;
        }
        .modern-summary-card {
          background: #ffffff;
          border-radius: 20px;
          border: 1px solid #e2e8f0;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.02), 0 8px 10px -6px rgba(0, 0, 0, 0.02);
        }
        .modern-badge-address {
          background-color: #f8fafc;
          border-left: 4px solid #0d6efd !important;
          border: 1px solid #e2e8f0;
        }
        .modern-input-field {
          border-radius: 12px !important;
          padding: 0.65rem 1rem;
          background-color: #f8fafc;
          border: 1px solid #e2e8f0;
          font-size: 0.88rem;
          color: #334155 !important;
          transition: all 0.2s ease;
        }
        .modern-input-field:focus {
          background-color: #ffffff;
          border-color: #0d6efd;
          box-shadow: 0 0 0 4px rgba(13, 110, 253, 0.08);
        }
        .img-preview-box {
          width: 56px;
          height: 56px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 6px;
          overflow: hidden;
        }
        .qty-stepper-container {
          height: 34px;
          border: 1px solid #e2e8f0;
          background: #ffffff;
          border-radius: 10px;
          overflow: hidden;
          box-shadow: 0 1px 2px rgba(0,0,0,0.02);
        }
        .qty-stepper-btn {
          background: transparent;
          border: none;
          width: 32px;
          height: 100%;
          font-weight: 600;
          color: #64748b;
          transition: background 0.15s ease;
        }
        .qty-stepper-btn:hover {
          background: #f1f5f9;
          color: #0f172a;
        }
        .btn-payment-action {
          background: #0d6efd;
          color: #ffffff;
          border: none;
          border-radius: 12px;
          font-size: 0.95rem;
          font-weight: 700;
          padding: 0.9rem 1.5rem;
          transition: background 0.2s ease;
        }
        .btn-payment-action:hover {
          background: #0b5ed7;
          color: #ffffff;
        }
        .btn-action-edit {
          font-size: 0.8rem;
          font-weight: 600;
          border-radius: 8px;
          padding: 0.4rem 0.8rem;
        }
      `}</style>

      <div className="mb-4">
        <button className="btn btn-link text-decoration-none text-muted p-0 small fw-medium mb-1" onClick={() => navigate(-1)}>
          ← Return to Products
        </button>
        <h2 className="checkout-heading fw-extrabold m-0">Checkout Summary</h2>
      </div>

      <div className="row g-4">

        <div className="col-lg-7">

          <div className="card modern-summary-card p-4 mb-4 border-0">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="fw-bold mb-0 text-dark d-flex align-items-center gap-2" style={{ letterSpacing: "-0.3px" }}>
                <span>📍</span> Delivery Details
              </h5>
              <button
                className={`btn btn-action-edit shadow-none m-0 ${editMode ? "btn-primary px-3" : "btn-outline-secondary"}`}
                onClick={() => setEditMode(!editMode)}
              >
                {editMode ? "Save Details" : "Edit Details"}
              </button>
            </div>

            {!editMode ? (
              <div className="modern-badge-address p-3 rounded-4">
                <p className="fw-bold text-dark mb-1" style={{ fontSize: "0.95rem" }}>{user.name}</p>
                <p className="text-muted small mb-2 fw-medium">📞 {user.phone}</p>
                <p className="text-secondary mb-0 small lh-base">{user.address} — <span className="fw-bold text-dark">{user.pincode}</span></p>
              </div>
            ) : (
              <div className="row g-3">
                <div className="col-sm-6">
                  <label className="form-label small fw-bold text-secondary mb-1">Full Name</label>
                  <input className="form-control modern-input-field" name="name" value={user.name} onChange={handleChange} />
                </div>
                <div className="col-sm-6">
                  <label className="form-label small fw-bold text-secondary mb-1">Phone Number</label>
                  <input className="form-control modern-input-field" name="phone" value={user.phone} onChange={handleChange} />
                </div>
                <div className="col-12">
                  <label className="form-label small fw-bold text-secondary mb-1">Street Address</label>
                  <textarea className="form-control modern-input-field" rows="2" name="address" value={user.address} onChange={handleChange} />
                </div>
                <div className="col-sm-6">
                  <label className="form-label small fw-bold text-secondary mb-1">Pincode</label>
                  <input className="form-control modern-input-field" name="pincode" value={user.pincode} onChange={handleChange} />
                </div>
              </div>
            )}
          </div>

          <div className="card modern-summary-card p-4 border-0">
            <h5 className="fw-bold mb-3 text-dark d-flex align-items-center gap-2" style={{ letterSpacing: "-0.3px" }}>
              <span>🛍️</span> Review Items ({cartItems.length})
            </h5>

            <div className="d-flex flex-column gap-3">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center bg-light p-3 rounded-4 border g-3"
                >
                  <div className="d-flex align-items-center gap-3">
                    {item.img && (
                      <div className="img-preview-box flex-shrink-0">
                        <img
                          src={item.img}
                          alt={item.name}
                          style={{ maxHeight: "100%", maxWidth: "100%", objectFit: "contain" }}
                        />
                      </div>
                    )}
                    <div className="text-truncate">
                      <h6 className="fw-bold text-dark text-truncate mb-1 small" style={{ maxWidth: "260px" }} title={item.name}>{item.name}</h6>
                      <p className="text-muted small fw-medium mb-0">₹{Number(item.price || 0).toLocaleString()} each</p>
                    </div>
                  </div>

                  <div className="d-flex align-items-center justify-content-between justify-content-sm-end gap-4 mt-2 mt-sm-0">
                    {/* Compact Modern Stepper */}
                    <div className="qty-stepper-container d-flex align-items-center">
                      <button className="qty-stepper-btn" onClick={() => decreaseQty(item.id)}>−</button>
                      <span className="px-2 small fw-bold text-dark text-center" style={{ minWidth: "24px" }}>{item.qty}</span>
                      <button className="qty-stepper-btn" onClick={() => increaseQty(item.id)}>+</button>
                    </div>

                    <span className="fw-extrabold text-dark text-end" style={{ minWidth: "90px", fontSize: "0.95rem" }}>
                      ₹{Number((item.price || 0) * (item.qty || 1)).toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        <div className="col-lg-5">
          <div className="card modern-summary-card p-4 sticky-top border-0" style={{ top: "2rem" }}>
            <h5 className="fw-bold mb-3 text-dark" style={{ letterSpacing: "-0.3px" }}>Price Details</h5>

            <div className="d-flex justify-content-between mb-2 small fw-medium text-secondary">
              <span>Subtotal</span>
              <span className="text-dark">₹{subtotal.toLocaleString()}</span>
            </div>

            <div className="d-flex justify-content-between mb-2 small fw-medium text-secondary">
              <span>Delivery Fee</span>
              <span className="text-dark">₹{delivery.toLocaleString()}</span>
            </div>

            <div className="d-flex justify-content-between mb-3 small fw-medium text-secondary">
              <span>Estimated GST (5%)</span>
              <span className="text-dark">₹{gst.toLocaleString()}</span>
            </div>

            <hr className="text-muted my-3" />

            <div className="d-flex justify-content-between align-items-center mb-4">
              <span className="fw-bold text-dark" style={{ fontSize: "1rem" }}>Total Amount</span>
              <span className="fw-extrabold text-success fs-4">₹{total.toLocaleString()}</span>
            </div>

            <button
              className="btn btn-payment-action w-100 shadow-sm mb-2"
              onClick={() =>
                navigate("/order-summary", {
                  state: { user, cartItems, subtotal, delivery, gst, total },
                })
              }
            >
              Proceed to Payment
            </button>

            <p className="text-center text-muted card-text style-protection mt-3" style={{ fontSize: "0.72rem", fw: 500 }}>
              🔒 Safe & Secure Checkout System
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Summary;
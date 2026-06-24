import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

function OrderSummary() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const order = state || {};
  const cartItems = order.cartItems || [];

  if (!cartItems.length) {
    return (
      <div className="container my-5 text-center py-5" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        <div className="fs-1 mb-3">📋</div>
        <h4 className="fw-extrabold text-dark mb-2">No Order Data Found</h4>
        <p className="text-muted small">It seems you don't have an active checkout session running.</p>
        <button className="btn btn-primary mt-3 px-4 py-2 rounded-3 fw-bold small" onClick={() => navigate("/")}>
          Go to Shop
        </button>
      </div>
    );
  }

  const handlePayment = (method) => {
    navigate("/success", {
      state: { ...order, payment: method },
    });
  };

  return (
    <div className="container my-5" style={{ maxWidth: "1100px", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>

      <style>{`
        .summary-heading {
          letter-spacing: -1.5px;
          color: #0f172a;
        }
        .modern-summary-card {
          background: #ffffff;
          border-radius: 20px;
          border: 1px solid #e2e8f0;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.02), 0 8px 10px -6px rgba(0, 0, 0, 0.02);
        }
        .img-preview-box {
          width: 52px;
          height: 52px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 4px;
          overflow: hidden;
        }
        .destination-badge-box {
          background-color: #f8fafc;
          border: 1px solid #e2e8f0;
        }
        .dark-architecture-card {
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
          border-radius: 20px;
          box-shadow: 0 20px 40px -15px rgba(15, 23, 42, 0.25);
        }
        .gateway-btn-primary {
          background: #0d6efd;
          color: #ffffff;
          border: none;
          border-radius: 12px;
          transition: all 0.2s ease;
        }
        .gateway-btn-primary:hover {
          background: #0b5ed7;
          transform: translateY(-1px);
        }
        .gateway-btn-secondary {
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.15);
          color: #ffffff;
          border-radius: 12px;
          transition: all 0.2s ease;
        }
        .gateway-btn-secondary:hover {
          background: rgba(255, 255, 255, 0.08);
          border-color: rgba(255, 255, 255, 0.3);
          transform: translateY(-1px);
        }
      `}</style>

      <div className="text-center mb-5">
        <h2 className="summary-heading fw-extrabold m-0">Review & Pay</h2>
        <p className="text-muted small mt-1 fw-light">Please look over your invoice parameters before committing capital.</p>
      </div>

      <div className="row g-4">

        <div className="col-lg-7">

          <div className="card modern-summary-card border-0 p-4 mb-4">
            <h5 className="fw-bold text-dark mb-3 d-flex align-items-center gap-2" style={{ letterSpacing: "-0.3px" }}>
              <span>🛍️</span> Review Items
            </h5>

            <div className="d-flex flex-column gap-2">
              {cartItems.map((item, i) => (
                <div
                  key={i}
                  className={`d-flex justify-content-between align-items-center py-3 ${i !== cartItems.length - 1 ? "border-bottom" : ""}`}
                >
                  <div className="d-flex align-items-center gap-3 text-truncate">
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
                      <h6 className="fw-bold text-dark mb-0 small text-truncate" style={{ maxWidth: "280px" }} title={item.name}>{item.name}</h6>
                      <small className="text-muted fw-medium">
                        ₹{Number(item.price || 0).toLocaleString()} × {item.qty}
                      </small>
                    </div>
                  </div>
                  <span className="fw-extrabold text-dark small ps-2">
                    ₹{Number((item.price || 0) * (item.qty || 1)).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="card modern-summary-card border-0 p-4">
            <h5 className="fw-bold text-dark mb-3 d-flex align-items-center gap-2" style={{ letterSpacing: "-0.3px" }}>
              <span></span> Delivery Location
            </h5>

            <div className="destination-badge-box p-3 rounded-4">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="fw-bold text-dark" style={{ fontSize: "0.95rem" }}>{order.user?.name}</span>
                <span className="badge bg-white text-secondary border font-monospace rounded px-2 py-1" style={{ fontSize: "0.68rem", fontWeight: "700" }}>HOME</span>
              </div>
              <p className="text-muted small mb-1 fw-medium">{order.user?.phone}</p>
              <p className="text-secondary small mb-0 lh-base">
                {order.user?.address} — <span className="fw-bold text-dark">{order.user?.pincode}</span>
              </p>
            </div>
          </div>

        </div>

        <div className="col-lg-5">
          <div className="sticky-top" style={{ top: "2rem" }}>

            <div className="card modern-summary-card border-0 p-4 mb-4 bg-white">
              <h5 className="fw-bold text-dark mb-3" style={{ letterSpacing: "-0.3px" }}>Payment Statement</h5>

              <div className="d-flex justify-content-between mb-2 text-secondary small fw-medium">
                <span>Items Subtotal</span>
                <span className="text-dark">₹{Number(order.subtotal || 0).toLocaleString()}</span>
              </div>

              <div className="d-flex justify-content-between mb-2 text-secondary small fw-medium">
                <span>Logistics & Shipping</span>
                <span className="text-dark">₹{Number(order.delivery || 0).toLocaleString()}</span>
              </div>

              <div className="d-flex justify-content-between mb-3 text-secondary small fw-medium">
                <span>GST (5%)</span>
                <span className="text-dark">₹{Number(order.gst || 0).toLocaleString()}</span>
              </div>

              <hr className="text-muted my-3" />

              <div className="d-flex justify-content-between align-items-center">
                <span className="fw-bold text-dark" style={{ fontSize: "0.95rem" }}>Final Payable Amount</span>
                <span className="fw-extrabold text-success fs-4">₹{Number(order.total || 0).toLocaleString()}</span>
              </div>
            </div>

            <div className="card dark-architecture-card border-0 p-4 text-white">
              <h5 className="fw-bold text-white mb-1" style={{ fontSize: "1.1rem", letterSpacing: "-0.2px" }}>Select Payment Architecture</h5>
              <p className="text-white-50 small mb-4 fw-light">Choose your preferred settlement process strategy.</p>

              <div className="d-flex flex-column gap-2">
                <button
                  className="btn gateway-btn-primary py-3 fw-bold d-flex justify-content-between align-items-center px-4"
                  onClick={() => handlePayment("Online Payment")}
                >
                  <span className="d-flex align-items-center gap-2 small">
                    Pay Securely Online
                  </span>
                  <span className="small">→</span>
                </button>

                <button
                  className="btn gateway-btn-secondary py-3 fw-bold d-flex justify-content-between align-items-center px-4"
                  onClick={() => handlePayment("Cash on Delivery")}
                >
                  <span className="d-flex align-items-center gap-2 small">
                    Cash on Delivery (COD)
                  </span>
                  <span className="small">→</span>
                </button>
              </div>

            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

export default OrderSummary;
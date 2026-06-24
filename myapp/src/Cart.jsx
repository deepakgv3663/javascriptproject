import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API = "http://localhost:5000";

function Cart() {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  
  // Toast Notification States
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastType, setToastType] = useState("default"); // Added to track custom color profiles

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const token = localStorage.getItem("token");

  const triggerToast = (msg, type = "default") => {
    setToastMessage(msg);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3000); 
  };

  // ==========
  // FETCH CART
  // ==========
  const fetchCart = async (showSilence = false) => {
    if (!user || !user.id) {
      navigate("/login");
      return;
    }

    if (!showSilence) setLoading(true);

    try {
      const res = await fetch(`${API}/cart?user_id=${user.id}`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      const data = await res.json();
      const safe = Array.isArray(data) ? data : [];

      const formatted = safe.map((item) => ({
        ...item,
        price: Number(item.price) || 0,
        qty: Number(item.qty) || 1,
      }));

      setCart(formatted);
    } catch (err) {
      console.error("Failed to fetch cart:", err);
      setCart([]);
    } finally {
      setLoading(false);
      setUpdatingId(null);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // ================
  // QUANTITY HANDLER
  // ================
  const handleQuantity = async (productId, action, currentQty) => {
    if (action === "decrease" && currentQty <= 1) return;

    setUpdatingId(productId);
    try {
      const res = await fetch(`${API}/cart/update-qty`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          user_id: user.id,
          product_id: productId,
          action: action,
        }),
      });

      if (!res.ok) throw new Error("Update failed");

      window.dispatchEvent(new Event("cartUpdated"));
      fetchCart(true);
    } catch (err) {
      console.error("Failed to update item count:", err);
      setUpdatingId(null);
    }
  };

  // ==============
  // REMOVE HANDLER
  // ==============
  const removeItem = async (productId) => {
    if (!window.confirm("Are you sure you want to remove this item?")) return;

    setUpdatingId(productId);
    try {
      const res = await fetch(`${API}/cart/remove/${productId}?user_id=${user.id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (!res.ok) throw new Error("Deletion failed");

      window.dispatchEvent(new Event("cartUpdated"));
      await fetchCart(true);
    
      triggerToast("Product deleted successfully!", "danger");
    } catch (err) {
      console.error("Failed to remove item:", err);
      setUpdatingId(null);
    }
  };

  // ===============================
  // CALCULATIONS WITH THE CONDITION
  // ===============================
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const freeShippingThreshold = 5000;
  const remainingForFreeShipping = Math.max(freeShippingThreshold - subtotal, 0);

  const shipping = subtotal >= freeShippingThreshold ? 0 : 500;
  const total = subtotal + shipping;
  const progressToFreeShipping = Math.min((subtotal / freeShippingThreshold) * 100, 100);

  if (loading) {
    return (
      <div className="container mt-5 py-5 text-center d-flex flex-column align-items-center justify-content-center" style={{ minHeight: "60vh" }}>
        <div className="spinner-border text-primary" role="status" style={{ width: "3rem", height: "3rem" }}></div>
        <h5 className="fw-bold text-dark mt-4 mb-1">Retrieving Secure Cart</h5>
        <p className="text-muted small">Arranging your selected tech models shortly...</p>
      </div>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap');
        
        .cart-viewport {
          font-family: 'Plus Jakarta Sans', sans-serif;
          background-color: #f8fafc;
        }
        .premium-card {
          background: #ffffff !important;
          border: 1px solid #e2e8f0 !important;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.02) !important;
        }
        .qty-pill-box {
          background: #f1f5f9;
          padding: 3px;
        }
        .qty-btn {
          width: 28px;
          height: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          color: #0f172a;
          border-radius: 8px;
          font-weight: bold;
          transition: all 0.2s ease;
        }
        .qty-btn:hover:not(:disabled) {
          background: #0d6efd;
          color: #ffffff;
          border-color: #0d6efd;
        }
        .product-thumbnail {
          object-fit: cover;
          border: 1px solid #f1f5f9;
          transition: transform 0.3s ease;
        }
        .cart-item-row:hover .product-thumbnail {
          transform: scale(1.03);
        }
        .cart-item-row {
          transition: all 0.2s ease;
        }
        .cart-item-row:last-child {
          border-bottom: none !important;
        }
        .updating-blur {
          opacity: 0.4;
          pointer-events: none;
        }
        .scale-active:active {
          transform: scale(0.98);
        }
        .transition-all {
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        /* Floating Toast Styling */
        .custom-toast {
          position: fixed;
          bottom: 24px;
          right: 24px;
          z-index: 1060;
          background: #0f172a;
          color: #ffffff;
          padding: 12px 24px;
          border-radius: 12px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.15);
          display: flex;
          align-items: center;
          gap: 10px;
          transform: translateY(100px);
          opacity: 0;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .custom-toast.show {
          transform: translateY(0);
          opacity: 1;
        }
        /* Red Alert Class Variant */
        .custom-toast.toast-danger {
          background: #dc3545 !important;
          color: #ffffff !important;
        }
      `}</style>

      <div className="min-vh-100 py-5 cart-viewport">
        {/* Floating Notification Toast (Dynamically adds toast-danger if flag matches) */}
        <div className={`custom-toast fw-bold small ${showToast ? "show" : ""} ${toastType === "danger" ? "toast-danger" : ""}`}>
          <span>{toastMessage}</span>
          <button 
            type="button" 
            className="btn-close btn-close-white ms-auto" 
            style={{ fontSize: '0.75rem' }}
            onClick={() => setShowToast(false)}
          ></button>
        </div>

        <div className="container" style={{ maxWidth: "1140px" }}>

          <div className="d-flex align-items-center gap-3 mb-4">
            <h2 className="fw-extrabold tracking-tight text-dark m-0" style={{ letterSpacing: "-0.5px" }}>Shopping Cart</h2>
            <span className="badge bg-secondary bg-opacity-10 text-secondary rounded-pill px-3 py-2 fw-bold small">
              {cart.length} {cart.length === 1 ? 'Device' : 'Devices'}
            </span>
          </div>

          {cart.length === 0 ? (
            <div className="text-center py-5 px-4 rounded-4 premium-card border d-flex flex-column align-items-center justify-content-center" style={{ minHeight: "40vh" }}>
              <div className="bg-light p-4 rounded-circle mb-3" style={{ fontSize: "2.5rem" }}>🛒</div>
              <h4 className="fw-extrabold text-dark mb-2">Your cart is currently empty</h4>
              <p className="text-muted small mx-auto mb-4" style={{ maxWidth: "380px" }}>
                Explore our flagship line and certified smartphone accessories to customize your setup.
              </p>
              <button className="btn btn-primary rounded-pill px-4 py-2 fw-semibold scale-active transition-all" onClick={() => navigate("/products")}>
                Browse Collections ➔
              </button>
            </div>
          ) : (
            <div className="row g-4 align-items-start">

              {/* Product list stack wrapper */}
              <div className="col-12 col-lg-8">

                {/* Free Shipping Alert Hub Goal tracker */}
                <div className="card premium-card border-0 rounded-4 p-3 mb-4">
                  <div className="d-flex justify-content-between align-items-center mb-2 small">
                    <span className="fw-semibold text-dark">
                      {shipping === 0 ? "🎉 Congratulations! You unlocked Free Shipping" : `Add ₹${remainingForFreeShipping.toLocaleString('en-IN')} more for Free Shipping`}
                    </span>
                    <span className="text-muted fw-medium font-monospace">₹{subtotal.toLocaleString('en-IN')} / ₹{freeShippingThreshold.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="progress rounded-pill shadow-inner" style={{ height: "6px" }}>
                    <div
                      className={`progress-bar rounded-pill transition-all ${shipping === 0 ? 'bg-success' : 'bg-primary'}`}
                      role="progressbar"
                      style={{ width: `${progressToFreeShipping}%` }}
                    ></div>
                  </div>
                </div>

                <div className="card premium-card rounded-4 p-2 overflow-hidden">
                  {cart.map((item) => {
                    const targetId = item.product_id || item.id;
                    const isRowUpdating = updatingId === targetId;

                    return (
                      <div
                        key={targetId}
                        className={`d-flex flex-column flex-sm-row align-items-sm-center justify-content-between p-3 border-bottom gap-3 cart-item-row ${isRowUpdating ? 'updating-blur' : ''}`}
                      >
                        {/* Media Object Details row */}
                        <div className="d-flex align-items-center gap-3 flex-grow-1">
                          <img
                            src={item.img}
                            alt={item.name}
                            style={{ width: "74px", height: "74px", objectFit: "contain" }}
                            className="rounded-3 product-thumbnail shadow-sm flex-shrink-0 bg-light p-1"
                          />
                          <div className="overflow-hidden">
                            <h6 className="fw-bold text-dark mb-1 text-truncate" style={{ fontSize: "0.95rem" }}>{item.name}</h6>
                            <span className="text-primary fw-bold font-monospace" style={{ fontSize: "0.9rem" }}>₹{item.price.toLocaleString('en-IN')}</span>
                          </div>
                        </div>

                        {/* Interactive Pill controllers block */}
                        <div className="d-flex align-items-center justify-content-between justify-content-sm-end gap-4 border-top border-sm-top-0 pt-2 pt-sm-0">

                          {/* Stepper block segment */}
                          <div className="d-flex align-items-center qty-pill-box rounded-3 border">
                            <button
                              className="btn btn-sm qty-btn scale-active shadow-sm"
                              onClick={() => handleQuantity(targetId, "decrease", item.qty)}
                              disabled={isRowUpdating || item.qty <= 1}
                            >
                              −
                            </button>
                            <span className="px-3 fw-bold font-monospace text-dark" style={{ minWidth: "40px", textAlign: "center", fontSize: "0.9rem" }}>
                              {item.qty}
                            </span>
                            <button
                              className="btn btn-sm qty-btn scale-active shadow-sm"
                              onClick={() => handleQuantity(targetId, "increase", item.qty)}
                              disabled={isRowUpdating}
                            >
                              +
                            </button>
                          </div>

                          {/* Row Total and deletion operations */}
                          <div className="text-end d-flex align-items-center gap-3">
                            <span className="fw-bold text-dark font-monospace d-none d-md-block" style={{ minWidth: "90px", fontSize: "0.95rem" }}>
                              ₹{(item.price * item.qty).toLocaleString('en-IN')}
                            </span>
                            <button
                              className="btn btn-light border btn-sm rounded-3 text-danger p-2 scale-active transition-all"
                              onClick={() => removeItem(targetId)}
                              disabled={isRowUpdating}
                              title="Remove item"
                            >
                              🗑️ <span className="d-sm-none ms-1 small">Remove</span>
                            </button>
                          </div>

                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Order Invoice Block calculations sticky card */}
              <div className="col-12 col-lg-4 position-sticky" style={{ top: "90px" }}>
                <div className="card premium-card rounded-4 p-4">
                  <h5 className="fw-extrabold text-dark mb-3" style={{ letterSpacing: "-0.3px" }}>Order Summary</h5>

                  <div className="d-flex justify-content-between align-items-center mb-2 small">
                    <span className="text-muted">Subtotal</span>
                    <span className="fw-bold text-dark font-monospace">₹{subtotal.toLocaleString('en-IN')}</span>
                  </div>

                  <div className="d-flex justify-content-between align-items-center mb-3 small">
                    <span className="text-muted">Estimated Delivery Fee</span>
                    <span className={`fw-bold font-monospace ${shipping === 0 ? 'text-success' : 'text-dark'}`}>
                      {shipping === 0 ? "FREE" : `₹${shipping}`}
                    </span>
                  </div>

                  <hr className="text-muted opacity-25" />

                  <div className="d-flex justify-content-between align-items-center my-3">
                    <h6 className="fw-extrabold text-dark m-0">Total Bill Amount</h6>
                    <h5 className="fw-extrabold text-primary m-0 font-monospace">₹{total.toLocaleString('en-IN')}</h5>
                  </div>

                  <button
                    className="btn btn-primary w-100 py-2.5 fw-bold rounded-3 shadow-sm scale-active transition-all mt-2 d-flex align-items-center justify-content-center gap-2"
                    onClick={() => navigate("/summary", { state: { cart, total } })}
                  >
                    Proceed to Secure Checkout ➔
                  </button>

                  <div className="text-center mt-3">
                    <span className="text-muted" style={{ fontSize: "0.72rem" }}>
                      Secure Encrypted Multi-Channel Infrastructure
                    </span>
                  </div>
                </div>
              </div>

            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Cart;
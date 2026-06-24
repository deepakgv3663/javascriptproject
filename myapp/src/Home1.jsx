import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { Toast } from "bootstrap";
import { useNavigate } from "react-router-dom";

const API = "http://localhost:5000";

function Home1() {
  const navi = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addingId, setAddingId] = useState(null);

  // ==============
  // FETCH PRODUCTS
  // ==============
  useEffect(() => {
    fetch(`${API}/products`)
      .then((res) => res.json())
      .then((data) => setProducts(Array.isArray(data) ? data : []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

  // ==========
  // TOAST INIT
  // ==========
  useEffect(() => {
    const toastEl = document.getElementById("cartToast");
    if (toastEl && !Toast.getInstance(toastEl)) {
      new Toast(toastEl, { delay: 3000 });
    }
  }, []);

  const showToast = (msg = "Product added to cart ✅", variantClass = "bg-success") => {
    const toastEl = document.getElementById("cartToast");
    if (toastEl) {
      const body = toastEl.querySelector(".toast-body");
      if (body) body.innerText = msg;

      toastEl.className = `toast position-fixed bottom-0 end-0 m-3 text-white border-0 ${variantClass}`;

      const instance = Toast.getOrCreateInstance(toastEl);
      instance.show();
    }
  };

  // ===========
  // ADD TO CART
  // ===========
  const handleAddToCart = async (product) => {
    try {
      setAddingId(product.id);

      const savedUserStr = localStorage.getItem("user");
      let token = null;
      let userId = null;

      if (savedUserStr) {
        const parsedUser = JSON.parse(savedUserStr);
        token = parsedUser.token || parsedUser.jwt || savedUserStr;
        userId = parsedUser.id || parsedUser.userId || parsedUser.user_id;
      }

      if (!savedUserStr || !token) {
        showToast("🔒 Please login to add items to your cart", "bg-warning text-dark");
        setTimeout(() => navi("/login"), 1200);
        return;
      }

      const res = await fetch(`${API}/cart/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          product_id: product.id,
          productId: product.id,
          quantity: 1,
          qty: 1,
          user_id: userId,
          userId: userId
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        showToast(data.message || "Failed to add ❌", "bg-danger");
        return;
      }

      showToast("Added to cart ✅", "bg-success");
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (err) {
      console.error(err);
      showToast("Server error ❌", "bg-danger");
    } finally {
      setAddingId(null);
    }
  };

  return (
    <div className="container-fluid p-0 bg-light-subtle min-vh-100">

      {/* INJECT INTERACTIVE STYLES */}
      <style>{`
        .hover-lift { transition: transform 0.25s ease, box-shadow 0.25s ease; }
        .hover-lift:hover { transform: translateY(-5px); box-shadow: 0 1rem 3rem rgba(0,0,0,0.12) !important; }
        .zoom-img { transition: transform 0.4s ease; }
        .zoom-container:hover .zoom-img { transform: scale(1.05); }
        .category-card { transition: all 0.2s ease; border: 1px solid var(--bs-border-color); }
        .category-card:hover { background-color: var(--bs-dark) !important; color: var(--bs-white) !important; border-color: var(--bs-dark); }
      `}</style>

      {/* HERO BANNER - SILICON VALLEY AESTHETIC */}
      <div className="bg-dark text-white text-center py-5 px-3 position-relative overflow-hidden mb-5 d-flex align-items-center justify-content-center"
        style={{
          minHeight: "420px",
          background: "radial-gradient(circle at top right, #2c3e50, #0f172a)"
        }}>
        <div style={{ zIndex: 2, maxWidth: "650px" }}>
          <span className="badge bg-warning text-dark px-3 py-2 rounded-pill fw-semibold text-uppercase mb-3 shadow-sm" style={{ fontSize: "0.75rem", letterSpacing: "1.5px" }}>
            Premium Electronics
          </span>
          <h1 className="display-3 fw-black tracking-tight mb-3" style={{ fontWeight: "800" }}>MY BRAND MOBILES</h1>
          <p className="text-secondary fs-5 mb-4 text-white-50">Discover premier flagship smartphones and genuine mobile repair ecosystems seamlessly curated in Madurai.</p>
          <button className="btn btn-warning px-4 py-2-5 fw-bold rounded-3 shadow-sm text-dark transition" onClick={() => navi("/products")}>
            Explore Products &rarr;
          </button>
        </div>
        {/* Subtle decorative background circle */}
        <div className="position-absolute rounded-circle bg-warning opacity-10" style={{ width: "300px", height: "300px", top: "-50px", right: "-50px", blur: "80px" }}></div>
      </div>

      {/* MARKETING PROMO BANNERS (BENTO LAYOUT STYLE) */}
      <div className="container mb-5">
        <div className="row g-4">
          {["https://m.media-amazon.com/images/I/61ddgnf32pL._AC_UF350,350_QL80_.jpg", "https://abnamobiles.com/wp-content/uploads/2025/08/ZZ2-1024x1024.jpg", "https://abnamobiles.com/wp-content/uploads/2025/08/ZZ1-1024x1024.jpg"].map((src, i) => (
            <div className="col-md-4" key={i} onClick={() => navi("/products")} style={{ cursor: "pointer" }}>
              <div className="overflow-hidden rounded-4 shadow-sm border zoom-container bg-white" style={{ height: "280px" }}>
                <img className="w-100 h-100 zoom-img" src={src} alt="Promo Campaign" style={{ objectFit: "cover" }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SHOP CATEGORIES SELECTION */}
      <div className="container text-center mb-5 py-4">
        <h2 className="fw-bold text-dark mb-1">Shop by Category</h2>
        <p className="text-muted mb-4 mx-auto" style={{ maxWidth: "500px" }}>Tailored curated smart devices designed for absolute precision and everyday utility.</p>
        <div className="row g-3 justify-content-center">
          {["Mobiles", "Accessories", "Earbuds", "Smart Watch"].map((cat, i) => (
            <div className="col-6 col-md-2-5 col-lg-2" key={i} onClick={() => navi("/products")}>
              <div className="card p-3 rounded-4 shadow-sm bg-white text-dark fw-medium category-card text-center h-100 d-flex align-items-center justify-content-center py-4" style={{ cursor: "pointer" }}>
                {cat}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FEATURED SMARTPHONE GRID */}
      <div className="container mb-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="fw-bold text-dark mb-0">🔥 Featured Tech</h2>
            <p className="text-muted small mb-0 d-none d-sm-block">Our top recommended devices picked fresh for you.</p>
          </div>
          <button className="btn btn-dark btn-sm rounded-3 px-4 py-2 fw-medium shadow-sm" onClick={() => navi("/products")}>View All</button>
        </div>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-dark spinner-border-sm me-2" role="status"></div>
            <span className="text-muted small fw-medium">Fetching catalogue items...</span>
          </div>
        ) : (
          <div className="row g-4">
            {products.slice(0, 4).map((product) => (
              <div className="col-sm-6 col-md-4 col-lg-3" key={product.id}>
                <div className="card border-0 shadow-sm rounded-4 h-100 overflow-hidden hover-lift bg-white">
                  <div className="bg-light p-4 d-flex align-items-center justify-content-center position-relative" style={{ height: "220px" }}>
                    <img src={product.img} className="rounded-3" alt={product.name} style={{ maxHeight: "100%", maxWidth: "100%", objectFit: "contain" }} />
                  </div>
                  <div className="card-body d-flex flex-column justify-content-between p-3-5 text-center">
                    <div className="mb-3">
                      <h6 className="fw-bold text-dark text-truncate mb-1">{product.name}</h6>
                      <p className="text-dark fw-bold fs-5 m-0">₹{Number(product.price).toLocaleString("en-IN")}</p>
                    </div>
                    <div className="d-flex flex-column gap-2">

                      {/* 🔵 BUY NOW BLUE */}
                      <button
                        className="btn btn-primary btn-sm py-2 fw-semibold rounded-3 shadow-sm"
                        onClick={() => navi("/summary", { state: { cart: [{ ...product, qty: 1 }] } })}
                      >
                        Buy Now
                      </button>

                      {/* 🟢 ADD TO CART GREEN */}
                      <button
                        className="btn btn-success btn-sm py-2 fw-medium rounded-3"
                        disabled={addingId === product.id}
                        onClick={() => handleAddToCart(product)}
                      >
                        {addingId === product.id ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-1"></span>
                            Adding...
                          </>
                        ) : (
                          "Add to Cart"
                        )}
                      </button>

                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* CORE BUSINESS SERVICES SEGMENT */}
      <div className="bg-white py-5 text-center border-top">
        <div className="container">
          <h2 className="fw-bold text-dark mb-1">Our Core Services</h2>
          <p className="text-muted mb-4 small">Professional diagnostic treatment setups built direct to restore your devices.</p>
          <div className="row g-4 mt-2">
            {[
              { icon: "🔧", label: "Mobile Repair", desc: "Expert component fixing" },
              { icon: "📱", label: "Screen Replacement", desc: "Premium grade glass displays" },
              { icon: "🔋", label: "Battery Service", desc: "OEM performance swap-ins" },
              { icon: "⚙️", label: "Software Update", desc: "Os optimizations & unlocks" }
            ].map((srv, i) => (
              <div className="col-6 col-md-3" key={i}>
                <div className="p-4 bg-light rounded-4 border-0 shadow-sm h-100 hover-lift">
                  <div className="fs-1 mb-2">{srv.icon}</div>
                  <h6 className="fw-bold text-dark mb-1">{srv.label}</h6>
                  <p className="text-muted small mb-0">{srv.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* NOTIFICATION HUB TOAST */}
      <div className="toast position-fixed bottom-0 end-0 m-3 shadow-lg" id="cartToast" role="alert" aria-live="assertive" aria-atomic="true">
        <div className="toast-body rounded fw-semibold px-3 py-2-5">Product added to cart</div>
      </div>
    </div>
  );
}

export default Home1;
import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Toast, Modal } from "bootstrap";

const API = "http://localhost:5000";

function Products() {
  const navigate = useNavigate();
  const location = useLocation();

  const query = new URLSearchParams(location.search);
  const searchFromURL = query.get("search") || "";

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addingId, setAddingId] = useState(null);

  const [search, setSearch] = useState(searchFromURL);
  const [sort, setSort] = useState("");
  const [priceFilter, setPriceFilter] = useState("");
  const [category, setCategory] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);

  const toastRef = useRef(null);
  const modalRef = useRef(null);

  useEffect(() => {
    fetch(`${API}/products`)
      .then((res) => res.json())
      .then((data) => setProducts(Array.isArray(data) ? data : []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    setSearch(searchFromURL);
  }, [searchFromURL]);

  const handleImageClick = (product) => {
    setSelectedProduct(product);
    const bsModal = new Modal(modalRef.current);
    bsModal.show();
  };

  const showToast = (msg, variant = "bg-dark") => {
    const toastEl = toastRef.current;
    if (!toastEl) return;

    const body = toastEl.querySelector(".toast-body");
    if (body) body.innerText = msg;

    toastEl.className = `toast text-white ${variant} border-0 position-fixed bottom-0 end-0 m-4 shadow-lg rounded-3`;
    Toast.getOrCreateInstance(toastEl).show();
  };

  const filteredProducts = products
    .filter((p) => p.name.toLowerCase().includes(search.toLowerCase()))
    .filter((p) =>
      !category ? true : p.category?.toUpperCase() === category.toUpperCase()
    )
    .filter((p) => {
      const price = Number(p.price);
      if (!priceFilter) return true;
      if (priceFilter === "low") return price < 2000;
      if (priceFilter === "mid") return price >= 2000 && price <= 15000;
      if (priceFilter === "high") return price > 15000;
      return true;
    })
    .sort((a, b) => {
      const aP = Number(a.price);
      const bP = Number(b.price);
      if (sort === "low") return aP - bP;
      if (sort === "high") return bP - aP;
      return 0;
    });

  const handleAddToCart = async (product) => {
    const savedUserStr = localStorage.getItem("user");
    let token = null;
    let userId = null;

    if (savedUserStr) {
      const parsed = JSON.parse(savedUserStr);
      token = parsed.token;
      userId = parsed.id;
    }

    if (!userId) {
      showToast("Authentication required 🔒", "bg-warning text-dark");
      setTimeout(() => navigate("/login"), 1200);
      return;
    }

    try {
      setAddingId(product.id);
      await fetch(`${API}/cart/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          product_id: product.id,
          user_id: userId,
          quantity: 1,
        }),
      });

      showToast("Product Added to your cart!", "bg-success");
      window.dispatchEvent(new Event("cartUpdated"));
    } catch {
      showToast("Failed to add item ", "bg-danger");
    } finally {
      setAddingId(null);
    }
  };

  return (
    <div className="container py-5" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>

      <style>{`
        .modern-heading {
          letter-spacing: -1px;
          color: #0f172a;
        }
        .modern-filter-container {
          background: #ffffff;
          border-radius: 20px;
          border: 1px solid #e2e8f0;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.02), 0 8px 10px -6px rgba(0, 0, 0, 0.02);
          padding: 1.25rem;
        }
        .modern-filter-label {
          font-size: 0.75rem;
          font-weight: 700;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 0.5rem;
          display: block;
        }
        .modern-input-field {
          border-radius: 12px !important;
          padding: 0.7rem 1rem;
          background-color: #f8fafc;
          border: 1px solid #e2e8f0;
          font-size: 0.88rem;
          color: #334155 !important;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .modern-input-field:focus {
          background-color: #ffffff;
          border-color: #0d6efd;
          box-shadow: 0 0 0 4px rgba(13, 110, 253, 0.08);
        }
        .premium-product-card {
          background: #ffffff;
          border: 1px solid #f1f5f9;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .premium-product-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 10px 10px -5px rgba(0, 0, 0, 0.02) !important;
        }
        .img-wrapper-frame {
          background: #f8fafc;
          border-radius: 16px;
          overflow: hidden;
          position: relative;
        }
        .premium-product-img {
          transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: pointer;
        }
        .premium-product-card:hover .premium-product-img {
          transform: scale(1.06);
        }
        .btn-modern-primary {
          background: #0d6efd;
          color: #ffffff;
          border: none;
          border-radius: 10px;
          font-size: 0.85rem;
          font-weight: 600;
          padding: 0.6rem 1rem;
          transition: background 0.2s ease;
        }
        .btn-modern-primary:hover {
          background: #0b5ed7;
          color: #ffffff;
        }
        .btn-modern-secondary {
          background: #198754;
          color: #ffffff;
          border: none;
          border-radius: 10px;
          font-size: 0.85rem;
          font-weight: 600;
          padding: 0.6rem 1rem;
          transition: all 0.2s ease;
        }
        .btn-modern-secondary:hover {
          background: #157347;
          color: #ffffff;
        }
        .modal-glass-spec {
          background: #f8fafc;
          border-radius: 12px;
          padding: 12px;
        }
        .btn-modern-dismiss {
          background: #ffffff;
          color: #475569;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          font-size: 0.85rem;
          font-weight: 600;
          padding: 0.6rem 1rem;
          transition: all 0.2s ease;
        }
        .btn-modern-dismiss:hover {
          background: #f8fafc;
          color: #1e293b;
          border-color: #cbd5e1;
        }
      `}</style>

      <div className="text-center mb-5">
        <span className="badge bg-light text-primary border px-3 py-2 rounded-pill fw-bold text-uppercase mb-2" style={{ fontSize: '0.75rem', letterSpacing: '0.5px' }}>Catalogue</span>
        <h1 className="modern-heading fw-extrabold m-0">OUR PRODUCTS</h1>
        <p className="text-muted small mt-1">Explore authentic handpicked gadgets with full brand warranties.</p>
      </div>

      <div className="modern-filter-container mb-5">
        <div className="row g-3 align-items-center">

          <div className="col-md-3">
            <label className="modern-filter-label">Search Query</label>
            <div className="position-relative">
              <input
                className="form-control modern-input-field text-dark"
                placeholder="🔍 Search items, tags..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  navigate(`/products?search=${e.target.value}`);
                }}
              />
            </div>
          </div>

          <div className="col-md-3">
            <label className="modern-filter-label">Product Category</label>
            <select
              className="form-select modern-input-field text-dark"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="MOBILES">Select</option>
              <option value="MOBILES">📱 Mobiles</option>
              <option value="EARBUDS">🎧 Earbuds</option>
              <option value="SMARTWATCH">⌚ Smartwatches</option>
              <option value="ACCESSORIES">⚡ Accessories</option>
              <option value="PENDRIVE">💾 Pendrives</option>
              <option value="POWERBANK">🔋 Powerbanks</option>
            </select>
          </div>

          <div className="col-md-3">
            <label className="modern-filter-label">Price Bracket</label>
            <select
              className="form-select modern-input-field text-dark"
              value={priceFilter}
              onChange={(e) => setPriceFilter(e.target.value)}
            >
              <option value="">All Prices</option>
              <option value="low">Below ₹2,000</option>
              <option value="mid">₹2,000 - ₹15,000</option>
              <option value="high">Above ₹15,000</option>
            </select>
          </div>

          <div className="col-md-3">
            <label className="modern-filter-label">Sort Sequence</label>
            <select
              className="form-select modern-input-field text-dark"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              <option value="">Default Order</option>
              <option value="low">Price: Low to High</option>
              <option value="high">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary spinner-border-sm" role="status"></div>
          <span className="text-muted small ms-2">Syncing items...</span>
        </div>
      ) : (
        <div className="row g-4">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-5 bg-light rounded-4 border border-dashed">
              <span style={{ fontSize: '2rem' }}>🔍</span>
              <h5 className="fw-bold text-dark mt-2 mb-1">No matches located</h5>
              <p className="text-muted small m-0">Try restructuring your filter parameters or search constraints.</p>
            </div>
          ) : (
            filteredProducts.map((p) => (
              <div className="col-sm-6 col-md-4 col-lg-3" key={p.id}>
                <div className="card premium-product-card rounded-4 p-3 h-100 border-0 text-center">

                  <div className="img-wrapper-frame mb-3 d-flex align-items-center justify-content-center p-3" style={{ height: "200px" }}>
                    <span className="badge bg-white text-dark position-absolute top-0 start-0 m-2 shadow-sm border small px-2.5 py-1.5 rounded-pill fw-bold" style={{ zIndex: 2, fontSize: '0.68rem' }}>
                      {p.category || "Gadget"}
                    </span>
                    <img
                      src={p.img}
                      className="img-fluid premium-product-img"
                      style={{ maxHeight: "100%", objectFit: "contain" }}
                      alt={p.name}
                      onClick={() => handleImageClick(p)}
                      title="Quick inspection click"
                    />
                  </div>

                  <div className="card-body p-1 d-flex flex-column align-items-center">
                    <h6 className="fw-bold text-dark text-truncate w-100 mb-1" title={p.name}>{p.name}</h6>
                    <div className="d-flex justify-content-center align-items-baseline gap-1 mb-3">
                      <span className="text-dark fw-extrabold" style={{ fontSize: '1.1rem' }}>₹{Number(p.price).toLocaleString()}</span>
                    </div>

                    <div className="mt-auto d-flex flex-column gap-2 w-100">
                      <button
                        className="btn btn-modern-primary w-100"
                        onClick={() =>
                          navigate("/summary", {
                            state: { cart: [{ ...p, qty: 1 }] },
                          })
                        }
                      >
                        Buy Now
                      </button>
                      <button
                        className="btn btn-modern-secondary w-100"
                        onClick={() => handleAddToCart(p)}
                        disabled={addingId === p.id}
                      >
                        {addingId === p.id ? "Processing..." : "Add to Cart"}
                      </button>
                    </div>
                  </div>

                </div>
              </div>
            ))
          )}
        </div>
      )}

      <div className="modal fade" ref={modalRef} tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered modal-md">
          <div className="modal-content border-0 rounded-4 shadow-xl overflow-hidden bg-white">
            {selectedProduct && (
              <>
                <div className="modal-header border-0 bg-white px-4 pt-4 pb-0 d-flex justify-content-between align-items-center">
                  <span className="badge bg-light text-secondary border rounded-pill px-3 py-1.5 fw-bold text-uppercase" style={{ fontSize: '0.68rem' }}>
                    {selectedProduct.category || "Tech Specs"}
                  </span>
                  <button type="button" className="btn-close shadow-none" data-bs-dismiss="modal" aria-label="Close" style={{ fontSize: '0.8rem' }}></button>
                </div>

                <div className="modal-body px-4 py-3 text-center">
                  <div className="text-center p-4 mb-4" style={{ background: '#f8fafc', borderRadius: '20px' }}>
                    <img
                      src={selectedProduct.img}
                      alt={selectedProduct.name}
                      className="img-fluid"
                      style={{ maxHeight: "200px", objectFit: "contain" }}
                    />
                  </div>

                  <h4 className="fw-extrabold text-dark mb-1 tracking-tight">{selectedProduct.name}</h4>
                  <div className="text-primary fw-extrabold mb-3" style={{ fontSize: '1.5rem' }}>
                    ₹{Number(selectedProduct.price).toLocaleString()}
                  </div>

                  <div className="mb-4 text-start">
                    <h6 className="fw-bold text-dark small mb-1">Product Overview</h6>
                    <p className="text-secondary small lh-base m-0">
                      {selectedProduct.description || "Engineered to deliver exceptional daily usage performance, featuring structural material durability, intuitive integrated utility design parameters, and standard manufacturer performance profiles."}
                    </p>
                  </div>

                  <div className="row g-2 modal-glass-spec text-start small">
                    <div className="col-6 text-muted">Status:</div>
                    <div className="col-6 text-end fw-bold text-success">Available✅</div>
                    {/* <div className="col-6 text-muted">Warranty:</div>
                    <div className="col-6 text-end fw-bold text-dark">1 Year Warranty</div> */}
                  </div>
                </div>

                <div className="modal-footer border-0 p-4 bg-light d-flex gap-3">
                  <button
                    type="button"
                    className="btn btn-modern-dismiss px-4 m-0"
                    data-bs-dismiss="modal"
                  >
                    Dismiss
                  </button>
                  <button
                    type="button"
                    className="btn btn-modern-secondary flex-grow-1 m-0"
                    data-bs-dismiss="modal"
                    onClick={() => handleAddToCart(selectedProduct)}
                    disabled={addingId === selectedProduct.id}
                  >
                    {addingId === selectedProduct.id ? "Adding..." : "Add to Cart"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div ref={toastRef} className="toast position-fixed bottom-0 end-0 m-4">
        <div className="toast-body fw-medium small">Message</div>
      </div>

    </div>
  );
}

export default Products;
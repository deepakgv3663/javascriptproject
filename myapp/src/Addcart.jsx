import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProductCard from "./Productcard";
import * as bootstrap from "bootstrap";

const API = "http://localhost:5000";

function Addcart() {
  const navi = useNavigate();

  const [products, setProducts] = useState([]);
  const [loadingId, setLoadingId] = useState(null);

  // ===============
  // FETCH PRODUCTS
  // ===============
  useEffect(() => {
    fetch(`${API}/products`)
      .then((res) => res.json())
      .then((data) => setProducts(Array.isArray(data) ? data : []))
      .catch(() => setProducts([]));
  }, []);

  // ======
  // TOAST
  // =====
  const showToast = () => {
    const el = document.getElementById("cartToast");
    if (el) bootstrap.Toast.getOrCreateInstance(el).show();
  };

  // ===================
  // ADD TO CART (FIXED)
  // ===================
  const handleAdd = async (product) => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user.id) {
      alert("Login required ❌");
      navi("/login");
      return;
    }

    try {
      setLoadingId(product.id);
      const res = await fetch(`${API}/cart/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          product_id: product.id,
          user_id: user.id,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Failed to add ❌");
        return;
      }

      showToast();
      window.dispatchEvent(new Event("cartUpdated"));

      setTimeout(() => navi("/cart"), 800);
    } catch (err) {
      console.log(err);
      alert("Server error ❌");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="container-fluid">
      <h1 className="text-center my-4">BEST SMARTPHONES</h1>

      <div className="row">
        {products.map((p) => (
          <div className="col-md-3 mb-4" key={p.id}>
            <ProductCard
              product={p}
              onAdd={handleAdd}
              loading={loadingId === p.id}
            />
          </div>
        ))}
      </div>

      {/* TOAST */}
      <div className="toast position-fixed bottom-0 end-0 m-3" id="cartToast">
        <div className="toast-body bg-success text-white">
          Product added to cart ✅
        </div>
      </div>
    </div>
  );
}

export default Addcart;
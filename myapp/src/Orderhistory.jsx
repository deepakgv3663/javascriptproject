import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import OrderCard from "./Ordercard";

const API = "http://localhost:5000";

function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const [currentFilter, setCurrentFilter] = useState("all");

  const user = JSON.parse(localStorage.getItem("user") || "{}");


  useEffect(() => {
    if (location.state && location.state.filter) {
      setCurrentFilter(location.state.filter);
    } else {
      setCurrentFilter("all"); 
    }
  }, [location.state]);

  const fetchOrders = () => {
    fetch(`${API}/orders/history/${user.id}`)
      .then((res) => res.json())
      .then((data) => setOrders(Array.isArray(data) ? data : []))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (!user?.id) {
      navigate("/login");
      return;
    }
    fetchOrders();
  }, [navigate, user.id]);

  const cancelOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;
    try {
      const res = await fetch(`${API}/orders/cancel/${orderId}`, { method: "PUT" });
      if (res.ok) fetchOrders();
    } catch (err) { console.error(err); }
  };

  const removeOrder = async (orderId) => {
    if (!window.confirm("Remove this order permanently from your history?")) return;
    try {
      const res = await fetch(`${API}/orders/delete/${orderId}`, { method: "DELETE" });
      if (res.ok) fetchOrders();
    } catch (err) { console.error(err); }
  };

  const handleReorder = (order) => {
    navigate("/summary", {
      state: {
        cart: [
          {
            id: order.product_id || order.productId,
            name: order.name,
            price: order.price,
            img: order.img || order.image,
            qty: 1
          }
        ],
        total: order.price
      }
    });
  };


  const activeOrdersList = orders.filter(
    (o) => o.status?.trim().toLowerCase() !== "cancelled"
  );

  const cancelledOrdersList = orders.filter(
    (o) => o.status?.trim().toLowerCase() === "cancelled"
  );

  const totalOrders = orders.length;
  const cancelledOrders = cancelledOrdersList.length;
  const activeOrders = activeOrdersList.length;

  if (loading) {
    return (
      <div className="container text-center my-5 py-5">
        <div className="spinner-grow text-primary" role="status" style={{ width: "3rem", height: "3rem" }}>
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="text-muted mt-3 fw-medium">Retrieving your purchase history...</p>
      </div>
    );
  }

  return (
    <div className="container my-5" style={{ maxWidth: "1000px", fontFamily: "'Inter', sans-serif" }}>

      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-5">
        <div>
          <h2 className="fw-bold text-dark mb-1 text-capitalize">
            {currentFilter === "all" ? "Purchase History" : `${currentFilter} Orders`}
          </h2>
          <p className="text-muted m-0 small">Manage, track, and reorder your tech items</p>
        </div>
        <button onClick={() => navigate("/")} className="btn btn-outline-secondary btn-sm px-4 rounded-pill">
          ← Continue Shopping
        </button>
      </div>

      {/* Stats Counter Blocks */}
      {totalOrders > 0 && (
        <div className="row g-3 mb-5">
          <div className="col-sm-4">
            <div className="card p-3 shadow-sm border-0 bg-light">
              <small className="text-secondary fw-bold">Total Orders</small>
              <h3 className="fw-bold m-0 mt-1">{totalOrders}</h3>
            </div>
          </div>
          <div className="col-sm-4">
            <div className="card p-3 shadow-sm border-0 bg-light">
              <small className="text-success fw-bold">Active</small>
              <h3 className="fw-bold m-0 mt-1">{activeOrders}</h3>
            </div>
          </div>
          <div className="col-sm-4">
            <div className="card p-3 shadow-sm border-0 bg-light">
              <small className="text-danger fw-bold">Cancelled</small>
              <h3 className="fw-bold m-0 mt-1">{cancelledOrders}</h3>
            </div>
          </div>
        </div>
      )}

      {/* EMPTY MATRIX HANDLER */}
      {orders.length === 0 ? (
        <div className="text-center py-5 border rounded-3 bg-light">
          <span className="fs-1 d-block mb-2">📦</span>
          <h4 className="text-muted fw-semibold mb-0">No Orders Found</h4>
        </div>
      ) : (
        <>
          {/* CONFIRMED ORDERS */}
          {activeOrdersList.length > 0 && (currentFilter === "all" || currentFilter === "confirmed") && (
            <>
              <h4 className="mb-3 text-success fw-bold d-flex align-items-center gap-2">
                <span>🟢</span> Confirmed Orders History
              </h4>
              <div className="d-flex flex-column gap-3 mb-5">
                {activeOrdersList.map((order) => (
                  <OrderCard
                    key={order.id || order.order_id}
                    order={order}
                    onCancel={cancelOrder}
                    onRemove={removeOrder}
                    onReorder={handleReorder}
                  />
                ))}
              </div>
            </>
          )}

          {/* Fallback layout if user filtered by confirmed but list has 0 items */}
          {activeOrdersList.length === 0 && currentFilter === "confirmed" && (
            <div className="text-center py-5 border rounded-3 bg-light mb-5">
              <p className="text-muted fw-semibold m-0">No active or confirmed orders to display.</p>
            </div>
          )}

          {/* CANCELLED ORDERS VIEW CONTAINER */}
          {cancelledOrdersList.length > 0 && (currentFilter === "all" || currentFilter === "cancelled") && (
            <>
              <h4 className="mb-3 text-danger fw-bold d-flex align-items-center gap-2">
                <span>🔴</span> Cancelled Orders History
              </h4>
              <div className="d-flex flex-column gap-3">
                {cancelledOrdersList.map((order) => (
                  <OrderCard
                    key={order.id || order.order_id}
                    order={order}
                    onCancel={cancelOrder}
                    onRemove={removeOrder}
                    onReorder={handleReorder}
                  />
                ))}
              </div>
            </>
          )}

          {cancelledOrdersList.length === 0 && currentFilter === "cancelled" && (
            <div className="text-center py-5 border rounded-3 bg-light">
              <p className="text-muted fw-semibold m-0">No cancelled orders found in your history.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default OrderHistory;
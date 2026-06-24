import React, { useEffect, useState } from "react";

const API = "http://localhost:5000";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("confirmed"); 

  const fetchOrders = async () => {
    try {
      const res = await fetch(`${API}/orders`, {
        credentials: "include",
      });

      if (!res.ok) {
        alert("Please login first");
        return;
      }

      const data = await res.json();
      setOrders(data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const filteredOrders = orders.filter((order) => {
    const currentStatus = order.status || "confirmed";
    return currentStatus === filter;
  });

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap');
        
        .orders-container {
          font-family: 'Plus Jakarta Sans', sans-serif;
          max-width: 800px;
          margin: 0 auto;
        }
        .filter-select {
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          padding: 10px 15px;
          font-size: 0.9rem;
          font-weight: 600;
          color: #1e293b;
          background-color: #fff;
          box-shadow: 0 2px 4px rgba(0,0,0,0.02);
          transition: all 0.2s ease;
          width: 220px;
        }
        .filter-select:focus {
          border-color: #0d6efd;
          box-shadow: 0 0 0 4px rgba(13, 110, 253, 0.1);
          outline: none;
        }
        .order-card {
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          background: #fff;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .order-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(0,0,0,0.05) !important;
        }
        .item-row {
          font-size: 0.9rem;
          color: #475569;
          padding: 6px 0;
          border-bottom: 1px dashed #f1f5f9;
        }
        .item-row:last-child {
          border-bottom: none;
        }
        .badge-confirmed {
          background-color: rgba(25, 135, 84, 0.1);
          color: #198754;
          padding: 6px 12px;
          border-radius: 30px;
          font-size: 0.8rem;
          font-weight: 700;
        }
        .badge-cancelled {
          background-color: rgba(220, 53, 69, 0.1);
          color: #dc3545;
          padding: 6px 12px;
          border-radius: 30px;
          font-size: 0.8rem;
          font-weight: 700;
        }
      `}</style>

      <div className="orders-container p-4">
        <div className="d-flex align-items-center justify-content-between flex-wrap gap-3 mb-4">
          <h2 className="fw-extrabold m-0" style={{ letterSpacing: "-0.5px" }}>
            🧾 Order History
          </h2>

          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="filter-select"
          >
            <option value="confirmed">Confirm Orders</option>
            <option value="cancelled">Cancel Orders</option>
          </select>
        </div>
        {filteredOrders.length === 0 ? (
          <div className="text-center py-5 border rounded-3 bg-light">
            <span className="fs-1 d-block mb-2">📦</span>
            <p className="text-muted fw-semibold mb-0">No {filter} orders found</p>
          </div>
        ) : (
          filteredOrders.map((order) => (
            <div key={order.id} className="card order-card mb-3 p-4 shadow-sm border-0">
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div>
                  <h6 className="text-muted small uppercase fw-bold mb-1">ORDER ID</h6>
                  <h5 className="fw-bold text-dark m-0">#{order.id}</h5>
                </div>
                <span className={order.status === "cancelled" ? "badge-cancelled" : "badge-confirmed"}>
                  {order.status === "cancelled" ? "CANCELLED" : "CONFIRMED"}
                </span>
              </div>

              <div className="row bg-light rounded-3 p-3 mb-3 mx-0">
                <div className="col-6 p-0 text-secondary small">
                  <strong>Date:</strong> {new Date(order.date).toLocaleString()}
                </div>
                <div className="col-6 p-0 text-end fw-bold text-dark">
                  Total: ₹{order.total}
                </div>
              </div>

              {/* PURCHASED ITEMS ITEMIZATION LIST */}
              <div className="border rounded-3 p-3 bg-white">
                <h6 className="fw-bold text-secondary small mb-2 text-uppercase">Items Ordered</h6>
                {order.items && order.items.map((item, i) => (
                  <div key={i} className="d-flex justify-content-between item-row">
                    <span>📱 {item.name}</span>
                    <span className="fw-semibold text-dark">₹{item.price}</span>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}

export default Orders;
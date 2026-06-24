import React from "react";

function OrderCard({ order, onCancel, onRemove, onReorder }) {
  return (
    <div className="card p-3 shadow-sm rounded-4 mb-3">

      <div className="row align-items-center">

        <div className="col-md-2 text-center">
          <img
            src={order.img || order.image}
            alt={order.name}
            style={{
              width: "70px",
              height: "70px",
              objectFit: "contain"
            }}
          />
        </div>

        <div className="col-md-6">
          <h6
            className={`fw-bold ${order.status === "Cancelled"
              ? "text-danger text-decoration-line-through"
              : ""
              }`}
          >
            {order.name}
          </h6>

          <small className="text-muted">
            Qty: 1 | Status: {order.status}
          </small>

          <div className="fw-bold text-primary">
            ₹{order.price}
          </div>
        </div>

        <div className="col-md-4 text-md-end text-center mt-3 mt-md-0">

          {order.status !== "Cancelled" ? (
            <button
              className="btn btn-danger btn-sm"
              onClick={() => onCancel(order.id || order.order_id)}
            >
              Cancel Order
            </button>
          ) : (
            <>
              <button
                className="btn btn-outline-danger btn-sm me-2"
                onClick={() => onRemove(order.id || order.order_id)}
              >
                Remove
              </button>

              <button
                className="btn btn-primary btn-sm"
                onClick={() => onReorder(order)}
              >
                Reorder
              </button>
            </>
          )}

        </div>

      </div>

    </div>
  );
}

export default OrderCard;
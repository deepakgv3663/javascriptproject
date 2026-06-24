import React, { useEffect, useState } from "react";

const API = "http://localhost:5000";

function CancelOrders() {
    const [orders, setOrders] = useState([]);

    const fetchOrders = async () => {
        const res = await fetch(`${API}/orders`, {
            credentials: "include",
        });

        const data = await res.json();

        const cancelled = data.filter(o => o.status === "cancelled");
        setOrders(cancelled);
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    return (
        <div style={{ padding: "30px" }}>
            <h2>❌ Cancelled Orders</h2>

            {orders.length === 0 ? (
                <p>No cancelled orders</p>
            ) : (
                orders.map(order => (
                    <div key={order.id} className="card mb-3 p-3">
                        <h5>Order ID: {order.id}</h5>
                        <p>Total: ₹{order.total}</p>
                    </div>
                ))
            )}
        </div>
    );
}

export default CancelOrders;
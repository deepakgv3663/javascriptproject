import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import jsPDF from "jspdf";

function Success() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const order = state || {};
  const cartItems = order.cartItems || [];

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOrdered, setIsOrdered] = useState(false);

  const handlePlaceOrder = async () => {
    const storedUser = localStorage.getItem("user");
    const user = storedUser ? JSON.parse(storedUser) : null;

    if (!user || !user.id) {
      alert("Please log in to complete your order.");
      return;
    }

    try {
      setIsSubmitting(true);

      const res = await fetch("http://localhost:5000/orders/place", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user.id,
          cartItems: cartItems,
        }),
      });

      if (res.ok) {
        setIsOrdered(true);
        window.dispatchEvent(new Event("cartUpdated"));
      } else {
        const data = await res.json();
        alert(data.message || "Failed to process transaction ❌");
      }
    } catch (err) {
      console.error("Checkout submission failed:", err);
      alert("Network error processing order.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const downloadBill = () => {
    const doc = new jsPDF();
    const timestamp = Date.now();


    const headerColor = "#1e293b";
    const tealColor = "#0d9488";
    const lineTeal = "#0f766e";
    const textGray = "#64748b";
    const darkBody = "#334155";


    doc.setTextColor(headerColor);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(26);
    doc.text("MY BRAND MOBILES", 14, 25);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(textGray);
    doc.text("366, Annai Street, Munichalai Main Road", 14, 32);
    doc.text("Madurai - 625009, Tamil Nadu", 14, 38);
    doc.text("Email: support@mybrandmobiles.com", 14, 44);

    doc.setTextColor(tealColor);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("TAX INVOICE", 196, 25, { align: "right" });

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(darkBody);
    doc.text(`Invoice #: INV-${timestamp.toString().slice(-6)}`, 196, 32, { align: "right" });
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 196, 38, { align: "right" });
    doc.text(`Payment Mode: ${order.payment || "Online Payment"}`, 196, 44, { align: "right" });


    doc.setDrawColor(lineTeal);
    doc.setLineWidth(1);
    doc.line(14, 52, 196, 52);


    doc.setTextColor(darkBody);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("BILLED TO:", 14, 66);

    doc.setFontSize(11);
    doc.text(order.user?.name || "Deepak G V", 14, 74);

    doc.setFont("helvetica", "normal");
    doc.setTextColor(textGray);
    doc.text(`Phone: +91 ${order.user?.phone || "9876543210"}`, 14, 81);


    const addressStr = order.user?.address || "5A-1A J J ILLAM\nG G ROAD BALARENGAPURAM";
    const pincodeStr = order.user?.pincode ? ` - Pincode: ${order.user.pincode}` : " - Pincode: 625001";
    const fullAddress = `${addressStr}${pincodeStr}`;
    const splitAddress = doc.splitTextToSize(fullAddress, 140);
    doc.text(splitAddress, 14, 88);


    let currentY = 96 + (splitAddress.length * 5);


    doc.setFillColor("#f1f5f9");
    doc.rect(14, currentY, 182, 8, "F");
    doc.setDrawColor("#e2e8f0");
    doc.rect(14, currentY, 182, 8, "S");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(headerColor);
    doc.text("Item Description", 18, currentY + 5.5);
    doc.text("Qty", 120, currentY + 5.5);
    doc.text("Unit Price", 145, currentY + 5.5);
    doc.text("Total Amount", 172, currentY + 5.5);

    doc.setFont("helvetica", "normal");
    currentY += 8;


    cartItems.forEach((item) => {
      const itemTitle = doc.splitTextToSize(item.name || "Product Item", 95);
      const rowHeight = Math.max(itemTitle.length * 5, 8);

      if (currentY + rowHeight > 240) {
        doc.addPage();
        currentY = 20;
      }

      doc.setDrawColor("#e2e8f0");
      doc.line(14, currentY + rowHeight, 196, currentY + rowHeight);
      doc.setTextColor(darkBody);
      doc.text(itemTitle, 18, currentY + 5);
      doc.text(`${item.qty || 1}`, 120, currentY + 5);
      doc.text(`Rs. ${Number(item.price || 0).toLocaleString()}`, 145, currentY + 5);
      doc.text(`Rs. ${Number((item.price || 0) * (item.qty || 1)).toLocaleString()}`, 172, currentY + 5);

      currentY += rowHeight;
    });

    if (currentY > 220) {
      doc.addPage();
      currentY = 20;
    }


    currentY += 10;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(textGray);

    doc.text("Items Base Total:", 130, currentY);
    doc.text(`Rs. ${Number(order.subtotal || 0).toLocaleString()}`, 172, currentY);

    currentY += 6;
    doc.text("Shipping:", 130, currentY);
    doc.text(`Rs. ${Number(order.delivery || 0).toLocaleString()}`, 172, currentY);

    currentY += 6;
    doc.text("GST:", 130, currentY);
    doc.text(`Rs. ${Number(order.gst || 0).toLocaleString()}`, 172, currentY);

    currentY += 4;
    doc.setFillColor("#f8fafc");
    doc.rect(125, currentY, 71, 10, "F");
    doc.setDrawColor(tealColor);
    doc.rect(125, currentY, 71, 10, "S");

    doc.setFont("helvetica", "bold");
    doc.setTextColor(tealColor);
    doc.text("Total Amount Paid:", 128, currentY + 6.5);
    doc.text(`Rs. ${Number(order.total || 0).toLocaleString()}`, 172, currentY + 6.5);


    currentY += 25;
    if (currentY > 275) {
      doc.addPage();
      currentY = 30;
    }
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(headerColor);
    doc.text("THANK YOU FOR YOUR PURCHASING!", 105, currentY, { align: "center" });
    doc.setFont("helvetica", "italic");
    doc.setFontSize(8);
    doc.setTextColor(textGray);
    doc.text("This document serves as an official electronic confirmation of processing.", 14, 282);
    doc.text("Thank you for shopping with My Brand Mobiles.", 14, 287);

    doc.save(`Invoice_${timestamp}.pdf`);
  };

  if (!cartItems.length && !isOrdered) {
    return (
      <div className="container my-5 text-center py-5" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        <div className="fs-1 mb-3">🔍</div>
        <h4 className="fw-extrabold text-dark mb-2">No active order details found</h4>
        <p className="text-muted small">It seems your checkout parameters are completely empty.</p>
        <button className="btn btn-primary mt-3 px-4 py-2 rounded-3 fw-bold small" onClick={() => navigate("/")}>
          Return to Marketplace
        </button>
      </div>
    );
  }

  return (
    <div className="container my-5" style={{ maxWidth: "840px", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>

      <style>{`
        .success-heading {
          letter-spacing: -1.5px;
          color: #0f172a;
        }
        .modern-success-card {
          background: #ffffff;
          border-radius: 24px;
          border: 1px solid #e2e8f0;
          box-shadow: 0 20px 40px -15px rgba(0, 0, 0, 0.05);
        }
        .success-glowing-badge {
          width: 80px;
          height: 80px;
          background: #f0fdf4;
          border: 2px solid #bbf7d0;
          color: #16a34a;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2rem;
          box-shadow: 0 10px 20px rgba(22, 163, 74, 0.1);
        }
        .invoice-item-badge {
          background-color: #f8fafc;
          border: 1px solid #e2e8f0;
        }
        .btn-modern-submit {
          background: #0d6efd;
          color: #ffffff;
          border: none;
          border-radius: 12px;
          font-weight: 700;
          padding: 0.85rem 1.5rem;
          transition: background 0.2s ease;
        }
        .btn-modern-submit:hover {
          background: #0b5ed7;
          color: #ffffff;
        }
        .btn-modern-outline {
          background: #ffffff;
          border: 1px solid #cbd5e1;
          color: #334155;
          border-radius: 12px;
          font-weight: 600;
          padding: 0.75rem 1.25rem;
          transition: all 0.2s ease;
        }
        .btn-modern-outline:hover {
          background: #f8fafc;
          border-color: #94a3b8;
          color: #0f172a;
        }
      `}</style>

      {isOrdered ? (
        <div className="text-center py-5 px-4 modern-success-card">
          <div className="d-flex justify-content-center mb-4">
            <div className="success-glowing-badge">✓</div>
          </div>
          <h2 className="success-heading fw-extrabold mb-2">Order Placed Successfully!</h2>
          <p className="text-muted small mb-4 mx-auto" style={{ maxWidth: "420px" }}>
            Your transaction has been securely executed. Thank you for shopping with us! You can now download your invoice or continue your session.
          </p>
          <div className="d-flex justify-content-center gap-3">
            <button className="btn btn-modern-outline" onClick={downloadBill}>
              📄 Download Invoice
            </button>
            <button className="btn btn-modern-submit px-4" onClick={() => navigate("/")}>
              🛍️ Continue Shopping
            </button>
          </div>
        </div>
      ) : (
        <div>
          <div className="text-center mb-4">
            <div className="fs-1 mb-2">📋</div>
            <h2 className="success-heading fw-extrabold m-0">Order Summary Overview</h2>
            <p className="text-muted small mt-1 fw-light">Please run a swift inspection check before authorizing payload submission.</p>
          </div>

          <div className="card modern-success-card border-0 overflow-hidden">
            <div className="bg-light px-4 py-3 border-bottom d-flex justify-content-between align-items-center">
              <h6 className="fw-bold mb-0 text-dark" style={{ letterSpacing: "-0.2px" }}>Invoice Breakdown Overview</h6>
              <span className="badge bg-warning-subtle text-warning border border-warning-subtle px-3 py-1.5 rounded-pill fw-bold" style={{ fontSize: "0.68rem" }}>
                PENDING FINALIZATION
              </span>
            </div>

            <div className="card-body p-4">
              <div className="mb-4 d-flex flex-column gap-2">
                {cartItems.map((item, i) => (
                  <div key={i} className="invoice-item-badge d-flex justify-content-between align-items-center p-3 rounded-4">
                    <div>
                      <h6 className="fw-bold text-dark mb-0 small text-truncate" style={{ maxWidth: "340px" }}>{item.name}</h6>
                      <small className="text-muted fw-medium">{item.qty} × ₹{Number(item.price || 0).toLocaleString()}</small>
                    </div>
                    <span className="fw-extrabold text-dark small">
                      ₹{Number((item.price || 0) * (item.qty || 1)).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              <hr className="text-muted my-4" />

              <div className="row g-4 text-start">
                <div className="col-md-6">
                  <h6 className="fw-bold text-uppercase small tracking-wider text-muted mb-2" style={{ fontSize: "0.68rem" }}>Shipping Destination</h6>
                  <p className="small text-dark fw-bold mb-1">{order.user?.name || "Deepak G V"}</p>
                  <p className="small text-secondary lh-base mb-0 fw-light">
                    {order.user?.address || "5A-1A J J ILLAM, G G ROAD BALARENGAPURAM"}
                  </p>
                </div>

                <div className="col-md-6">
                  <h6 className="fw-bold text-uppercase small tracking-wider text-muted mb-2" style={{ fontSize: "0.68rem" }}>Financial Allocation</h6>
                  <div className="d-flex justify-content-between align-items-center bg-light p-2.5 rounded-3 mb-3">
                    <span className="small text-secondary fw-medium">Total Amount Due:</span>
                    <span className="fw-extrabold text-success fs-5">₹{Number(order.total || 0).toLocaleString()}</span>
                  </div>

                  <button className="btn btn-modern-submit w-100 py-3 text-uppercase small" onClick={handlePlaceOrder} disabled={isSubmitting}>
                    {isSubmitting ? "Processing Transaction..." : "Place Order"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Success;
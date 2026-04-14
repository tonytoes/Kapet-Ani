import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import '../styles/order_confirmation.css';
import Newsletter from "../components/layout/Newsletter.jsx"; 
import Footer from '../components/layout/Footer.jsx';

function Order() {
  const navigate = useNavigate();
  const order = useMemo(() => {
    try {
      const raw = sessionStorage.getItem("last_order");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }, []);

  if (!order) {
    return (
      <div className="order-modern-page">
        <div className="order-modern-wrap">
          <div className="order-modern-card" style={{ textAlign: "center" }}>
            <h2>No recent order found.</h2>
            <button className="order-primary-btn" onClick={() => navigate("/product")}>Continue Shopping</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="order-modern-page">
      <div className="order-modern-wrap">
        <div className="order-header">
          <div className="order-checkmark">✓</div>
          <h1>Your order has been placed</h1>
          <p>Tracking: <strong>{order.trackingId}</strong> · Payment: <strong>{order.paymentMode}</strong></p>
          <a href="/product" className="order-back-link">&lt; Back to Products</a>
        </div>

        <div className="order-grid">
          <section className="order-modern-card">
            <h3>Customer Info</h3>
            <div className="order-info-grid">
              <div><span>Name</span><strong>{order.customer?.name || "—"}</strong></div>
              <div><span>Email</span><strong>{order.customer?.email || "—"}</strong></div>
              <div><span>Phone</span><strong>{order.customer?.phone || "—"}</strong></div>
              <div><span>Address</span><strong>{order.customer?.address || "—"}</strong></div>
              <div><span>Postal</span><strong>{order.customer?.postalcode || "—"}</strong></div>
              <div><span>Payment Ref</span><strong>{order.paymentId || "—"}</strong></div>
            </div>
          </section>

          <section className="order-modern-card">
            <h3>Items in Order</h3>
            <div className="order-items-list">
              {order.items?.map((it) => (
                <div className="order-item-row" key={it.id}>
                  <img src={it.image} alt={it.name} />
                  <div>
                    <div className="order-item-name">{it.name}</div>
                    <div className="order-item-meta">Qty: {it.qty}</div>
                  </div>
                  <div className="order-item-price">
                    {(Number(it.price) * Number(it.qty)).toLocaleString("en-PH", { style: "currency", currency: "PHP" })}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <aside className="order-modern-card order-summary-card">
            <h3>Order Summary</h3>
            <div className="order-row"><span>Subtotal</span><strong>{Number(order.subtotal || 0).toLocaleString("en-PH", { style: "currency", currency: "PHP" })}</strong></div>
            <div className="order-row"><span>Shipping</span><strong>{Number(order.shipping || 0).toLocaleString("en-PH", { style: "currency", currency: "PHP" })}</strong></div>
            <div className="order-row total"><span>Total</span><strong>{Number(order.total || 0).toLocaleString("en-PH", { style: "currency", currency: "PHP" })}</strong></div>
            <button className="order-primary-btn" onClick={() => navigate("/product")}>Continue Shopping</button>
          </aside>
        </div>
      </div>
      <Newsletter />
      <Footer />
    </div>
  );
}

export default Order;

import '../styles/checkout_page.css';
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LINK_PATH } from "../admin/data/LinkPath.jsx";
import { getCartItems, getCartSubtotal, saveCartItems } from "../utils/cart";
import { PHONE_COUNTRIES, digitsOnly, formatLocalPhone11, splitStoredPhone, composeStoredPhone } from "../utils/phone";
import Newsletter from '../components/layout/Newsletter';
import Footer from '../components/layout/Footer';

const API = `${LINK_PATH}Transactionscontroller.php`;

function Checkout() {
  const navigate = useNavigate();
  const [cart, setCart] = useState(() => getCartItems());
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState("");
  const [paymentNotice, setPaymentNotice] = useState("");
  const isLoggedIn = useMemo(() => {
    try {
      return Boolean(localStorage.getItem("token") && localStorage.getItem("user"));
    } catch {
      return false;
    }
  }, []);
  const [form, setForm] = useState(() => {
    const u = JSON.parse(localStorage.getItem("user") || "null");
    const phoneParts = splitStoredPhone(u?.phone || "");
    return {
      name: `${u?.first_name || ""} ${u?.last_name || ""}`.trim(),
      email: u?.email || "",
      phone: phoneParts.local,
      address: u?.address || "",
      postalcode: u?.postalcode || "",
      payment_mode: "COD",
      payment_id: "",
    };
  });
  const [phoneCountry, setPhoneCountry] = useState(() => {
    const u = JSON.parse(localStorage.getItem("user") || "null");
    return splitStoredPhone(u?.phone || "").iso2;
  });
  const selectedPhoneCountry = PHONE_COUNTRIES.find((c) => c.iso2 === phoneCountry) || PHONE_COUNTRIES[0];

  useEffect(() => {
    const current = getCartItems();
    setCart(current);
  }, []);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    if (!user) {
      navigate("/login");
    }
  }, [navigate]);

  const subtotal = useMemo(() => getCartSubtotal(cart), [cart]);
  const shipping = useMemo(() => (cart.length ? 49 : 0), [cart.length]);
  const total = subtotal + shipping;

  const onChange = (k, v) => setForm((p) => ({ ...p, [k]: v }));
  const formatPeso = (n) => Number(n || 0).toLocaleString("en-PH", { style: "currency", currency: "PHP" });

  const simulatePayment = (mode) => {
    const reference = `SIM-${mode.toUpperCase()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
    onChange("payment_mode", mode);
    onChange("payment_id", reference);
    setPaymentNotice(`${mode} payment authorized. No real money is charged.`);
  };

  const placeOrder = async (e) => {
    e.preventDefault();
    setError("");
    if (cart.length === 0) return setError("Your cart is empty.");
    if (!form.name || !form.email || !form.phone || !form.address || !form.postalcode) {
      return setError("Please complete all required fields.");
    }
    setPlacing(true);
    try {
      const user = JSON.parse(localStorage.getItem("user") || "null");
      const payload = {
        user_id: user?.id || 0,
        name: form.name,
        email: form.email,
        phone: composeStoredPhone(phoneCountry, form.phone),
        address: form.address,
        postalcode: form.postalcode,
        payment_mode: form.payment_mode,
        payment_id: form.payment_id,
        items: cart.map((it) => ({ id: it.id, qty: Number(it.qty || 0) })),
      };
      const token = localStorage.getItem("token");
      const res = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message || "Failed to place order");

      const orderSnapshot = {
        ...data.order,
        customer: { ...form },
        items: cart,
        subtotal,
        shipping,
        total,
      };
      sessionStorage.setItem("last_order", JSON.stringify(orderSnapshot));
      saveCartItems([]);
      navigate("/order");
    } catch (err) {
      setError(err.message || "Failed to place order");
    } finally {
      setPlacing(false);
    }
  };

  return (
    <div className="checkout-modern-page">
      <div className="checkout-modern-wrap">
        <div className="checkout-top">
          <a href="/product" className="checkout-back">&lt; Continue Shopping</a>
          <h1>Checkout</h1>
          <p>Secure checkout. No real money will be charged.</p>
        </div>

        <form onSubmit={placeOrder} className="checkout-modern-grid">
          <section className="checkout-main-col">
            <div className="co-card">
              <h3>Items in Order</h3>
              {cart.length === 0 ? (
                <p className="co-muted">Your cart is empty.</p>
              ) : cart.map((item) => (
                <div className="co-item" key={item.id}>
                  <img src={item.image} alt={item.name} />
                  <div>
                    <div className="co-item-name">{item.name}</div>
                    <div className="co-muted">Qty: {item.qty}</div>
                  </div>
                  <div className="co-item-price">{formatPeso(Number(item.price) * Number(item.qty))}</div>
                </div>
              ))}
            </div>

            <div className="co-card">
              <h3>Customer Info</h3>
              <div className="co-grid-2">
                <div>
                  <label>Email</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => onChange("email", e.target.value)}
                    readOnly={isLoggedIn}
                    className={isLoggedIn ? "co-input-locked" : ""}
                  />
                </div>
                <div>
                  <label>Phone</label>
                  <div className="co-phone-wrap">
                    <div className="co-phone-country">
                      <img
                        src={selectedPhoneCountry?.flagUrl}
                        alt={`${selectedPhoneCountry?.name || "Country"} flag`}
                        className="co-phone-flag"
                        loading="lazy"
                      />
                      <select
                        className="co-phone-cc"
                        value={phoneCountry}
                        onChange={(e) => setPhoneCountry(e.target.value)}
                        aria-label="Country code"
                      >
                        {PHONE_COUNTRIES.map((c) => (
                          <option key={c.iso2} value={c.iso2}>
                            {c.iso2 === phoneCountry
                              ? `+${c.dialCode}`
                              : `${c.name} (+${c.dialCode})`}
                          </option>
                        ))}
                      </select>
                    </div>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={formatLocalPhone11(form.phone)}
                      onChange={(e) => onChange("phone", digitsOnly(e.target.value, 11))}
                      placeholder="0000 000 0000"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="co-card">
              <h3>Shipping Address</h3>
              <div>
                <label>Full Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => onChange("name", e.target.value)}
                  readOnly={isLoggedIn}
                  className={isLoggedIn ? "co-input-locked" : ""}
                />
              </div>
              <div><label>Street Address</label><input type="text" value={form.address} onChange={(e) => onChange("address", e.target.value)} /></div>
              <div>
                <label>Postal Code</label>
                <input
                  type="text"
                  inputMode="numeric"
                  value={form.postalcode}
                  onChange={(e) => onChange("postalcode", digitsOnly(e.target.value, 10))}
                />
              </div>
            </div>

            <div className="co-card">
              <h3>Payment Method</h3>
              <div className="co-pay-options">
                <button type="button" className={form.payment_mode === "PayPal" ? "active" : ""} onClick={() => simulatePayment("PayPal")}>PayPal</button>
                <button type="button" className={form.payment_mode === "GCash" ? "active" : ""} onClick={() => simulatePayment("GCash")}>GCash</button>
                <button type="button" className={form.payment_mode === "Card" ? "active" : ""} onClick={() => simulatePayment("Card")}>Card</button>
                <button type="button" className={form.payment_mode === "COD" ? "active" : ""} onClick={() => { onChange("payment_mode", "COD"); onChange("payment_id", ""); setPaymentNotice("Cash on Delivery selected. Payment is collected on delivery."); }}>Cash on Delivery</button>
              </div>
              <div style={{ marginTop: 12 }}>
                <label>Payment Reference</label>
                <input type="text" value={form.payment_id} onChange={(e) => onChange("payment_id", e.target.value)} placeholder="Auto-generated by simulate buttons" />
              </div>
              {paymentNotice && <p className="co-info">{paymentNotice}</p>}
            </div>
          </section>

          <aside className="checkout-summary-col">
            <div className="co-card co-sticky">
              <h3>Order Summary</h3>
              <div className="co-row"><span>Subtotal</span><strong>{formatPeso(subtotal)}</strong></div>
              <div className="co-row"><span>Shipping</span><strong>{formatPeso(shipping)}</strong></div>
              <div className="co-row total"><span>Total</span><strong>{formatPeso(total)}</strong></div>
              {error && <p className="co-error">{error}</p>}
              <button className="co-place-btn" type="submit" disabled={placing || cart.length === 0}>
                {placing ? "Placing Order..." : "Place Order"}
              </button>
            </div>
          </aside>
        </form>
      </div>
      <Newsletter />
      <Footer />
    </div>
  );
}

export default Checkout;

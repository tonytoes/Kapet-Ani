import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import Badge      from "../components/Badge";
import PageHeader from "../components/PageHeader";
import SlidePanel from "../components/SlidePanel";
import { canManageAdminPanels } from "../utils";
import { LINK_PATH } from "../data/LinkPath.jsx";
import { useCache }  from "../data/CacheContext";

const API       = `${LINK_PATH}Transactionscontroller.php`;
const CACHE_KEY = "transactions";

function authHeader() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// ─── Toast ─────────────────────────────────────────────────────────────────

function Toast({ toasts }) {
  return (
    <div style={{ position: "fixed", bottom: 24, right: 24, display: "flex", flexDirection: "column", gap: 10, zIndex: 9999, pointerEvents: "none" }}>
      {toasts.map(t => (
        <div key={t.id} style={{
          display: "flex", alignItems: "center", gap: 10,
          padding: "12px 18px", borderRadius: 12,
          background: t.type === "success" ? "#F0FDF4" : t.type === "error" ? "#FEF2F2" : "#FFFBEB",
          border: `1.5px solid ${t.type === "success" ? "#86EFAC" : t.type === "error" ? "#FCA5A5" : "#FCD34D"}`,
          boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
          fontSize: "0.83rem", fontWeight: 600,
          color: t.type === "success" ? "#15803D" : t.type === "error" ? "#DC2626" : "#B45309",
          minWidth: 220, maxWidth: 340,
          animation: "slideUp 0.2s ease", pointerEvents: "auto",
        }}>
          <i className={`bi ${t.type === "success" ? "bi-check-circle-fill" : t.type === "error" ? "bi-x-circle-fill" : "bi-arrow-repeat spin"}`}
            style={{ fontSize: "1rem", flexShrink: 0 }} />
          {t.message}
        </div>
      ))}
    </div>
  );
}

// ─── Detail row helper ──────────────────────────────────────────────────────

function DetailRow({ label, value }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ fontSize: "0.72rem", fontWeight: 600, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>
        {label}
      </div>
      <div style={{ fontSize: "0.85rem", color: "var(--text-primary)", fontWeight: 500 }}>
        {value || "—"}
      </div>
    </div>
  );
}

// ─── Order Panel (NO close button — SlidePanel already has one) ─────────────

const EDITABLE_STATUSES = ['pending', 'confirmed', 'cancelled'];

function OrderPanel({ order, onClose, onSave, saving }) {
  const [status, setStatus] = useState(order.status);

  // Reset dropdown when a different order is opened
  useEffect(() => { setStatus(order.status); }, [order.dbId]);

  const changed = status !== order.status;

  return (
    <>
      {/* Order details */}
      <div style={{ padding: "14px 16px", background: "#F9FAFB", borderRadius: 10, border: "1.5px solid var(--border-light)", marginBottom: 20 }}>
        <DetailRow label="Order ID"   value={order.trackingId} />
        <DetailRow label="Customer"   value={order.username} />
        <DetailRow label="Email"      value={order.email} />
        <DetailRow label="Phone"      value={order.phone} />
        <DetailRow label="Address"    value={order.address} />
        <DetailRow label="Postal"     value={order.postalcode} />
        <DetailRow label="Items"      value={`${order.orderAmount} item${order.orderAmount !== 1 ? "s" : ""}`} />
        <DetailRow label="Total"      value={order.totalPrice} />
        <DetailRow label="Payment"    value={order.paymentMode} />
        <DetailRow label="Payment ID" value={order.paymentId} />
        <DetailRow label="Date"       value={order.date} />
      </div>

      {/* Status selector */}
      <div className="form-group">
        <label className="form-label">Order Status</label>
        <select className="form-control" value={status} onChange={e => setStatus(e.target.value)}>
          {EDITABLE_STATUSES.map(s => (
            <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
          ))}
        </select>
      </div>

      {/* Badge preview */}
      <div style={{ marginBottom: 20, display: "flex", alignItems: "center", gap: 8 }}>
        <Badge status={order.status} />
        {changed && (
          <>
            <i className="bi bi-arrow-right" style={{ fontSize: "0.75rem", color: "var(--text-muted)" }} />
            <Badge status={status} />
          </>
        )}
      </div>

      {/* Footer — inside panel scroll area, no extra close button */}
      <div style={{ display: "flex", gap: 10, paddingTop: 16, borderTop: "1px solid var(--border-light)" }}>
        <button className="btn btn-cancel" onClick={onClose} disabled={saving}>Cancel</button>
        <button
          className="btn btn-update"
          onClick={() => onSave(order.dbId, status)}
          disabled={saving || !changed}
          style={{ opacity: !changed ? 0.5 : 1 }}
        >
          {saving
            ? <><i className="bi bi-arrow-repeat spin" style={{ marginRight: 6 }} />Saving…</>
            : "Update Status"
          }
        </button>
      </div>
    </>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────

export default function TransactionsPage() {
  const cache = useCache();
  const canManage = canManageAdminPanels();

  const [transactions, setTransactions] = useState(() => cache.get(CACHE_KEY) ?? []);
  const [loading,      setLoading]      = useState(() => cache.get(CACHE_KEY) === null);
  const [error,        setError]        = useState(null);
  const [search,       setSearch]       = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortOrder,    setSortOrder]    = useState("desc");
  const [selected,     setSelected]     = useState(null);
  const [panelOpen,    setPanelOpen]    = useState(false);
  const [saving,       setSaving]       = useState(false);
  const [toasts,       setToasts]       = useState([]);
  const toastCounter = useRef(0);

  function showToast(message, type = "success", duration = 3000) {
    const id = ++toastCounter.current;
    setToasts(prev => [...prev, { id, message, type }]);
    if (type !== "loading") setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), duration);
    return id;
  }
  function dismissToast(id) { setToasts(prev => prev.filter(t => t.id !== id)); }

  const loadTransactions = useCallback(async (force = false) => {
    if (!force && cache.get(CACHE_KEY) !== null) {
      setTransactions(cache.get(CACHE_KEY));
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res  = await fetch(API, { headers: authHeader() });
      const data = await res.json();
      if (data.success) {
        setTransactions(data.transactions);
        cache.set(CACHE_KEY, data.transactions);
      } else {
        throw new Error(data.message);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [cache]);

  useEffect(() => { loadTransactions(); }, [loadTransactions]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    let res = transactions.filter(t =>
      t.username.toLowerCase().includes(q) ||
      t.trackingId.toLowerCase().includes(q) ||
      t.paymentMode.toLowerCase().includes(q)
    );
    if (statusFilter !== "all") res = res.filter(t => t.status === statusFilter);
    res = [...res].sort((a, b) =>
      sortOrder === "asc" ? a.timestamp - b.timestamp : b.timestamp - a.timestamp
    );
    return res;
  }, [transactions, search, statusFilter, sortOrder]);

  function openOrder(t) {
    if (!canManage) return;
    setSelected(t);
    setPanelOpen(true);
  }
  function handleClose() { setPanelOpen(false); setSelected(null); }

  async function handleSave(dbId, newStatus) {
    if (!canManage) return;
    setSaving(true);
    const loadId = showToast("Updating status…", "loading");
    try {
      const payload = { dbId, status: newStatus };
      const res  = await fetch(API, {
        method:  "POST",
        headers: { "Content-Type": "application/json", ...authHeader() },
        body:    JSON.stringify(payload),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      setTransactions(prev => {
        const next = prev.map(t => t.dbId === dbId ? { ...t, status: newStatus } : t);
        cache.set(CACHE_KEY, next);
        return next;
      });
      setSelected(prev => prev ? { ...prev, status: newStatus } : prev);
      dismissToast(loadId);
      showToast("Status updated", "success");
      handleClose();
      loadTransactions(true);
    } catch (err) {
      dismissToast(loadId);
      showToast(err.message || "Failed to update", "error");
    } finally {
      setSaving(false);
    }
  }

  const statusCategories = [
    { value: "all",       label: "All" },
    { value: "pending",   label: "Pending" },
    { value: "confirmed", label: "Confirmed" },
    { value: "cancelled", label: "Cancelled" },
  ];

  return (
    <>
      <style>{`
        @keyframes slideUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        .spin { animation: spin 0.8s linear infinite; display: inline-block; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      <Toast toasts={toasts} />

      <div style={{ display: "flex", flexDirection: "column", flex: 1, overflow: "hidden" }}>
        <PageHeader
          title={<><span>Transaction Log</span> <span style={{ color: "var(--text-muted)", fontWeight: 600 }}>({filtered.length})</span></>}
          search={search} onSearch={setSearch}
          showCategories categories={statusCategories}
          categoryValue={statusFilter} onCategoryChange={setStatusFilter}
          sortOrder={sortOrder}
          onToggleSort={() => setSortOrder(prev => prev === "asc" ? "desc" : "asc")}
        />

        {error && (
          <div className="card card-padded" style={{ color: "#ef4444", margin: "0 0 16px" }}>{error}</div>
        )}

        <div className="full-table-wrap">
          <div className="table-scroll">
            <table className="dash-table">
              <thead>
                <tr>
                  <th>Order ID</th><th>Customer</th><th>Items</th>
                  <th>Total Price</th><th>Payment</th><th>Status</th><th>Date</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={7} style={{ textAlign: "center", padding: 40 }}>
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, color: "var(--text-muted)" }}>
                        <i className="bi bi-arrow-repeat spin" style={{ fontSize: "1.4rem", color: "var(--brand-mid)" }} />
                        <span style={{ fontSize: "0.83rem" }}>Loading transactions…</span>
                      </div>
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ textAlign: "center", padding: 40 }}>
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, color: "var(--text-muted)" }}>
                        <i className="bi bi-receipt" style={{ fontSize: "1.6rem" }} />
                        <span style={{ fontSize: "0.83rem" }}>No transactions found</span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filtered.map((t, i) => (
                    <tr
                      key={`${t.trackingId}-${i}`}
                      className={`${canManage ? "clickable" : ""}${selected?.dbId === t.dbId ? " selected" : ""}`}
                      onClick={() => canManage && openOrder(t)}
                    >
                      <td className="cell-id">{t.trackingId}</td>
                      <td className="cell-bold">{t.username}</td>
                      <td className="cell-muted">{t.orderAmount} item{t.orderAmount !== 1 ? "s" : ""}</td>
                      <td className="cell-amount">{t.totalPrice}</td>
                      <td className="cell-muted">{t.paymentMode}</td>
                      <td><Badge status={t.status} /></td>
                      <td className="cell-muted">{t.date}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* SlidePanel already renders title + X button — OrderPanel adds no extra header */}
      {canManage && (
        <SlidePanel
          isOpen={panelOpen}
          onClose={handleClose}
          title={selected ? `Order ${selected.trackingId}` : "Order"}
          mode="edit"
          footer={null}
        >
          {selected && (
            <OrderPanel
              order={selected}
              onClose={handleClose}
              onSave={handleSave}
              saving={saving}
            />
          )}
        </SlidePanel>
      )}
    </>
  );
}
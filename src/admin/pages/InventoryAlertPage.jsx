/**
 * src/admin/pages/InventoryAlertPage.jsx
 * Cache key: "inventory_alerts"
 * Consistent with InventoryPage / UsersPage patterns.
 */

import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import Badge      from "../components/Badge";
import PageHeader from "../components/PageHeader";
import SlidePanel from "../components/SlidePanel";
import { canManageAdminPanels } from "../utils";
import { LINK_PATH } from "../data/LinkPath.jsx";
import { useCache }  from "../data/CacheContext";

const API      = `${LINK_PATH}InventoryAlertController.php`;
const API_CATS = `${LINK_PATH}InventoryAlertController.php?resource=categories`;
const API_PRODS= `${LINK_PATH}InventoryAlertController.php?resource=products`;

const CACHE_ALERTS = "inventory_alerts";

function authHeader() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

const EMPTY_FORM = {
  rule_name:       "",
  category_id:     "",
  product_id:      "",
  stock_condition: "",
  rule_value:      "",
  enabled:         "1",
};

const CONDITIONS = [
  { value: "<",  label: "Less Than (<)" },
  { value: "<=", label: "Less Than or Equal To (≤)" },
  { value: "=",  label: "Equal To (=)" },
  { value: ">=", label: "Greater Than or Equal To (≥)" },
  { value: ">",  label: "Greater Than (>)" },
];

// ─── Toast ────────────────────────────────────────────────────────────────────

function Toast({ toasts }) {
  return (
    <div style={{
      position: "fixed", bottom: 24, right: 24,
      display: "flex", flexDirection: "column", gap: 10,
      zIndex: 9999, pointerEvents: "none",
    }}>
      {toasts.map(t => (
        <div key={t.id} style={{
          display: "flex", alignItems: "center", gap: 10,
          padding: "12px 18px", borderRadius: 12,
          background: t.type === "success" ? "#F0FDF4" : t.type === "error" ? "#FEF2F2" : t.type === "loading" ? "#FFFBEB" : "#EFF6FF",
          border: `1.5px solid ${t.type === "success" ? "#86EFAC" : t.type === "error" ? "#FCA5A5" : t.type === "loading" ? "#FCD34D" : "#BFDBFE"}`,
          boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
          fontSize: "0.83rem", fontWeight: 600,
          color: t.type === "success" ? "#15803D" : t.type === "error" ? "#DC2626" : t.type === "loading" ? "#B45309" : "#1D4ED8",
          minWidth: 220, maxWidth: 340,
          animation: "slideUp 0.2s ease", pointerEvents: "auto",
        }}>
          <i className={`bi ${t.type === "success" ? "bi-check-circle-fill" : t.type === "error" ? "bi-x-circle-fill" : t.type === "loading" ? "bi-arrow-repeat spin" : "bi-info-circle-fill"}`}
            style={{ fontSize: "1rem", flexShrink: 0 }} />
          {t.message}
        </div>
      ))}
    </div>
  );
}

// ─── Alert Form ───────────────────────────────────────────────────────────────

function AlertForm({ form, onChange, categories, products, loadingProducts }) {
  return (
    <>
      <div className="form-group">
        <label className="form-label">Rule Name</label>
        <input className="form-control" type="text" placeholder="e.g. Low coffee stock"
          value={form.rule_name} onChange={e => onChange("rule_name", e.target.value)} />
      </div>

      <div className="form-group">
        <label className="form-label">Category</label>
        <select className="form-control" value={form.category_id}
          onChange={e => { onChange("category_id", e.target.value); onChange("product_id", ""); }}>
          <option value="">— Select category —</option>
          {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>

      <div className="form-group">
        <label className="form-label">Product</label>
        <select className="form-control" value={form.product_id}
          onChange={e => onChange("product_id", e.target.value)}
          disabled={!form.category_id || loadingProducts}>
          <option value="">
            {loadingProducts ? "Loading…" : form.category_id ? "— Select product —" : "Select a category first"}
          </option>
          {products.map(p => (
            <option key={p.id} value={p.id}>{p.name} (qty: {p.qty})</option>
          ))}
        </select>
      </div>

      <div className="form-row cols-2">
        <div className="form-group">
          <label className="form-label">Condition</label>
          <select className="form-control" value={form.stock_condition}
            onChange={e => onChange("stock_condition", e.target.value)}>
            <option value="">— Select condition —</option>
            {CONDITIONS.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Threshold (qty)</label>
          <input className="form-control" type="number" placeholder="0" min="0"
            value={form.rule_value} onChange={e => onChange("rule_value", e.target.value)} />
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Status</label>
        <select className="form-control" value={form.enabled}
          onChange={e => onChange("enabled", e.target.value)}>
          <option value="1">Online</option>
          <option value="0">Offline</option>
        </select>
      </div>
    </>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function InventoryAlertPage() {
  const cache = useCache();
  const canManage = canManageAdminPanels();

  const [alerts,     setAlerts]     = useState(() => cache.get(CACHE_ALERTS) ?? []);
  const [loading,    setLoading]    = useState(() => cache.get(CACHE_ALERTS) === null);
  const [saving,     setSaving]     = useState(false);

  const [categories,      setCategories]      = useState([]);
  const [products,        setProducts]        = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);

  const [search,     setSearch]     = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortOrder,  setSortOrder]  = useState("desc");

  const [panelOpen,  setPanelOpen]  = useState(false);
  const [panelMode,  setPanelMode]  = useState("edit");
  const [selectedId, setSelectedId] = useState(null);
  const [form,       setForm]       = useState(EMPTY_FORM);

  // ─── Toast ──────────────────────────────────────────────────────────────
  const [toasts, setToasts] = useState([]);
  const toastCounter = useRef(0);

  function showToast(message, type = "success", duration = 3000) {
    const id = ++toastCounter.current;
    setToasts(prev => [...prev, { id, message, type }]);
    if (type !== "loading") setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), duration);
    return id;
  }
  function dismissToast(id) { setToasts(prev => prev.filter(t => t.id !== id)); }

  // ─── Fetch alerts ─────────────────────────────────────────────────────────

  const loadAlerts = useCallback(async (silent = false, force = false) => {
    if (!force && cache.get(CACHE_ALERTS) !== null) {
      setAlerts(cache.get(CACHE_ALERTS)); setLoading(false); return;
    }
    if (!silent) setLoading(true);
    try {
      const res  = await fetch(API, { headers: authHeader() });
      const data = await res.json();
      if (data.success) { setAlerts(data.alerts); cache.set(CACHE_ALERTS, data.alerts); }
      else throw new Error(data.message);
    } catch (err) {
      showToast(err.message || "Failed to load alerts", "error");
    } finally { setLoading(false); }
  }, [cache]);

  // ─── Fetch categories (once) ─────────────────────────────────────────────

  useEffect(() => {
    loadAlerts();
    fetch(API_CATS, { headers: authHeader() })
      .then(r => r.json())
      .then(d => { if (d.success) setCategories(d.categories); })
      .catch(() => {});
  }, [loadAlerts]);

  // ─── Fetch products when category changes ────────────────────────────────

  useEffect(() => {
    if (!form.category_id) { setProducts([]); return; }
    setLoadingProducts(true);
    fetch(`${API_PRODS}&category_id=${form.category_id}`, { headers: authHeader() })
      .then(r => r.json())
      .then(d => { if (d.success) setProducts(d.products); })
      .catch(() => {})
      .finally(() => setLoadingProducts(false));
  }, [form.category_id]);

  // ─── Filter + Sort ────────────────────────────────────────────────────────

  const filterOptions = [
    { value: "all",     label: "All" },
    { value: "online",  label: "Online" },
    { value: "offline", label: "Offline" },
    { value: "warning", label: "Warning" },
    { value: "normal",  label: "Normal" },
  ];

  const filtered = useMemo(() => {
    let res = [...alerts];
    const q = search.toLowerCase();
    res = res.filter(a =>
      a.rule_name.toLowerCase().includes(q) ||
      a.product_name.toLowerCase().includes(q) ||
      a.category_name.toLowerCase().includes(q)
    );
    if (statusFilter === "online")  res = res.filter(a => a.status  === "Online");
    if (statusFilter === "offline") res = res.filter(a => a.status  === "Offline");
    if (statusFilter === "warning") res = res.filter(a => a.alert   === "Warning");
    if (statusFilter === "normal")  res = res.filter(a => a.alert   === "Normal");
    res.sort((a, b) => sortOrder === "asc" ? a.rule_id - b.rule_id : b.rule_id - a.rule_id);
    return res;
  }, [alerts, search, statusFilter, sortOrder]);

  // ─── Panel helpers ────────────────────────────────────────────────────────

  function updateForm(key, value) { setForm(prev => ({ ...prev, [key]: value })); }

  function openEdit(alert) {
    if (!canManage) return;
    setSelectedId(alert.rule_id);
    setForm({
      rule_name:       alert.rule_name,
      category_id:     String(alert.category_id),
      product_id:      String(alert.product_id),
      stock_condition: alert.stock_condition,
      rule_value:      String(alert.rule_value),
      enabled:         String(alert.enabled),
    });
    setPanelMode("edit");
    setPanelOpen(true);
  }

  function openAdd() {
    if (!canManage) return;
    setSelectedId(null);
    setForm(EMPTY_FORM);
    setProducts([]);
    setPanelMode("add");
    setPanelOpen(true);
  }

  function handleClose() { setPanelOpen(false); setSelectedId(null); }

  function buildPayload() {
    return {
      rule_name:       form.rule_name,
      product_id:      Number(form.product_id),
      category_id:     Number(form.category_id),
      stock_condition: form.stock_condition,
      rule_value:      Number(form.rule_value),
      enabled:         Number(form.enabled),
    };
  }

  // ─── CRUD ─────────────────────────────────────────────────────────────────

  async function handleAdd() {
    if (!canManage) return;
    setSaving(true);
    const loadId = showToast("Adding rule…", "loading");
    try {
      const res  = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeader() },
        body: JSON.stringify(buildPayload()),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      dismissToast(loadId);
      showToast("Alert rule added", "success");
      cache.invalidate(CACHE_ALERTS);
      await loadAlerts(true, true);
      handleClose();
    } catch (err) {
      dismissToast(loadId);
      showToast(err.message || "Failed to add rule", "error");
    } finally { setSaving(false); }
  }

  async function handleUpdate() {
    if (!canManage) return;
    setSaving(true);
    const loadId = showToast("Saving changes…", "loading");
    try {
      const res  = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeader() },
        body: JSON.stringify({ ...buildPayload(), id: selectedId, _method: "PUT" }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      dismissToast(loadId);
      showToast("Alert rule updated", "success");
      cache.invalidate(CACHE_ALERTS);
      await loadAlerts(true, true);
      handleClose();
    } catch (err) {
      dismissToast(loadId);
      showToast(err.message || "Failed to update rule", "error");
    } finally { setSaving(false); }
  }

  async function handleDelete() {
    if (!canManage) return;
    if (!window.confirm("Delete this alert rule?")) return;
    setSaving(true);
    const loadId = showToast("Deleting rule…", "loading");
    try {
      const res  = await fetch(API, {
        method: "DELETE",
        headers: { "Content-Type": "application/json", ...authHeader() },
        body: JSON.stringify({ id: selectedId }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      dismissToast(loadId);
      showToast("Alert rule deleted", "success");
      cache.invalidate(CACHE_ALERTS);
      await loadAlerts(true, true);
      handleClose();
    } catch (err) {
      dismissToast(loadId);
      showToast(err.message || "Failed to delete rule", "error");
    } finally { setSaving(false); }
  }

  // ─── UI ──────────────────────────────────────────────────────────────────

  return (
    <>
      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .spin { animation: spin 0.8s linear infinite; display: inline-block; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      <Toast toasts={toasts} />

      <div className="page-area">
        <PageHeader
          title="Inventory Alert"
          onAdd={canManage ? openAdd : undefined}
          search={search}
          onSearch={setSearch}
          showCategories
          categories={filterOptions}
          categoryValue={statusFilter}
          onCategoryChange={setStatusFilter}
          sortOrder={sortOrder}
          onToggleSort={() => setSortOrder(prev => prev === "asc" ? "desc" : "asc")}
        />

        <div className="split-layout">
          <div className="split-table-wrap">
            <div className="table-scroll">
              <table className="dash-table">
                <thead>
                  <tr>
                    <th>Rule ID</th>
                    <th>Rule Name</th>
                    <th>Product</th>
                    <th>Category</th>
                    <th>Condition</th>
                    <th>Threshold</th>
                    <th>Current Qty</th>
                    <th>Status</th>
                    <th>Alert</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={9} style={{ textAlign: "center", padding: 40 }}>
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, color: "var(--text-muted)" }}>
                          <i className="bi bi-arrow-repeat spin" style={{ fontSize: "1.4rem", color: "var(--brand-mid)" }} />
                          <span style={{ fontSize: "0.83rem" }}>Loading alert rules…</span>
                        </div>
                      </td>
                    </tr>
                  ) : filtered.length === 0 ? (
                    <tr>
                      <td colSpan={9} style={{ textAlign: "center", padding: 40 }}>
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, color: "var(--text-muted)" }}>
                          <i className="bi bi-bell-slash" style={{ fontSize: "1.6rem" }} />
                          <span style={{ fontSize: "0.83rem" }}>No alert rules found</span>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filtered.map(a => (
                      <tr
                        key={a.rule_id}
                        className={`${canManage ? "clickable" : ""}${selectedId === a.rule_id ? " selected" : ""}`}
                        onClick={() => canManage && openEdit(a)}
                      >
                        <td className="cell-id">#{a.rule_id}</td>
                        <td className="cell-bold">{a.rule_name}</td>
                        <td className="cell-muted">{a.product_name}</td>
                        <td className="cell-muted">{a.category_name}</td>
                        <td className="cell-muted" style={{ fontFamily: "monospace", fontSize: "1rem" }}>
                          {a.stock_condition}
                        </td>
                        <td className="cell-amount">{a.rule_value}</td>
                        <td className="cell-amount">{a.quantity}</td>
                        <td><Badge status={a.status} /></td>
                        <td><Badge status={a.alert} /></td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {canManage && (
        <SlidePanel
          isOpen={panelOpen}
          onClose={handleClose}
          title={panelMode === "add" ? "Add Alert Rule" : "Edit Alert Rule"}
          mode={panelMode}
          footer={panelMode === "edit" ? (
            <>
              <button className="btn btn-delete"  onClick={handleDelete} disabled={saving}>Delete</button>
              <button className="btn btn-update"  onClick={handleUpdate} disabled={saving}>
                {saving ? <><i className="bi bi-arrow-repeat spin" /> Saving…</> : "Update"}
              </button>
            </>
          ) : (
            <>
              <button className="btn btn-cancel"  onClick={handleClose}  disabled={saving}>Cancel</button>
              <button className="btn btn-primary" onClick={handleAdd}    disabled={saving}>
                {saving ? <><i className="bi bi-arrow-repeat spin" /> Adding…</> : "Add Rule"}
              </button>
            </>
          )}
        >
          <AlertForm
            form={form}
            onChange={updateForm}
            categories={categories}
            products={products}
            loadingProducts={loadingProducts}
          />
        </SlidePanel>
      )}
    </>
  );
}
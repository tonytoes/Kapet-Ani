/**
 * src/admin/pages/InventoryPage.jsx
 * - Product ID is shown (read-only) in edit mode as a reference field
 *   but can be manually overridden if needed
 * - Product ID is hidden in add mode (auto-assigned by DB)
 */

import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import Badge      from "../components/Badge";
import PageHeader from "../components/PageHeader";
import SlidePanel from "../components/SlidePanel";
import { LINK_PATH } from "../data/LinkPath.jsx";
import { useCache }  from "../data/CacheContext";

const API            = `${LINK_PATH}inventoryController.php`;
const API_CATEGORIES = `${LINK_PATH}inventoryController.php?resource=categories`;
const CACHE_PRODUCTS = "inventory";
const CACHE_CATS     = "inventory_categories";

function authHeader() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

const EMPTY_FORM = {
  name: "", description: "", price: "", qty: "", category_id: "",
};

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

// ─── Image Block ──────────────────────────────────────────────────────────────

function ImageBlock({ preview, onFileChange, onRemove }) {
  const inputRef = useRef(null);
  return (
    <div className="panel-image-block">
      <div className="panel-img-placeholder">
        {preview
          ? <img src={preview} alt="Product" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "inherit" }} />
          : <i className="bi bi-image" />}
      </div>
      <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/gif,image/webp"
        style={{ display: "none" }} onChange={onFileChange} />
      <div className="panel-img-actions">
        <button type="button" className="btn btn-outline btn-sm" onClick={() => inputRef.current?.click()}>
          {preview ? "Change Image" : "Add Image"}
        </button>
        {preview && (
          <button type="button" className="btn btn-outline btn-sm" onClick={onRemove}>Remove Image</button>
        )}
      </div>
    </div>
  );
}

// ─── Product Form ─────────────────────────────────────────────────────────────

function InventoryForm({ form, onChange, mode, imagePreview, onFileChange, onRemoveImage, categories }) {
  return (
    <>
      <ImageBlock preview={imagePreview} onFileChange={onFileChange} onRemove={onRemoveImage} />

      {/* Product ID — only visible in edit mode */}
      {mode === "edit" && (
        <div className="form-group">
          <label className="form-label">Product ID</label>
          <input
            className="form-control"
            type="number"
            min="1"
            placeholder="ID"
            value={form.edit_id ?? ""}
            onChange={e => onChange("edit_id", e.target.value)}
          />
        </div>
      )}

      <div className="form-group">
        <label className="form-label">Name</label>
        <input className="form-control" type="text" placeholder="Product name"
          value={form.name} onChange={e => onChange("name", e.target.value)} />
      </div>

      <div className="form-group">
        <label className="form-label">Description</label>
        <textarea className="form-control" placeholder="Product description" rows={3}
          value={form.description} onChange={e => onChange("description", e.target.value)}
          style={{ resize: "vertical" }} />
      </div>

      <div className="form-row cols-2">
        <div className="form-group">
          <label className="form-label">Price (₱)</label>
          <input className="form-control" type="number" placeholder="0.00" min="0" step="0.01"
            value={form.price} onChange={e => onChange("price", e.target.value)} />
        </div>
        <div className="form-group">
          <label className="form-label">Stock (qty)</label>
          <input className="form-control" type="number" placeholder="0" min="0"
            value={form.qty} onChange={e => onChange("qty", e.target.value)} />
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Category</label>
        <select className="form-control" value={form.category_id ?? ""} onChange={e => onChange("category_id", e.target.value)}>
          <option value="">— Select category —</option>
          {categories.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>
    </>
  );
}

// ─── Manage Categories Panel ──────────────────────────────────────────────────

function ManageCategoriesPanel({ categories, onAdd, onDelete, saving }) {
  const [newName, setNewName] = useState("");

  function submit() {
    const trimmed = newName.trim();
    if (!trimmed) return;
    onAdd(trimmed);
    setNewName("");
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div>
        <label className="form-label">New Category</label>
        <div style={{ display: "flex", gap: 8 }}>
          <input
            className="form-control"
            style={{ flex: 1 }}
            placeholder="Category name"
            value={newName}
            onChange={e => setNewName(e.target.value)}
            onKeyDown={e => e.key === "Enter" && submit()}
          />
          <button
            type="button"
            className="btn btn-primary"
            onClick={submit}
            disabled={saving || !newName.trim()}
          >
            {saving ? <i className="bi bi-arrow-repeat spin" /> : "Add"}
          </button>
        </div>
      </div>

      <div style={{ borderTop: "1px solid var(--border, #e5e7eb)" }} />

      <div>
        <div className="form-label" style={{ marginBottom: 10 }}>
          Existing Categories
          <span style={{ marginLeft: 6, fontWeight: 400, color: "var(--text-muted)", fontSize: "0.78rem" }}>
            ({categories.length})
          </span>
        </div>

        {categories.length === 0 ? (
          <div style={{ textAlign: "center", padding: "32px 0", color: "var(--text-muted)", fontSize: "0.83rem" }}>
            <i className="bi bi-tag" style={{ fontSize: "1.4rem", display: "block", marginBottom: 8 }} />
            No categories yet
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {categories.map(c => (
              <div key={c.id} style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "10px 12px", borderRadius: 10,
                background: "var(--bg-muted, #f3f4f6)",
                border: "1px solid var(--border, #e5e7eb)",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <i className="bi bi-tag-fill" style={{ color: "var(--brand-mid, #8b5cf6)", fontSize: "0.85rem" }} />
                  <span style={{ fontSize: "0.87rem", fontWeight: 500 }}>{c.name}</span>
                </div>
                <button
                  type="button"
                  onClick={() => onDelete(c.id, c.name)}
                  disabled={saving}
                  style={{
                    background: "none", border: "none", cursor: "pointer",
                    color: "#ef4444", padding: "4px 6px", borderRadius: 6,
                    fontSize: "0.9rem", lineHeight: 1, transition: "background 0.15s",
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = "#fef2f2"}
                  onMouseLeave={e => e.currentTarget.style.background = "none"}
                  title="Delete category"
                >
                  <i className="bi bi-trash" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function InventoryPage() {
  const cache = useCache();

  const [products,   setProducts]   = useState(() => cache.get(CACHE_PRODUCTS) ?? []);
  const [categories, setCategories] = useState(() => cache.get(CACHE_CATS)     ?? []);
  const [loading,    setLoading]    = useState(() => cache.get(CACHE_PRODUCTS) === null);
  const [saving,     setSaving]     = useState(false);
  const [catSaving,  setCatSaving]  = useState(false);

  const [search,    setSearch]    = useState("");
  const [filter,    setFilter]    = useState("all");
  const [sortOrder, setSortOrder] = useState("desc");

  const [panelOpen,  setPanelOpen]  = useState(false);
  const [panelMode,  setPanelMode]  = useState("edit");
  const [selectedId, setSelectedId] = useState(null);
  const [form,       setForm]       = useState(EMPTY_FORM);
  const [imageFile,    setImageFile]    = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [removeImage,  setRemoveImage]  = useState(false);

  const [catPanelOpen, setCatPanelOpen] = useState(false);

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

  // ─── Fetch ────────────────────────────────────────────────────────────────

  const loadCategories = useCallback(async (force = false) => {
    if (!force && cache.get(CACHE_CATS) !== null) { setCategories(cache.get(CACHE_CATS)); return; }
    try {
      const res  = await fetch(API_CATEGORIES, { headers: authHeader() });
      const data = await res.json();
      if (data.success) { setCategories(data.categories); cache.set(CACHE_CATS, data.categories); }
    } catch { /* silent */ }
  }, [cache]);

  const loadProducts = useCallback(async (silent = false, force = false) => {
    if (!force && cache.get(CACHE_PRODUCTS) !== null) {
      setProducts(cache.get(CACHE_PRODUCTS)); setLoading(false); return;
    }
    if (!silent) setLoading(true);
    try {
      const res  = await fetch(API, { headers: authHeader() });
      const data = await res.json();
      if (data.success) { setProducts(data.products); cache.set(CACHE_PRODUCTS, data.products); }
      else throw new Error(data.message);
    } catch (err) {
      showToast(err.message || "Failed to load products", "error");
    } finally { setLoading(false); }
  }, [cache]);

  useEffect(() => { loadProducts(); loadCategories(); }, [loadProducts, loadCategories]);

  // ─── Filter options ───────────────────────────────────────────────────────

  const filterOptions = useMemo(() => {
    const opts = [
      { value: "all",              label: "All" },
      { value: "stock:available",  label: "Available" },
      { value: "stock:lowstock",   label: "Low Stock" },
      { value: "stock:outofstock", label: "Out of Stock" },
    ];
    if (categories.length > 0) {
      categories.forEach(c => opts.push({ value: `cat:${c.id}`, label: c.name }));
    }
    return opts;
  }, [categories]);

  // ─── Filtered + sorted rows ───────────────────────────────────────────────

  const filtered = useMemo(() => {
    let res = [...products];
    const q = search.toLowerCase();
    res = res.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      String(p.id).includes(q)
    );
    if (filter.startsWith("stock:")) {
      const s = filter.replace("stock:", "");
      res = res.filter(p => p.status.toLowerCase().replace(/ /g, "") === s);
    } else if (filter.startsWith("cat:")) {
      const catId = parseInt(filter.replace("cat:", ""), 10);
      res = res.filter(p => p.category_id === catId);
    }
    res.sort((a, b) => sortOrder === "asc" ? a.id - b.id : b.id - a.id);
    return res;
  }, [products, search, filter, sortOrder]);

  // ─── Image handlers ───────────────────────────────────────────────────────

  function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file); setRemoveImage(false);
    setImagePreview(URL.createObjectURL(file));
  }
  function handleRemoveImage() { setImageFile(null); setImagePreview(null); setRemoveImage(true); }

  // ─── Panel helpers ────────────────────────────────────────────────────────

  function updateForm(key, value) { setForm(prev => ({ ...prev, [key]: value })); }
  function resetImageState(url = null) { setImageFile(null); setRemoveImage(false); setImagePreview(url); }

  function openEdit(product) {
    setSelectedId(product.id);
    setForm({
      edit_id:     product.id,          // ← editable ID field
      name:        product.name,
      description: product.description ?? "",
      price:       product.price,
      qty:         product.qty,
      category_id: product.category_id ?? "",
    });
    resetImageState(product.image_url ?? null);
    setPanelMode("edit");
    setPanelOpen(true);
  }

  function openAdd() {
    setSelectedId(null);
    setForm(EMPTY_FORM);
    resetImageState(null);
    setPanelMode("add");
    setPanelOpen(true);
  }

  function handleClose() { setPanelOpen(false); setSelectedId(null); resetImageState(null); }

  function buildFormData(extraFields = {}) {
    const fd = new FormData();
    // Spread form fields except edit_id (handled separately)
    const { edit_id, ...rest } = form;
    Object.entries(rest).forEach(([k, v]) => fd.append(k, v ?? ""));
    Object.entries(extraFields).forEach(([k, v]) => fd.append(k, v ?? ""));
    if (imageFile)   fd.append("image", imageFile);
    if (removeImage) fd.append("remove_image", "1");
    return fd;
  }

  // ─── Category CRUD ────────────────────────────────────────────────────────

  async function handleAddCategory(name) {
    setCatSaving(true);
    try {
      const res  = await fetch(API_CATEGORIES, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeader() },
        body: JSON.stringify({ name }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      const updated = [...categories, data.category].sort((a, b) => a.name.localeCompare(b.name));
      setCategories(updated);
      cache.set(CACHE_CATS, updated);
      showToast(`Category "${name}" added`, "success");
    } catch (err) {
      showToast(err.message || "Failed to add category", "error");
    } finally { setCatSaving(false); }
  }

  async function handleDeleteCategory(id, name) {
    if (!window.confirm(`Delete "${name}"? Products in this category will become uncategorized.`)) return;
    setCatSaving(true);
    try {
      const res  = await fetch(API_CATEGORIES, {
        method: "DELETE",
        headers: { "Content-Type": "application/json", ...authHeader() },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      const updated = categories.filter(c => c.id !== id);
      setCategories(updated);
      cache.set(CACHE_CATS, updated);
      cache.invalidate(CACHE_PRODUCTS);
      await loadProducts(true, true);
      showToast(`Category "${name}" deleted`, "success");
    } catch (err) {
      showToast(err.message || "Failed to delete category", "error");
    } finally { setCatSaving(false); }
  }

  // ─── Product CRUD ─────────────────────────────────────────────────────────

  async function handleAdd() {
    setSaving(true);
    const loadId = showToast("Adding product…", "loading");
    try {
      const res  = await fetch(API, { method: "POST", headers: authHeader(), body: buildFormData() });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      dismissToast(loadId);
      showToast("Product added successfully", "success");
      cache.invalidate(CACHE_PRODUCTS);
      await loadProducts(true, true);
      handleClose();
    } catch (err) {
      dismissToast(loadId);
      showToast(err.message || "Failed to add product", "error");
    } finally { setSaving(false); }
  }

  async function handleUpdate() {
    setSaving(true);
    const loadId = showToast("Saving changes…", "loading");
    // Use form.edit_id if admin changed it, otherwise fall back to selectedId
    const targetId = form.edit_id ? Number(form.edit_id) : selectedId;
    try {
      const res  = await fetch(API, {
        method: "POST",
        headers: authHeader(),
        body: buildFormData({ id: targetId, _method: "PUT" }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      dismissToast(loadId);
      showToast("Product updated successfully", "success");
      cache.invalidate(CACHE_PRODUCTS);
      await loadProducts(true, true);
      handleClose();
    } catch (err) {
      dismissToast(loadId);
      showToast(err.message || "Failed to update product", "error");
    } finally { setSaving(false); }
  }

  async function handleDelete() {
    if (!window.confirm("Delete this product?")) return;
    setSaving(true);
    const loadId = showToast("Deleting product…", "loading");
    try {
      const res  = await fetch(API, {
        method: "DELETE",
        headers: { "Content-Type": "application/json", ...authHeader() },
        body: JSON.stringify({ id: selectedId }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      dismissToast(loadId);
      showToast("Product deleted", "success");
      cache.invalidate(CACHE_PRODUCTS);
      await loadProducts(true, true);
      handleClose();
    } catch (err) {
      dismissToast(loadId);
      showToast(err.message || "Failed to delete product", "error");
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
          title="Inventory"
          onAdd={openAdd}
          search={search}
          onSearch={setSearch}
          showCategories
          categories={filterOptions}
          categoryValue={filter}
          onCategoryChange={setFilter}
          sortOrder={sortOrder}
          onToggleSort={() => setSortOrder(prev => prev === "asc" ? "desc" : "asc")}
          extraActions={
            <button
              className="btn btn-outline btn-sm"
              onClick={() => setCatPanelOpen(true)}
              title="Manage Categories"
              style={{ display: "flex", alignItems: "center", gap: 6 }}
            >
              <i className="bi bi-tags" />
              Categories
            </button>
          }
        />

        <div className="split-layout">
          <div className="split-table-wrap">
            <div className="table-scroll">
              <table className="dash-table">
                <thead>
                  <tr>
                    <th>Product ID</th>
                    <th>Image</th>
                    <th>Name</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Category</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={7} style={{ textAlign: "center", padding: 40 }}>
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, color: "var(--text-muted)" }}>
                          <i className="bi bi-arrow-repeat spin" style={{ fontSize: "1.4rem", color: "var(--brand-mid)" }} />
                          <span style={{ fontSize: "0.83rem" }}>Loading products…</span>
                        </div>
                      </td>
                    </tr>
                  ) : filtered.length === 0 ? (
                    <tr>
                      <td colSpan={7} style={{ textAlign: "center", padding: 40 }}>
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, color: "var(--text-muted)" }}>
                          <i className="bi bi-box-seam" style={{ fontSize: "1.6rem" }} />
                          <span style={{ fontSize: "0.83rem" }}>No products found</span>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filtered.map(p => (
                      <tr
                        key={p.id}
                        className={`clickable${selectedId === p.id ? " selected" : ""}`}
                        onClick={() => openEdit(p)}
                      >
                        <td className="cell-id">PRD-{String(p.id).padStart(3, "0")}</td>
                        <td>
                          {p.image_url ? (
                            <img src={p.image_url} alt={p.name}
                              style={{ width: 36, height: 36, borderRadius: 8, objectFit: "cover", display: "block" }} />
                          ) : (
                            <div style={{ width: 36, height: 36, borderRadius: 8, background: "var(--bg-muted,#e5e7eb)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, color: "var(--text-muted,#9ca3af)" }}>
                              <i className="bi bi-image" />
                            </div>
                          )}
                        </td>
                        <td className="cell-bold">{p.name}</td>
                        <td className="cell-amount">₱{Number(p.price).toLocaleString("en-PH", { minimumFractionDigits: 2 })}</td>
                        <td className="cell-muted">{p.qty}</td>
                        <td className="cell-muted">{p.category}</td>
                        <td><Badge status={p.status} /></td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* ── Product SlidePanel ─────────────────────────────────────────────── */}
      <SlidePanel
        isOpen={panelOpen}
        onClose={handleClose}
        title={panelMode === "add" ? "Add Product" : "Edit Product"}
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
              {saving ? <><i className="bi bi-arrow-repeat spin" /> Adding…</> : "Add Product"}
            </button>
          </>
        )}
      >
        <InventoryForm
          form={form}
          onChange={updateForm}
          mode={panelMode}
          imagePreview={imagePreview}
          onFileChange={handleFileChange}
          onRemoveImage={handleRemoveImage}
          categories={categories}
        />
      </SlidePanel>

      {/* ── Manage Categories SlidePanel ───────────────────────────────────── */}
      <SlidePanel
        isOpen={catPanelOpen}
        onClose={() => setCatPanelOpen(false)}
        title="Manage Categories"
        mode="add"
        footer={
          <button className="btn btn-cancel" onClick={() => setCatPanelOpen(false)}>Close</button>
        }
      >
        <ManageCategoriesPanel
          categories={categories}
          onAdd={handleAddCategory}
          onDelete={handleDeleteCategory}
          saving={catSaving}
        />
      </SlidePanel>
    </>
  );
}
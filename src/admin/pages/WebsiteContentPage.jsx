import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import PageHeader from "../components/PageHeader";
import SlidePanel from "../components/SlidePanel";
import { LINK_PATH } from "../data/LinkPath.jsx";
import { canManageAdminPanels } from "../utils";

const API = `${LINK_PATH}WebsiteContentController.php`;
const PAGE_FILTERS = ["all", "home", "product", "blogs", "contact", "about"];

const EMPTY_FORM = {
  page: "",
  section: "",
  content_key: "",
  title: "",
  subtitle: "",
  description: "",
  cta_label: "",
  cta_link: "",
};

function authHeader() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function Toast({ toasts }) {
  return (
    <div style={{ position: "fixed", bottom: 24, right: 24, display: "flex", flexDirection: "column", gap: 8, zIndex: 9999 }}>
      {toasts.map((t) => (
        <div key={t.id} style={{
          padding: "11px 14px",
          borderRadius: 10,
          fontSize: "0.83rem",
          fontWeight: 600,
          border: "1px solid #e5e7eb",
          background: t.type === "error" ? "#fef2f2" : "#eff6ff",
          color: t.type === "error" ? "#b91c1c" : "#1d4ed8",
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
        }}>{t.message}</div>
      ))}
    </div>
  );
}

export default function WebsiteContentPage() {
  const canManage = canManageAdminPanels();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activePageFilter, setActivePageFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("desc");
  const [panelOpen, setPanelOpen] = useState(false);
  const [panelMode, setPanelMode] = useState("add");
  const [selectedId, setSelectedId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [removeImage, setRemoveImage] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toasts, setToasts] = useState([]);
  const toastCounter = useRef(0);
  const fileRef = useRef(null);

  const showToast = useCallback((message, type = "info") => {
    const id = ++toastCounter.current;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 2800);
  }, []);

  const loadRows = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(API, { headers: authHeader() });
      const data = await res.json();
      if (!data.success) throw new Error(data.message || "Failed to load content");
      setRows(data.items || []);
    } catch (err) {
      showToast(err.message || "Failed to load content", "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => { loadRows(); }, [loadRows]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    const list = rows.filter((r) =>
      (activePageFilter === "all" || r.page.toLowerCase() === activePageFilter) &&
      (
        r.page.toLowerCase().includes(q) ||
        r.section.toLowerCase().includes(q) ||
        (r.content_key || "").toLowerCase().includes(q) ||
        (r.title || "").toLowerCase().includes(q)
      )
    );
    return list.sort((a, b) => sortOrder === "asc" ? a.id - b.id : b.id - a.id);
  }, [rows, search, sortOrder, activePageFilter]);

  const groupedBySection = useMemo(() => {
    const map = {};
    filtered.forEach((item) => {
      const key = `${item.page} / ${item.section}`;
      if (!map[key]) map[key] = [];
      map[key].push(item);
    });
    return map;
  }, [filtered]);

  const updateForm = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const openAdd = () => {
    if (!canManage) return;
    setPanelMode("add");
    setSelectedId(null);
    setForm(EMPTY_FORM);
    setImageFile(null);
    setImagePreview(null);
    setRemoveImage(false);
    setPanelOpen(true);
  };

  const openEdit = (item) => {
    if (!canManage) return;
    setPanelMode("edit");
    setSelectedId(item.id);
    setForm({
      page: item.page || "",
      section: item.section || "",
      content_key: item.content_key || "",
      title: item.title || "",
      subtitle: item.subtitle || "",
      description: item.description || "",
      cta_label: item.cta_label || "",
      cta_link: item.cta_link || "",
    });
    setImageFile(null);
    setImagePreview(item.image_url || null);
    setRemoveImage(false);
    setPanelOpen(true);
  };

  const closePanel = () => {
    setPanelOpen(false);
    setSelectedId(null);
    setImageFile(null);
    setImagePreview(null);
    setRemoveImage(false);
  };

  const onFileChange = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setImageFile(f);
    setRemoveImage(false);
    setImagePreview(URL.createObjectURL(f));
  };

  const buildFormData = (extra = {}) => {
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v ?? ""));
    Object.entries(extra).forEach(([k, v]) => fd.append(k, v ?? ""));
    if (imageFile) fd.append("image", imageFile);
    if (removeImage) fd.append("remove_image", "1");
    return fd;
  };

  const handleAdd = async () => {
    setSaving(true);
    try {
      const res = await fetch(API, { method: "POST", headers: authHeader(), body: buildFormData() });
      const data = await res.json();
      if (!data.success) throw new Error(data.message || "Failed to add content");
      showToast("Content item added");
      closePanel();
      loadRows();
    } catch (err) {
      showToast(err.message || "Failed to add content", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleUpdate = async () => {
    setSaving(true);
    try {
      const res = await fetch(API, {
        method: "POST",
        headers: authHeader(),
        body: buildFormData({ id: selectedId, _method: "PUT" }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message || "Failed to update content");
      showToast("Content item updated");
      closePanel();
      loadRows();
    } catch (err) {
      showToast(err.message || "Failed to update content", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this content item?")) return;
    setSaving(true);
    try {
      const res = await fetch(API, {
        method: "DELETE",
        headers: { "Content-Type": "application/json", ...authHeader() },
        body: JSON.stringify({ id: selectedId }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message || "Failed to delete content");
      showToast("Content item deleted");
      closePanel();
      loadRows();
    } catch (err) {
      showToast(err.message || "Failed to delete content", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Toast toasts={toasts} />
      <div className="page-area">
        <PageHeader
          title="Website Content"
          onAdd={canManage ? openAdd : undefined}
          search={search}
          onSearch={setSearch}
          sortOrder={sortOrder}
          onToggleSort={() => setSortOrder((prev) => prev === "asc" ? "desc" : "asc")}
        />
        <div className="split-layout">
          <div className="split-table-wrap">
            <div style={{ padding: 14 }}>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 12 }}>
                {PAGE_FILTERS.map((p) => {
                  const active = activePageFilter === p;
                  const label = p === "all" ? "All Pages" : p[0].toUpperCase() + p.slice(1);
                  return (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setActivePageFilter(p)}
                      className="btn btn-outline btn-sm"
                      style={{
                        borderRadius: 999,
                        borderColor: active ? "var(--brand-mid, #8b5cf6)" : undefined,
                        color: active ? "var(--brand-mid, #8b5cf6)" : undefined,
                        background: active ? "rgba(139,92,246,0.08)" : "#fff",
                      }}
                    >
                      {label}
                    </button>
                  );
                })}
                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  onClick={() => setSortOrder("desc")}
                  style={{ borderRadius: 999, background: sortOrder === "desc" ? "rgba(59,130,246,0.08)" : "#fff" }}
                >
                  Newest First
                </button>
                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  onClick={() => setSortOrder("asc")}
                  style={{ borderRadius: 999, background: sortOrder === "asc" ? "rgba(59,130,246,0.08)" : "#fff" }}
                >
                  Oldest First
                </button>
              </div>
              {loading ? (
                <div style={{ textAlign: "center", padding: 30 }}>Loading content…</div>
              ) : filtered.length === 0 ? (
                <div style={{ textAlign: "center", padding: 30 }}>No content found.</div>
              ) : (
                Object.entries(groupedBySection).map(([section, items]) => (
                  <section key={section} style={{ marginBottom: 18 }}>
                    <div style={{
                      fontSize: "0.78rem",
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      fontWeight: 700,
                      color: "var(--text-muted)",
                      marginBottom: 10,
                    }}>
                      {section}
                    </div>
                    <div style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                      gap: 12,
                    }}>
                      {items.map((r) => (
                        <article
                          key={r.id}
                          onClick={() => openEdit(r)}
                          style={{
                            border: "1px solid var(--border, #e5e7eb)",
                            borderRadius: 14,
                            background: "#fff",
                            boxShadow: "0 3px 14px rgba(0,0,0,0.05)",
                            overflow: "hidden",
                            cursor: canManage ? "pointer" : "default",
                          }}
                        >
                          {r.image_url ? (
                            <img src={r.image_url} alt={r.title || r.content_key} style={{ width: "100%", height: 128, objectFit: "cover" }} />
                          ) : (
                            <div style={{ height: 128, background: "linear-gradient(135deg,#f6f7fb,#edf2f7)" }} />
                          )}
                          <div style={{ padding: 12 }}>
                            <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginBottom: 6 }}>{r.content_key}</div>
                            <div style={{ fontWeight: 700, marginBottom: 4 }}>{r.title || "Untitled content"}</div>
                            <div style={{ fontSize: "0.83rem", color: "var(--text-muted)", minHeight: 34 }}>
                              {(r.description || r.subtitle || "No description").slice(0, 90)}
                            </div>
                            <div style={{ marginTop: 10, fontSize: "0.72rem", color: "var(--text-muted)" }}>
                              Updated: {r.updated_at ? new Date(r.updated_at).toLocaleString() : "—"}
                            </div>
                          </div>
                        </article>
                      ))}
                    </div>
                  </section>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {canManage && (
        <SlidePanel
          isOpen={panelOpen}
          onClose={closePanel}
          title={panelMode === "add" ? "Add Content Item" : "Edit Content Item"}
          mode={panelMode}
          footer={panelMode === "add" ? (
            <>
              <button className="btn btn-cancel" onClick={closePanel} disabled={saving}>Cancel</button>
              <button className="btn btn-primary" onClick={handleAdd} disabled={saving}>Add Content</button>
            </>
          ) : (
            <>
              <button className="btn btn-delete" onClick={handleDelete} disabled={saving}>Delete</button>
              <button className="btn btn-update" onClick={handleUpdate} disabled={saving}>Update</button>
            </>
          )}
        >
          <div className="form-group">
            <label className="form-label">Page</label>
            <input className="form-control" value={form.page} onChange={(e) => updateForm("page", e.target.value)} placeholder="home, about, product..." />
          </div>
          <div className="form-group">
            <label className="form-label">Section</label>
            <input className="form-control" value={form.section} onChange={(e) => updateForm("section", e.target.value)} placeholder="hero, featured, voucher..." />
          </div>
          <div className="form-group">
            <label className="form-label">Content Key</label>
            <input className="form-control" value={form.content_key} onChange={(e) => updateForm("content_key", e.target.value)} placeholder="home_hero_headline" />
          </div>
          <div className="form-group">
            <label className="form-label">Title</label>
            <input className="form-control" value={form.title} onChange={(e) => updateForm("title", e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Subtitle</label>
            <input className="form-control" value={form.subtitle} onChange={(e) => updateForm("subtitle", e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea className="form-control" rows={4} value={form.description} onChange={(e) => updateForm("description", e.target.value)} />
          </div>
          <div className="form-row cols-2">
            <div className="form-group">
              <label className="form-label">CTA Label</label>
              <input className="form-control" value={form.cta_label} onChange={(e) => updateForm("cta_label", e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">CTA Link</label>
              <input className="form-control" value={form.cta_link} onChange={(e) => updateForm("cta_link", e.target.value)} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Image</label>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/gif,image/webp" style={{ display: "none" }} onChange={onFileChange} />
              <button type="button" className="btn btn-outline btn-sm" onClick={() => fileRef.current?.click()}>
                {imagePreview ? "Change Image" : "Upload Image"}
              </button>
              {imagePreview && (
                <button type="button" className="btn btn-outline btn-sm" onClick={() => { setImageFile(null); setImagePreview(null); setRemoveImage(true); }}>
                  Remove Image
                </button>
              )}
            </div>
            {imagePreview && (
              <div style={{ marginTop: 10 }}>
                <img src={imagePreview} alt="Preview" style={{ width: "100%", maxHeight: 180, objectFit: "cover", borderRadius: 10, border: "1px solid #e5e7eb" }} />
              </div>
            )}
          </div>
        </SlidePanel>
      )}
    </>
  );
}


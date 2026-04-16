/**
 * src/admin/pages/UsersPage.jsx
 * Cache key: "users"
 * Invalidated after: add, update, delete
 * Paginated: 30 rows per page
 */

import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import Badge       from "../components/Badge";
import PageHeader  from "../components/PageHeader";
import SlidePanel  from "../components/SlidePanel";
import { maskEmail } from "../utils";
import { canAssignElevatedRoles, canManageAdminPanels } from "../utils";
import { LINK_PATH } from "../data/LinkPath.jsx";
import { useCache }  from "../data/CacheContext";
import { PHONE_COUNTRIES, digitsOnly, formatLocalPhone11, splitStoredPhone, composeStoredPhone } from "../../utils/phone";

const API       = `${LINK_PATH}usersController.php`;
const CACHE_KEY = "users";
const PAGE_SIZE = 30;

// ─── Pagination Bar ───────────────────────────────────────────────────────────

function PaginationBar({ page, totalPages, totalItems, onPage }) {
  const safePage = Math.min(page, totalPages);
  const start    = (safePage - 1) * PAGE_SIZE + 1;
  const end      = Math.min(safePage * PAGE_SIZE, totalItems);

  const pageNums = Array.from({ length: totalPages }, (_, i) => i + 1)
    .filter(n => n === 1 || n === totalPages || Math.abs(n - safePage) <= 1)
    .reduce((acc, n, idx, arr) => {
      if (idx > 0 && n - arr[idx - 1] > 1) acc.push("…");
      acc.push(n);
      return acc;
    }, []);

  const btnBase = {
    padding: "5px 10px", borderRadius: 7,
    border: "1.5px solid var(--border, #e5e7eb)",
    background: "none", fontSize: "0.82rem", fontWeight: 600,
    transition: "background 0.15s", cursor: "pointer",
  };

  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "12px 16px",
      borderTop: "1px solid var(--border, #e5e7eb)",
      background: "var(--bg-surface, #fff)",
      flexWrap: "wrap", gap: 8,
    }}>
      <span style={{ fontSize: "0.78rem", color: "var(--text-muted)", fontWeight: 500 }}>
        Showing {start}–{end} of {totalItems} users
      </span>
      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
        <button
          onClick={() => onPage(p => Math.max(1, p - 1))}
          disabled={safePage === 1}
          style={{ ...btnBase, color: safePage === 1 ? "var(--text-muted)" : "var(--text)", cursor: safePage === 1 ? "not-allowed" : "pointer" }}
        >
          <i className="bi bi-chevron-left" />
        </button>

        {pageNums.map((item, idx) =>
          item === "…" ? (
            <span key={`el-${idx}`} style={{ padding: "0 4px", color: "var(--text-muted)", fontSize: "0.82rem" }}>…</span>
          ) : (
            <button
              key={item}
              onClick={() => onPage(item)}
              style={{
                ...btnBase,
                minWidth: 32, padding: "5px 8px",
                borderColor: safePage === item ? "var(--brand-mid, #8b5cf6)" : "var(--border, #e5e7eb)",
                background:  safePage === item ? "var(--brand-mid, #8b5cf6)" : "none",
                color:       safePage === item ? "#fff" : "var(--text)",
              }}
            >
              {item}
            </button>
          )
        )}

        <button
          onClick={() => onPage(p => Math.min(totalPages, p + 1))}
          disabled={safePage === totalPages}
          style={{ ...btnBase, color: safePage === totalPages ? "var(--text-muted)" : "var(--text)", cursor: safePage === totalPages ? "not-allowed" : "pointer" }}
        >
          <i className="bi bi-chevron-right" />
        </button>
      </div>
    </div>
  );
}

function EyeIcon({ open }) {
  return open ? (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M2 12C3.8 8.2 7.5 6 12 6C16.5 6 20.2 8.2 22 12C20.2 15.8 16.5 18 12 18C7.5 18 3.8 15.8 2 12Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  ) : (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M3 3L21 21" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M10.6 6.2C11.1 6.07 11.55 6 12 6C16.5 6 20.2 8.2 22 12C21.15 13.79 19.85 15.28 18.23 16.37" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6.1 7.9C4.39 8.99 3.01 10.43 2 12C3.8 15.8 7.5 18 12 18C13.81 18 15.48 17.64 16.94 16.99" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9.9 9.9C9.36 10.44 9 11.18 9 12C9 13.66 10.34 15 12 15C12.82 15 13.56 14.64 14.1 14.1" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function authHeader() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function notifyUserUpdated() {
  window.dispatchEvent(new Event("userUpdated"));
}

const EMPTY_FORM = {
  first_name: "",
  last_name:  "",
  email:      "",
  phone:      "",
  address:    "",
  postalcode: "",
  password:   "",
  status:     "user",
};

// ─── Toast ──────────────────────────────────────────────────────────────────

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

// ─── Image Block ─────────────────────────────────────────────────────────────

function ImageBlock({ preview, onFileChange, onRemove }) {
  const inputRef = useRef(null);
  return (
    <div className="panel-image-block">
      <div className="panel-img-placeholder">
        {preview ? (
          <img src={preview} alt="User avatar"
            style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "inherit" }} />
        ) : (
          <i className="bi bi-person" />
        )}
      </div>
      <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/gif,image/webp"
        style={{ display: "none" }} onChange={onFileChange} />
      <div className="panel-img-actions">
        <button type="button" className="btn btn-outline btn-sm" onClick={() => inputRef.current?.click()}>
          {preview ? "Change Image" : "Add Image"}
        </button>
        {preview && (
          <button type="button" className="btn btn-outline btn-sm" onClick={onRemove}>
            Remove Image
          </button>
        )}
      </div>
    </div>
  );
}

// ─── User Form ────────────────────────────────────────────────────────────────

function ThemedSelect({ value, onChange, options, placeholder = "Select role", disabled = false }) {
  const [open, setOpen] = useState(false);
  const boxRef = useRef(null);
  const selected = options.find(o => o.value === value);

  useEffect(() => {
    function onOutsideClick(e) {
      if (boxRef.current && !boxRef.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", onOutsideClick);
    return () => document.removeEventListener("mousedown", onOutsideClick);
  }, []);

  return (
    <div className={`kp-select${open ? " open" : ""}`} ref={boxRef}>
      <button
        type="button"
        className="kp-select-trigger"
        onClick={() => !disabled && setOpen(prev => !prev)}
        aria-haspopup="listbox"
        aria-expanded={open}
        disabled={disabled}
      >
        <span>{selected?.label ?? placeholder}</span>
        <i className="bi bi-chevron-down" />
      </button>
      {open && (
        <div className="kp-select-menu" role="listbox">
          {options.map(opt => (
            <button
              type="button"
              key={opt.value}
              className={`kp-select-option${value === opt.value ? " active" : ""}`}
              onClick={() => { onChange(opt.value); setOpen(false); }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function UserForm({ form, onChange, mode, imagePreview, onFileChange, onRemoveImage, canAssignElevated }) {
  const [showPassword, setShowPassword] = useState(false);
  const [phoneCountry, setPhoneCountry] = useState(() => splitStoredPhone(form.phone || "").iso2);
  const selectedPhoneCountry = PHONE_COUNTRIES.find((c) => c.iso2 === phoneCountry) || PHONE_COUNTRIES[0];
  const roleLocked = !canAssignElevated && (form.status === "admin" || form.status === "superadmin");

  useEffect(() => { setShowPassword(false); }, [mode, form?.email]);
  useEffect(() => { setPhoneCountry(splitStoredPhone(form.phone || "").iso2); }, [form.phone]);

  const fields = [
    { label: "First Name",  id: "first_name", type: "text",     placeholder: "First name" },
    { label: "Last Name",   id: "last_name",  type: "text",     placeholder: "Last name" },
    { label: "Email",       id: "email",      type: "email",    placeholder: "email@example.com" },
    { label: "Phone",       id: "phone",      type: "tel",      placeholder: "0000 000 0000" },
    { label: "Address",     id: "address",    type: "text",     placeholder: "Street address" },
    { label: "Postal Code", id: "postalcode", type: "text",     placeholder: "Postal code" },
    {
      label: "Password", id: "password", type: "password",
      placeholder: mode === "edit" ? "Leave blank to keep current password" : "Password",
    },
  ];

  const roleOptions = [
    { value: "user",  label: "User" },
    { value: "staff", label: "Staff" },
    ...(canAssignElevated ? [
      { value: "admin",      label: "Admin" },
      { value: "superadmin", label: "SuperAdmin" },
    ] : []),
  ];

  if (!canAssignElevated && (form.status === "admin" || form.status === "superadmin")) {
    roleOptions.push({ value: form.status, label: `${form.status === "admin" ? "Admin" : "SuperAdmin"} (Locked)` });
  }

  return (
    <>
      <ImageBlock preview={imagePreview} onFileChange={onFileChange} onRemove={onRemoveImage} />
      {fields.map(f => (
        <div className="form-group" key={f.id}>
          <label className="form-label">{f.label}</label>
          {f.id === "password" ? (
            <div className="kp-admin-password-wrap">
              <input
                className="form-control kp-admin-password-input"
                type={showPassword ? "text" : "password"}
                placeholder={f.placeholder}
                value={form[f.id]}
                onChange={e => onChange(f.id, e.target.value)}
              />
              <button
                type="button"
                className="kp-admin-password-toggle"
                onClick={() => setShowPassword(prev => !prev)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                title={showPassword ? "Hide password" : "Show password"}
              >
                <EyeIcon open={showPassword} />
              </button>
            </div>
          ) : f.id === "phone" ? (
            <div className="kp-admin-phone-wrap">
              <div className="kp-admin-phone-country">
                <img
                  src={selectedPhoneCountry?.flagUrl}
                  alt={`${selectedPhoneCountry?.name || "Country"} flag`}
                  className="kp-admin-phone-flag"
                  loading="lazy"
                />
                <select
                  className="kp-admin-phone-cc"
                  value={phoneCountry}
                  onChange={e => {
                    const next = e.target.value;
                    setPhoneCountry(next);
                    const local = splitStoredPhone(form.phone || "").local;
                    onChange("phone", composeStoredPhone(next, local));
                  }}
                  aria-label="Country code"
                >
                  {PHONE_COUNTRIES.map(c => (
                    <option key={c.iso2} value={c.iso2}>
                      {c.iso2 === phoneCountry ? `+${c.dialCode}` : `${c.name} (+${c.dialCode})`}
                    </option>
                  ))}
                </select>
              </div>
              <input
                className="form-control kp-admin-phone-input"
                type="text"
                inputMode="numeric"
                placeholder={f.placeholder}
                value={formatLocalPhone11(splitStoredPhone(form.phone || "", phoneCountry).local)}
                onChange={e => onChange("phone", composeStoredPhone(phoneCountry, digitsOnly(e.target.value, 11)))}
              />
            </div>
          ) : f.id === "postalcode" ? (
            <input
              className="form-control"
              type="text"
              inputMode="numeric"
              placeholder={f.placeholder}
              value={form.postalcode}
              onChange={e => onChange("postalcode", digitsOnly(e.target.value, 10))}
            />
          ) : (
            <input
              className="form-control"
              type={f.type}
              placeholder={f.placeholder}
              value={form[f.id]}
              onChange={e => onChange(f.id, e.target.value)}
            />
          )}
        </div>
      ))}
      <div className="form-group">
        <label className="form-label">Role</label>
        <ThemedSelect
          value={form.status}
          onChange={v => onChange("status", v)}
          options={roleOptions}
          disabled={roleLocked}
        />
      </div>
    </>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function UsersPage() {
  const cache = useCache();
  const canManage = canManageAdminPanels();
  const canAssignElevated = canAssignElevatedRoles();
  const currentUserId = useMemo(() => {
    try {
      const raw = localStorage.getItem("user");
      const u = raw ? JSON.parse(raw) : null;
      const id = Number(u?.id || 0);
      return Number.isFinite(id) ? id : 0;
    } catch { return 0; }
  }, []);

  const [users,      setUsers]      = useState(() => cache.get(CACHE_KEY) ?? []);
  const [loading,    setLoading]    = useState(() => cache.get(CACHE_KEY) === null);
  const [saving,     setSaving]     = useState(false);
  const [search,     setSearch]     = useState("");
  const [panelOpen,  setPanelOpen]  = useState(false);
  const [panelMode,  setPanelMode]  = useState("edit");
  const [selectedId, setSelectedId] = useState(null);
  const [form,       setForm]       = useState(EMPTY_FORM);
  const [roleFilter, setRoleFilter] = useState("all");
  const [sortOrder,  setSortOrder]  = useState("desc");
  const [page,       setPage]       = useState(1);
  const [imageFile,    setImageFile]    = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [removeImage,  setRemoveImage]  = useState(false);

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

  // ─── Fetch ──────────────────────────────────────────────────────────────

  const loadUsers = useCallback(async (silent = false, force = false) => {
    if (!force && cache.get(CACHE_KEY) !== null) {
      setUsers(cache.get(CACHE_KEY)); setLoading(false); return;
    }
    if (!silent) setLoading(true);
    try {
      const res  = await fetch(API, { headers: authHeader() });
      const data = await res.json();
      if (data.success) { setUsers(data.users); cache.set(CACHE_KEY, data.users); }
      else throw new Error(data.message);
    } catch (err) {
      showToast(err.message || "Failed to load users", "error");
    } finally { setLoading(false); }
  }, [cache]);

  useEffect(() => { loadUsers(); }, [loadUsers]);

  // ─── Filter + Sort ────────────────────────────────────────────────────────

  const filtered = useMemo(() => {
    let res = [...users];
    const q = search.toLowerCase();
    res = res.filter(u => u.username.toLowerCase().includes(q) || u.email.toLowerCase().includes(q));
    if (roleFilter !== "all") res = res.filter(u => (u.status || "").toLowerCase() === roleFilter);
    res.sort((a, b) => sortOrder === "asc" ? a.id - b.id : b.id - a.id);
    return res;
  }, [users, search, roleFilter, sortOrder]);

  // ─── Pagination derived values ────────────────────────────────────────────

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage   = Math.min(page, totalPages);
  const pageSlice  = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);
  const resetPage  = () => setPage(1);

  // ─── Image handlers ──────────────────────────────────────────────────────

  function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file); setRemoveImage(false);
    setImagePreview(URL.createObjectURL(file));
  }
  function handleRemoveImage() { setImageFile(null); setImagePreview(null); setRemoveImage(true); }

  // ─── Panel helpers ────────────────────────────────────────────────────────

  function updateForm(key, value) { setForm(prev => ({ ...prev, [key]: value })); }

  function resetImageState(existingUrl = null) {
    setImageFile(null); setRemoveImage(false); setImagePreview(existingUrl ?? null);
  }

  function openEdit(user) {
    if (!canManage) return;
    const targetRole = String(user?.status || "").toLowerCase();
    if (!canAssignElevated && targetRole === "superadmin" && Number(user.id) !== currentUserId) {
      showToast("Only superadmin can edit a SuperAdmin account", "error"); return;
    }
    if (!canAssignElevated && targetRole === "admin") {
      const targetId = Number(user?.id || 0);
      if (!(currentUserId > 0 && targetId > 0 && targetId === currentUserId)) {
        showToast("Only superadmin can edit other Admin accounts", "error"); return;
      }
    }
    setSelectedId(user.id);
    setForm({
      first_name: user.first_name ?? "",
      last_name:  user.last_name  ?? "",
      email:      user.email,
      phone:      user.phone ?? "",
      address:    user.address ?? "",
      postalcode: user.postalcode ?? "",
      password:   "",
      status:     user.status?.toLowerCase(),
    });
    resetImageState(user.image_url ?? null);
    setPanelMode("edit");
    setPanelOpen(true);
  }

  function openAdd() {
    if (!canManage) return;
    setSelectedId(null);
    setForm(EMPTY_FORM);
    resetImageState(null);
    setPanelMode("add");
    setPanelOpen(true);
  }

  function handleClose() { setPanelOpen(false); setSelectedId(null); resetImageState(null); }

  function buildFormData(extraFields = {}) {
    const fd = new FormData();
    try {
      const token = localStorage.getItem("token");
      if (token) fd.append("auth_token", token);
    } catch {}
    Object.entries(form).forEach(([k, v]) => fd.append(k, v ?? ""));
    Object.entries(extraFields).forEach(([k, v]) => fd.append(k, v ?? ""));
    if (imageFile)   fd.append("image",        imageFile);
    if (removeImage) fd.append("remove_image", "1");
    return fd;
  }

  function buildUserFromForm(id, prev = null) {
    const first    = form.first_name?.trim() ?? "";
    const last     = form.last_name?.trim()  ?? "";
    const username = `${first} ${last}`.trim() || prev?.username || "New User";
    return {
      ...(prev ?? {}),
      id, first_name: first, last_name: last, username,
      email: form.email, phone: form.phone ?? "",
      address: form.address ?? "", postalcode: form.postalcode ?? "",
      status: form.status,
      image_url: removeImage ? null : (imagePreview ?? prev?.image_url ?? null),
      totalSpent: prev?.totalSpent ?? "₱0.00",
      password:   prev?.password   ?? "••••••••",
    };
  }

  // ─── CRUD ─────────────────────────────────────────────────────────────────

  async function handleAdd() {
    if (!canManage) return;
    setSaving(true);
    const loadId = showToast("Adding user…", "loading");
    try {
      const res  = await fetch(API, { method: "POST", headers: authHeader(), body: buildFormData() });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      const created = data.user ?? buildUserFromForm(data.id ?? Date.now(), null);
      setUsers(prev => { const next = [created, ...prev]; cache.set(CACHE_KEY, next); return next; });
      dismissToast(loadId);
      showToast("User added successfully", "success");
      notifyUserUpdated();
      handleClose();
      loadUsers(true, true);
    } catch (err) {
      dismissToast(loadId);
      showToast(err.message || "Failed to add user", "error");
    } finally { setSaving(false); }
  }

  async function handleUpdate() {
    if (!canManage) return;
    setSaving(true);
    const loadId = showToast("Saving changes…", "loading");
    try {
      const res  = await fetch(API, { method: "POST", headers: authHeader(), body: buildFormData({ id: selectedId, _method: "PUT" }) });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      setUsers(prev => {
        const next = prev.map(u => {
          if (u.id !== selectedId) return u;
          const serverUser = data.user ?? null;
          return serverUser ? { ...u, ...serverUser } : buildUserFromForm(selectedId, u);
        });
        cache.set(CACHE_KEY, next);
        return next;
      });
      dismissToast(loadId);
      showToast("User updated successfully", "success");
      notifyUserUpdated();
      handleClose();
      loadUsers(true, true);
    } catch (err) {
      dismissToast(loadId);
      showToast(err.message || "Failed to update user", "error");
    } finally { setSaving(false); }
  }

  async function handleDelete() {
    if (!canManage) return;
    if (!window.confirm("Delete this user?")) return;
    setSaving(true);
    const loadId = showToast("Deleting user…", "loading");
    try {
      const res  = await fetch(API, { method: "DELETE", headers: { "Content-Type": "application/json", ...authHeader() }, body: JSON.stringify({ id: selectedId }) });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      setUsers(prev => { const next = prev.filter(u => u.id !== selectedId); cache.set(CACHE_KEY, next); return next; });
      dismissToast(loadId);
      showToast("User deleted", "success");
      notifyUserUpdated();
      handleClose();
      loadUsers(true, true);
    } catch (err) {
      dismissToast(loadId);
      showToast(err.message || "Failed to delete user", "error");
    } finally { setSaving(false); }
  }

  // ─── UI ───────────────────────────────────────────────────────────────────

  const userCategories = [
    { value: "all",        label: "All" },
    { value: "user",       label: "User" },
    { value: "staff",      label: "Staff" },
    { value: "admin",      label: "Admin" },
    { value: "superadmin", label: "SuperAdmin" },
  ];

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
          title={<><span>Users</span> <span style={{ color: "var(--text-muted)", fontWeight: 600 }}>({filtered.length})</span></>}
          onAdd={canManage ? openAdd : undefined}
          search={search}
          onSearch={v => { setSearch(v); resetPage(); }}
          showCategories
          categories={userCategories}
          categoryValue={roleFilter}
          onCategoryChange={v => { setRoleFilter(v); resetPage(); }}
          sortOrder={sortOrder}
          onToggleSort={() => { setSortOrder(prev => prev === "asc" ? "desc" : "asc"); resetPage(); }}
        />

        <div className="split-layout">
          <div className="split-table-wrap">
            <div className="table-scroll">
              <table className="dash-table">
                <thead>
                  <tr>
                    <th>User ID</th>
                    <th>Avatar</th>
                    <th>Username</th>
                    <th>Email</th>
                    <th>Password</th>
                    <th>Total Spent</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={7} style={{ textAlign: "center", padding: 40 }}>
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, color: "var(--text-muted)" }}>
                          <i className="bi bi-arrow-repeat spin" style={{ fontSize: "1.4rem", color: "var(--brand-mid)" }} />
                          <span style={{ fontSize: "0.83rem" }}>Loading users…</span>
                        </div>
                      </td>
                    </tr>
                  ) : pageSlice.length === 0 ? (
                    <tr>
                      <td colSpan={7} style={{ textAlign: "center", padding: 40 }}>
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, color: "var(--text-muted)" }}>
                          <i className="bi bi-people" style={{ fontSize: "1.6rem" }} />
                          <span style={{ fontSize: "0.83rem" }}>No users found</span>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    pageSlice.map(u => (
                      <tr
                        key={u.id}
                        className={`${canManage ? "clickable" : ""}${selectedId === u.id ? " selected" : ""}`}
                        onClick={() => canManage && openEdit(u)}
                      >
                        <td className="cell-id">{u.id}</td>
                        <td>
                          {u.image_url ? (
                            <img src={u.image_url} alt={u.username}
                              style={{ width: 36, height: 36, borderRadius: "50%", objectFit: "cover", display: "block" }} />
                          ) : (
                            <div style={{ width: 36, height: 36, borderRadius: "50%", background: "var(--bg-muted,#e5e7eb)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, color: "var(--text-muted,#9ca3af)" }}>
                              <i className="bi bi-person" />
                            </div>
                          )}
                        </td>
                        <td className="cell-bold">{u.username}</td>
                        <td className="cell-muted">{maskEmail(u.email)}</td>
                        <td className="cell-muted">{u.password}</td>
                        <td className="cell-amount">{u.totalSpent}</td>
                        <td><Badge status={u.status} /></td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* ── Pagination ── */}
            {!loading && filtered.length > PAGE_SIZE && (
              <PaginationBar
                page={safePage}
                totalPages={totalPages}
                totalItems={filtered.length}
                onPage={setPage}
              />
            )}
          </div>
        </div>
      </div>

      {canManage && (
        <SlidePanel
          isOpen={panelOpen}
          onClose={handleClose}
          title={panelMode === "add" ? "Add User" : "Edit User"}
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
                {saving ? <><i className="bi bi-arrow-repeat spin" /> Adding…</> : "Add"}
              </button>
            </>
          )}
        >
          <UserForm
            form={form}
            onChange={updateForm}
            mode={panelMode}
            imagePreview={imagePreview}
            onFileChange={handleFileChange}
            onRemoveImage={handleRemoveImage}
            canAssignElevated={canAssignElevated}
          />
        </SlidePanel>
      )}
    </>
  );
}
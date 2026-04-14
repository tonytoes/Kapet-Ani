/**
 * src/admin/pages/UsersPage.jsx
 * Cache key: "users"
 * Invalidated after: add, update, delete
 */

import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import Badge       from "../components/Badge";
import PageHeader  from "../components/PageHeader";
import SlidePanel  from "../components/SlidePanel";
import { maskEmail } from "../utils";
import { canAssignElevatedRoles, canManageAdminPanels } from "../utils";
import { LINK_PATH } from "../data/LinkPath.jsx";
import { useCache }  from "../data/CacheContext";   // ← NEW

const API        = `${LINK_PATH}usersController.php`;
const CACHE_KEY  = "users";

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
          padding: "12px 18px",
          borderRadius: 12,
          background: t.type === "success" ? "#F0FDF4"
                    : t.type === "error"   ? "#FEF2F2"
                    : t.type === "loading" ? "#FFFBEB"
                    : "#EFF6FF",
          border: `1.5px solid ${
            t.type === "success" ? "#86EFAC"
          : t.type === "error"   ? "#FCA5A5"
          : t.type === "loading" ? "#FCD34D"
          : "#BFDBFE"}`,
          boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
          fontSize: "0.83rem", fontWeight: 600,
          color: t.type === "success" ? "#15803D"
               : t.type === "error"   ? "#DC2626"
               : t.type === "loading" ? "#B45309"
               : "#1D4ED8",
          minWidth: 220, maxWidth: 340,
          animation: "slideUp 0.2s ease",
          pointerEvents: "auto",
        }}>
          <i className={`bi ${
            t.type === "success" ? "bi-check-circle-fill"
          : t.type === "error"   ? "bi-x-circle-fill"
          : t.type === "loading" ? "bi-arrow-repeat spin"
          : "bi-info-circle-fill"
          }`} style={{ fontSize: "1rem", flexShrink: 0 }} />
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

function UserForm({ form, onChange, mode, imagePreview, onFileChange, onRemoveImage, canAssignElevated }) {
  const fields = [
    { label: "First Name", id: "first_name", type: "text",  placeholder: "First name" },
    { label: "Last Name",  id: "last_name",  type: "text",  placeholder: "Last name" },
    { label: "Email",      id: "email",      type: "email", placeholder: "email@example.com" },
    {
      label: "Password", id: "password", type: "text",
      placeholder: mode === "edit" ? "Leave blank to keep current" : "Password",
    },
  ];

  const roleOptions = [
    { value: "user", label: "User" },
    { value: "staff", label: "Staff" },
    ...(canAssignElevated ? [
      { value: "admin", label: "Admin" },
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
          <input className="form-control" type={f.type} placeholder={f.placeholder}
            value={form[f.id]} onChange={e => onChange(f.id, e.target.value)} />
        </div>
      ))}
      <div className="form-group">
        <label className="form-label">Role</label>
        <select className="form-control" value={form.status} onChange={e => onChange("status", e.target.value)}>
          {roleOptions.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>
    </>
  );
}


// ─── Main Page ────────────────────────────────────────────────────────────────

export default function UsersPage() {
  const cache = useCache();   // ← NEW
  const canManage = canManageAdminPanels();
  const canAssignElevated = canAssignElevatedRoles();

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
  const [imageFile,    setImageFile]    = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [removeImage,  setRemoveImage]  = useState(false);

  // ─── Toast ──────────────────────────────────────────────────────────────
  const [toasts, setToasts] = useState([]);
  const toastCounter = useRef(0);

  function showToast(message, type = "success", duration = 3000) {
    const id = ++toastCounter.current;
    setToasts(prev => [...prev, { id, message, type }]);
    if (type !== "loading") {
      setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), duration);
    }
    return id;
  }

  function dismissToast(id) {
    setToasts(prev => prev.filter(t => t.id !== id));
  }

  // ─── Fetch (respects cache) ──────────────────────────────────────────────

  const loadUsers = useCallback(async (silent = false, force = false) => {
    // Return cached data if available and no forced refresh
    if (!force && cache.get(CACHE_KEY) !== null) {
      setUsers(cache.get(CACHE_KEY));
      setLoading(false);
      return;
    }

    if (!silent) setLoading(true);
    try {
      const res  = await fetch(API, { headers: authHeader() });
      const data = await res.json();
      if (data.success) {
        setUsers(data.users);
        cache.set(CACHE_KEY, data.users);   // ← store in cache
      } else {
        throw new Error(data.message);
      }
    } catch (err) {
      showToast(err.message || "Failed to load users", "error");
    } finally {
      setLoading(false);
    }
  }, [cache]);

  useEffect(() => { loadUsers(); }, [loadUsers]);

  // ─── Filter + Sort ───────────────────────────────────────────────────────

  const filtered = useMemo(() => {
    let res = [...users];
    const q = search.toLowerCase();
    res = res.filter(u => u.username.toLowerCase().includes(q) || u.email.toLowerCase().includes(q));
    if (roleFilter !== "all") res = res.filter(u => (u.status || "").toLowerCase() === roleFilter);
    res.sort((a, b) => sortOrder === "asc" ? a.id - b.id : b.id - a.id);
    return res;
  }, [users, search, roleFilter, sortOrder]);

  // ─── Image handlers ──────────────────────────────────────────────────────

  function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setRemoveImage(false);
    setImagePreview(URL.createObjectURL(file));
  }

  function handleRemoveImage() {
    setImageFile(null);
    setImagePreview(null);
    setRemoveImage(true);
  }

  // ─── Panel helpers ───────────────────────────────────────────────────────

  function updateForm(key, value) {
    setForm(prev => ({ ...prev, [key]: value }));
  }

  function resetImageState(existingUrl = null) {
    setImageFile(null);
    setRemoveImage(false);
    setImagePreview(existingUrl ?? null);
  }

  function openEdit(user) {
    if (!canManage) return;
    setSelectedId(user.id);
    setForm({
      first_name: user.first_name ?? "",
      last_name:  user.last_name  ?? "",
      email:      user.email,
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

  function handleClose() {
    setPanelOpen(false);
    setSelectedId(null);
    resetImageState(null);
  }

  function buildFormData(extraFields = {}) {
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v ?? ""));
    Object.entries(extraFields).forEach(([k, v]) => fd.append(k, v ?? ""));
    if (imageFile)   fd.append("image",        imageFile);
    if (removeImage) fd.append("remove_image", "1");
    return fd;
  }

  function buildUserFromForm(id, prev = null) {
    const first = form.first_name?.trim() ?? "";
    const last  = form.last_name?.trim() ?? "";
    const username = `${first} ${last}`.trim() || prev?.username || "New User";
    return {
      ...(prev ?? {}),
      id,
      first_name: first,
      last_name: last,
      username,
      email: form.email,
      status: form.status,
      image_url: removeImage ? null : (imagePreview ?? prev?.image_url ?? null),
      totalSpent: prev?.totalSpent ?? "₱0.00",
      password: prev?.password ?? "••••••••",
    };
  }

  // ─── CRUD (invalidate cache on mutation) ─────────────────────────────────

  async function handleAdd() {
    if (!canManage) return;
    setSaving(true);
    const loadId = showToast("Adding user…", "loading");
    try {
      const res  = await fetch(API, { method: "POST", headers: authHeader(), body: buildFormData() });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      const created = data.user ?? buildUserFromForm(data.id ?? Date.now(), null);
      setUsers(prev => {
        const next = [created, ...prev];
        cache.set(CACHE_KEY, next);
        return next;
      });
      dismissToast(loadId);
      showToast("User added successfully", "success");
      notifyUserUpdated();
      handleClose();
      loadUsers(true, true);
    } catch (err) {
      dismissToast(loadId);
      showToast(err.message || "Failed to add user", "error");
    } finally {
      setSaving(false);
    }
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
    } finally {
      setSaving(false);
    }
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
      setUsers(prev => {
        const next = prev.filter(u => u.id !== selectedId);
        cache.set(CACHE_KEY, next);
        return next;
      });
      dismissToast(loadId);
      showToast("User deleted", "success");
      notifyUserUpdated();
      handleClose();
      loadUsers(true, true);
    } catch (err) {
      dismissToast(loadId);
      showToast(err.message || "Failed to delete user", "error");
    } finally {
      setSaving(false);
    }
  }

  // ─── UI ───────────────────────────────────────────────────────────────────

  const userCategories = [
    { value: "all",   label: "All" },
    { value: "user",  label: "User" },
    { value: "staff", label: "Staff" },
    { value: "admin", label: "Admin" },
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
          title="Users"
          onAdd={canManage ? openAdd : undefined}
          search={search}
          onSearch={setSearch}
          showCategories
          categories={userCategories}
          categoryValue={roleFilter}
          onCategoryChange={setRoleFilter}
          sortOrder={sortOrder}
          onToggleSort={() => setSortOrder(prev => prev === "asc" ? "desc" : "asc")}
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
                  ) : filtered.length === 0 ? (
                    <tr>
                      <td colSpan={7} style={{ textAlign: "center", padding: 40 }}>
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, color: "var(--text-muted)" }}>
                          <i className="bi bi-people" style={{ fontSize: "1.6rem" }} />
                          <span style={{ fontSize: "0.83rem" }}>No users found</span>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filtered.map(u => (
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
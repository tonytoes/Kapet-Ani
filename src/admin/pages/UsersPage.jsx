import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import Badge from "../components/Badge";
import PageHeader from "../components/PageHeader";
import SlidePanel from "../components/SlidePanel";
import { maskEmail } from "../utils";
import { LINK_PATH } from "../data/LinkPath.jsx";

const API = `${LINK_PATH}usersController.php`;
function authHeader() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

const EMPTY_FORM = {
  first_name: "",
  last_name:  "",
  email:      "",
  password:   "",
  status:     "User",
};

// ─── Image Block ───────────────────────────────────────────────────────────

function ImageBlock({ preview, onFileChange, onRemove }) {
  const inputRef = useRef(null);

  return (
    <div className="panel-image-block">
      <div className="panel-img-placeholder">
        {preview ? (
          <img
            src={preview}
            alt="User avatar"
            style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "inherit" }}
          />
        ) : (
          <i className="bi bi-person" />
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/gif,image/webp"
        style={{ display: "none" }}
        onChange={onFileChange}
      />

      <div className="panel-img-actions">
        <button
          type="button"
          className="btn btn-outline btn-sm"
          onClick={() => inputRef.current?.click()}
        >
          {preview ? "Change Image" : "Add Image"}
        </button>

        {preview && (
          <button
            type="button"
            className="btn btn-outline btn-sm"
            onClick={onRemove}
          >
            Remove Image
          </button>
        )}
      </div>
    </div>
  );
}

// ─── User Form ─────────────────────────────────────────────────────────────

function UserForm({ form, onChange, mode, imagePreview, onFileChange, onRemoveImage }) {
  const fields = [
    { label: "First Name", id: "first_name", type: "text",  placeholder: "First name" },
    { label: "Last Name",  id: "last_name",  type: "text",  placeholder: "Last name" },
    { label: "Email",      id: "email",      type: "email", placeholder: "email@example.com" },
    {
      label: "Password",
      id: "password",
      type: "text",
      placeholder: mode === "edit" ? "Leave blank to keep current" : "Password",
    },
    { label: "Role", id: "status", type: "text", placeholder: "user / admin / staff" },
  ];

  return (
    <>
      <ImageBlock
        preview={imagePreview}
        onFileChange={onFileChange}
        onRemove={onRemoveImage}
      />

      {fields.map(f => (
        <div className="form-group" key={f.id}>
          <label className="form-label">{f.label}</label>
          <input
            className="form-control"
            type={f.type}
            placeholder={f.placeholder}
            value={form[f.id]}
            onChange={e => onChange(f.id, e.target.value)}
          />
        </div>
      ))}
    </>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────

export default function UsersPage() {
  const [users,   setUsers]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);
  const [saving,  setSaving]  = useState(false);

  const [search,    setSearch]    = useState("");
  const [panelOpen, setPanelOpen] = useState(false);
  const [panelMode, setPanelMode] = useState("edit");
  const [selectedId, setSelectedId] = useState(null);
  const [form,      setForm]      = useState(EMPTY_FORM);

  const [roleFilter, setRoleFilter] = useState("all");
  const [sortOrder,  setSortOrder]  = useState("desc");

  // Image state
  const [imageFile,    setImageFile]    = useState(null);   // File to upload
  const [imagePreview, setImagePreview] = useState(null);   // URL shown in UI
  const [removeImage,  setRemoveImage]  = useState(false);  // Flag to clear image

  // ─── Fetch ───────────────────────────────────────────────────────────────

  const loadUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res  = await fetch(API, { headers: authHeader() });
      const data = await res.json();
      if (data.success) setUsers(data.users);
      else throw new Error(data.message);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadUsers(); }, [loadUsers]);

  // ─── Filter + Sort ───────────────────────────────────────────────────────

  const filtered = useMemo(() => {
    let res = [...users];
    const q = search.toLowerCase();

    res = res.filter(u =>
      u.username.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q)
    );

    if (roleFilter !== "all") {
      res = res.filter(u => (u.status || "").toLowerCase() === roleFilter);
    }

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
    setSelectedId(user.id);
    setForm({
      first_name: user.first_name ?? "",
      last_name:  user.last_name  ?? "",
      email:      user.email,
      password:   "",
      status:     user.status,
    });
    resetImageState(user.image_url ?? null);
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

  function handleClose() {
    setPanelOpen(false);
    setSelectedId(null);
    resetImageState(null);
  }

  // ─── Build FormData ──────────────────────────────────────────────────────
  // NOTE: Never set Content-Type manually with FormData —
  // the browser must set it so it includes the multipart boundary.

  function buildFormData(extraFields = {}) {
    const fd = new FormData();

    // Text fields from form state
    Object.entries(form).forEach(([k, v]) => fd.append(k, v ?? ""));

    // Any extra fields (e.g. id for updates, _method for PUT override)
    Object.entries(extraFields).forEach(([k, v]) => fd.append(k, v ?? ""));

    if (imageFile)   fd.append("image",        imageFile);
    if (removeImage) fd.append("remove_image", "1");

    return fd;
  }

  // ─── CRUD ─────────────────────────────────────────────────────────────────

  async function handleAdd() {
    setSaving(true);
    setError(null);
    try {
      const res  = await fetch(API, {
        method:  "POST",
        headers: authHeader(),          // NO Content-Type — browser sets multipart boundary
        body:    buildFormData(),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      await loadUsers();
      handleClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleUpdate() {
    setSaving(true);
    setError(null);
    try {
      // PHP does not populate $_POST for PUT multipart requests on most servers.
      // Send as POST with _method=PUT so the controller can detect it.
      const res  = await fetch(API, {
        method:  "POST",
        headers: authHeader(),
        body:    buildFormData({ id: selectedId, _method: "PUT" }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      await loadUsers();
      handleClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!window.confirm("Delete this user?")) return;
    setSaving(true);
    setError(null);
    try {
      // DELETE never has a file, plain JSON is fine
      const res  = await fetch(API, {
        method:  "DELETE",
        headers: { "Content-Type": "application/json", ...authHeader() },
        body:    JSON.stringify({ id: selectedId }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      await loadUsers();
      handleClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  // ─── UI ───────────────────────────────────────────────────────────────────

  const userCategories = [
    { value: "all",   label: "All" },
    { value: "user",  label: "User" },
    { value: "admin", label: "Admin" },
  ];

  return (
    <>
      <div className="page-area">
        <PageHeader
          title="Users"
          onAdd={openAdd}
          search={search}
          onSearch={setSearch}
          showCategories
          categories={userCategories}
          categoryValue={roleFilter}
          onCategoryChange={setRoleFilter}
          sortOrder={sortOrder}
          onToggleSort={() => setSortOrder(prev => prev === "asc" ? "desc" : "asc")}
        />

        {error && (
          <div className="card card-padded" style={{ color: "#ef4444", marginBottom: 16 }}>
            {error}
          </div>
        )}

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
                      <td colSpan={7} style={{ textAlign: "center", padding: 32 }}>
                        Loading users…
                      </td>
                    </tr>
                  ) : filtered.length === 0 ? (
                    <tr>
                      <td colSpan={7} style={{ textAlign: "center", padding: 32 }}>
                        No users found.
                      </td>
                    </tr>
                  ) : (
                    filtered.map(u => (
                      <tr
                        key={u.id}
                        className={`clickable${selectedId === u.id ? " selected" : ""}`}
                        onClick={() => openEdit(u)}
                      >
                        <td className="cell-id">{u.id}</td>

                        <td>
                          {u.image_url ? (
                            <img
                              src={u.image_url}
                              alt={u.username}
                              style={{
                                width: 36, height: 36,
                                borderRadius: "50%",
                                objectFit: "cover",
                                display: "block",
                              }}
                            />
                          ) : (
                            <div style={{
                              width: 36, height: 36,
                              borderRadius: "50%",
                              background: "var(--bg-muted, #e5e7eb)",
                              display: "flex", alignItems: "center", justifyContent: "center",
                              fontSize: 16, color: "var(--text-muted, #9ca3af)",
                            }}>
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

      <SlidePanel
        isOpen={panelOpen}
        onClose={handleClose}
        title={panelMode === "add" ? "Add User" : "Edit User"}
        mode={panelMode}
        footer={panelMode === "edit" ? (
          <>
            <button className="btn btn-delete"  onClick={handleDelete} disabled={saving}>Delete</button>
            <button className="btn btn-update"  onClick={handleUpdate} disabled={saving}>Update</button>
          </>
        ) : (
          <>
            <button className="btn btn-cancel"  onClick={handleClose} disabled={saving}>Cancel</button>
            <button className="btn btn-primary" onClick={handleAdd}   disabled={saving}>Add</button>
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
        />
      </SlidePanel>
    </>
  );
}
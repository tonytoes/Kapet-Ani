import { useState, useMemo, useEffect, useCallback } from "react";
import Badge from "../components/Badge";
import PageHeader from "../components/PageHeader";
import SlidePanel from "../components/SlidePanel";
import { maskEmail } from "../utils";

const API = "http://localhost/backend/controllers/usersController.php";

// ─── helpers ───────────────────────────────────────────────────────────────

function authHeader() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

const EMPTY_FORM = {
  first_name: "",
  last_name: "",
  email: "",
  password: "",
  status: "User",
};

// ─── form ──────────────────────────────────────────────────────────────────

function UserForm({ form, onChange, mode }) {
  const fields = [
    { label: "First Name", id: "first_name", type: "text", placeholder: "First name" },
    { label: "Last Name", id: "last_name", type: "text", placeholder: "Last name" },
    { label: "Email", id: "email", type: "email", placeholder: "email@example.com" },
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
      <div className="panel-image-block">
        <div className="panel-img-placeholder">
          <i className="bi bi-person"></i>
        </div>
        <div className="panel-img-actions">
          <button type="button" className="btn btn-outline btn-sm">Add Image</button>
          <button type="button" className="btn btn-outline btn-sm">Remove Image</button>
        </div>
      </div>

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

// ─── main ──────────────────────────────────────────────────────────────────

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  const [search, setSearch] = useState("");
  const [panelOpen, setPanelOpen] = useState(false);
  const [panelMode, setPanelMode] = useState("edit");
  const [selectedId, setSelectedId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);

  const [roleFilter, setRoleFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("desc");

  // ─── fetch ───────────────────────────────────────────────────────────────

  const loadUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(API, { headers: authHeader() });
      const data = await res.json();
      if (data.success) setUsers(data.users);
      else throw new Error(data.message);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  // ─── FILTER + SORT (FIXED CLEAN PIPELINE) ───────────────────────────────

  const filtered = useMemo(() => {
    let res = [...users];

    const q = search.toLowerCase();

    // search
    res = res.filter(u =>
      u.username.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q)
    );

    // role filter (safe)
    if (roleFilter !== "all") {
      res = res.filter(u =>
        (u.status || "").toLowerCase() === roleFilter
      );
    }

    // sort
    res.sort((a, b) =>
      sortOrder === "asc" ? a.id - b.id : b.id - a.id
    );

    return res;
  }, [users, search, roleFilter, sortOrder]);

  // ─── helpers ─────────────────────────────────────────────────────────────

  function updateForm(key, value) {
    setForm(prev => ({ ...prev, [key]: value }));
  }

  function openEdit(user) {
    setSelectedId(user.id);
    setForm({
      first_name: user.first_name ?? user.username.split(" ")[0] ?? "",
      last_name: user.last_name ?? user.username.split(" ")[1] ?? "",
      email: user.email,
      password: "",
      status: user.status,
    });
    setPanelMode("edit");
    setPanelOpen(true);
  }

  function openAdd() {
    setSelectedId(null);
    setForm(EMPTY_FORM);
    setPanelMode("add");
    setPanelOpen(true);
  }

  function handleClose() {
    setPanelOpen(false);
    setSelectedId(null);
  }

  // ─── CRUD ────────────────────────────────────────────────────────────────

  async function handleAdd() {
    setSaving(true);
    try {
      const res = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeader() },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      await loadUsers();
      handleClose();
    } finally {
      setSaving(false);
    }
  }

  async function handleUpdate() {
    setSaving(true);
    try {
      const res = await fetch(API, {
        method: "PUT",
        headers: { "Content-Type": "application/json", ...authHeader() },
        body: JSON.stringify({ ...form, id: selectedId }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      await loadUsers();
      handleClose();
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!window.confirm("Delete this user?")) return;

    setSaving(true);
    try {
      const res = await fetch(API, {
        method: "DELETE",
        headers: { "Content-Type": "application/json", ...authHeader() },
        body: JSON.stringify({ id: selectedId }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      await loadUsers();
      handleClose();
    } finally {
      setSaving(false);
    }
  }

  // ─── UI CONFIG (IMPORTANT FIX) ──────────────────────────────────────────

  const userCategories = [
    { value: "all", label: "All" },
    { value: "user", label: "User" },
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
          onToggleSort={() =>
            setSortOrder(prev => (prev === "asc" ? "desc" : "asc"))
          }
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
                      <td colSpan={6} style={{ textAlign: "center", padding: 32 }}>
                        Loading users…
                      </td>
                    </tr>
                  ) : filtered.length === 0 ? (
                    <tr>
                      <td colSpan={6} style={{ textAlign: "center", padding: 32 }}>
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
            <button onClick={handleDelete} disabled={saving}>Delete</button>
            <button onClick={handleUpdate} disabled={saving}>Update</button>
          </>
        ) : (
          <>
            <button onClick={handleClose} disabled={saving}>Cancel</button>
            <button onClick={handleAdd} disabled={saving}>Add</button>
          </>
        )}
      >
        <UserForm form={form} onChange={updateForm} mode={panelMode} />
      </SlidePanel>

    </>
  );
}
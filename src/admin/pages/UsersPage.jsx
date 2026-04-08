import { useState, useMemo } from "react";
import Badge from "../components/Badge";
import PageHeader from "../components/PageHeader";
import SlidePanel from "../components/SlidePanel";
import { INITIAL_USERS } from "../data";
import { maskEmail, nextId } from "../utils";

const EMPTY_FORM = { username: "", email: "", password: "", status: "Customer" };

function UserForm({ form, onChange }) {
  const fields = [
    { label: "Username", id: "username", type: "text",  placeholder: "Username" },
    { label: "Email",    id: "email",    type: "email", placeholder: "email@example.com" },
    { label: "Password", id: "password", type: "text",  placeholder: "Password" },
    { label: "Status",   id: "status",   type: "text",  placeholder: "Customer / Admin" },
  ];

  return (
    <>
      <div className="panel-image-block">
        <div className="panel-img-placeholder"><i className="bi bi-person"></i></div>
        <div className="panel-img-actions">
          <button className="btn btn-outline btn-sm">Add Image</button>
          <button className="btn btn-outline btn-sm">Remove Image</button>
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

export default function UsersPage() {
  const [users, setUsers]         = useState(INITIAL_USERS);
  const [search, setSearch]       = useState("");
  const [panelOpen, setPanelOpen] = useState(false);
  const [panelMode, setPanelMode] = useState("edit");
  const [selectedId, setSelectedId] = useState(null);
  const [form, setForm]           = useState(EMPTY_FORM);

  const filtered = useMemo(() =>
    users.filter(u =>
      u.username.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.status.toLowerCase().includes(search.toLowerCase())
    ), [users, search]);

  function updateForm(key, value) {
    setForm(prev => ({ ...prev, [key]: value }));
  }

  function openEdit(user) {
    setSelectedId(user.id);
    setForm({ username: user.username, email: user.email, password: user.password, status: user.status });
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

  function handleUpdate() {
    setUsers(prev => prev.map(u => u.id === selectedId ? { ...u, ...form } : u));
    handleClose();
  }

  function handleDelete() {
    setUsers(prev => prev.filter(u => u.id !== selectedId));
    handleClose();
  }

  function handleAdd() {
    setUsers(prev => [...prev, { id: nextId(prev), ...form, totalSpent: "$0", image: null }]);
    handleClose();
  }

  const editFooter = (
    <>
      <button className="btn btn-delete" onClick={handleDelete}>Delete</button>
      <button className="btn btn-update" onClick={handleUpdate}>Update</button>
    </>
  );

  const addFooter = (
    <>
      <button className="btn btn-cancel" onClick={handleClose}>Cancel</button>
      <button className="btn btn-primary" onClick={handleAdd}>Add User</button>
    </>
  );

  return (
    <>
      <div className="page-area">
        <PageHeader
          title="Users"
          onAdd={openAdd}
          search={search}
          onSearch={setSearch}
          showCategories
        />
        <div className="split-layout">
          <div className="split-table-wrap">
            <div className="table-scroll">
              <table className="dash-table">
                <thead>
                  <tr>
                    <th>User ID</th><th>Username</th><th>Email</th>
                    <th>Password</th><th>Total Spent</th><th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(u => (
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
                  ))}
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
        footer={panelMode === "edit" ? editFooter : addFooter}
      >
        <UserForm form={form} onChange={updateForm} />
      </SlidePanel>
    </>
  );
}

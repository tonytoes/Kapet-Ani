import { useState, useMemo } from "react";
import Badge from "../components/Badge";
import PageHeader from "../components/PageHeader";
import { INITIAL_COMPLAINTS } from "../data";

function ComplaintDetail({ complaint, onBack, onResolve }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1, overflow: "hidden" }}>
      <PageHeader title="Complaint Detail" />

      <div className="complaint-detail-wrap">
        <div className="complaint-detail-topbar">
          <button className="back-btn" onClick={onBack}>
            <i className="bi bi-chevron-left"></i>
          </button>
        </div>

        <div className="complaint-sender">
          <div className="complaint-sender-avatar">
            {(complaint.username || "?")[0].toUpperCase()}
          </div>
          <div style={{ flex: 1 }}>
            <div className="complaint-sender-name">{complaint.username}</div>
            <div className="complaint-sender-email">&lt;{complaint.email}&gt;</div>
          </div>
          <Badge status={complaint.status} />
        </div>

        <div className="complaint-message-body">
          <div className="complaint-message-title">{complaint.title}</div>
          <p className="complaint-message-text">{complaint.message}</p>
        </div>

        <div className="complaint-detail-footer">
          <button
            className={`btn btn-resolve${complaint.status === "Resolved" ? " resolved" : ""}`}
            onClick={onResolve}
          >
            {complaint.status === "Resolved" ? "Resolved ✓" : "Mark as Resolved"}
          </button>
          <button
            className="btn btn-reply"
            onClick={() => alert(`Reply to: ${complaint.email}`)}
          >
            Reply
          </button>
        </div>
      </div>
    </div>
  );
}

function ComplaintsTable({ complaints, search, onSearch, onSelect }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1, overflow: "hidden" }}>
      <PageHeader
        title="Complaints"
        search={search}
        onSearch={onSearch}
      />
      <div className="full-table-wrap">
        <div className="table-scroll">
          <table className="dash-table">
            <thead>
              <tr>
                <th>Complaint ID</th><th>Username</th><th>Email</th>
                <th>Title</th><th>Date</th><th>Status</th>
              </tr>
            </thead>
            <tbody>
              {complaints.map(c => (
                <tr key={c.id} className="clickable" onClick={() => onSelect(c)}>
                  <td className="cell-id">{c.id}</td>
                  <td className="cell-bold">{c.username}</td>
                  <td className="cell-muted">{c.email}</td>
                  <td>{c.title}</td>
                  <td className="cell-muted">{c.date}</td>
                  <td><Badge status={c.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default function ComplaintsPage() {
  const [complaints, setComplaints] = useState(INITIAL_COMPLAINTS);
  const [search, setSearch]         = useState("");
  const [active, setActive]         = useState(null);

  const filtered = useMemo(() =>
    complaints.filter(c =>
      c.username.toLowerCase().includes(search.toLowerCase()) ||
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.status.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase())
    ), [complaints, search]);

  function handleResolve() {
    if (!active || active.status === "Resolved") return;
    const updated = { ...active, status: "Resolved" };
    setActive(updated);
    setComplaints(prev => prev.map(c => c.id === active.id ? updated : c));
  }

  if (active) {
    return (
      <ComplaintDetail
        complaint={active}
        onBack={() => setActive(null)}
        onResolve={handleResolve}
      />
    );
  }

  return (
    <ComplaintsTable
      complaints={filtered}
      search={search}
      onSearch={setSearch}
      onSelect={setActive}
    />
  );
}

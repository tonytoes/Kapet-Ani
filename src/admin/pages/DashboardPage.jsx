import { useState, useEffect } from "react";
import Badge from "../components/Badge";
import "../styles/index.js";

const API = "http://localhost/backend/controllers/dashboardController.php";
const COMPLAINT_ICONS = ["🚚", "⏱️", "⭐", "📦", "🔄"];

// ─── helpers ────────────────────────────────────────────────────────────────

function authHeader() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function apiFetch(action) {
  const res = await fetch(`${API}?action=${action}`, { headers: authHeader() });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

// ─── sub-cards ───────────────────────────────────────────────────────────────

function SalesCard({ d }) {
  return (
    <div className="card card-padded">
      <div className="stat-icon-wrap sales"><i className="bi bi-star-fill"></i></div>
      <div className="stat-label">Total Sales</div>
      <div className="stat-value">{d.totalSales ?? "—"}</div>
      <div className="stat-meta">
        <span>all time</span>
      </div>
      <div className="stat-divider"></div>
      <div className="stat-sub-row">
        <div>
          <div className="sub-lbl">Month</div>
          <div className="sub-val">{d.salesMonth ?? "—"}</div>
        </div>
        <div>
          <div className="sub-lbl">Today</div>
          <div className="sub-val">{d.salesToday ?? "—"}</div>
        </div>
      </div>
    </div>
  );
}

function UsersCard({ d }) {
  return (
    <div className="card card-padded">
      <div className="stat-icon-wrap users"><i className="bi bi-people-fill"></i></div>
      <div className="stat-label">Total Users</div>
      <div className="stat-value">{d.totalUsers ?? "—"}</div>
      <div className="stat-meta">Registered accounts</div>
      <div className="stat-divider"></div>
      <div className="stat-sub-row">
        <div>
          <div className="sub-lbl">
            <i className="bi bi-person-plus-fill" style={{ color: "#3B82F6" }}></i> New Sign ups
          </div>
          <div className="sub-val">{d.newSignups ?? "—"}</div>
        </div>
      </div>
    </div>
  );
}

function ComplaintsCard({ complaints }) {
  return (
    <div className="card card-padded">
      <div className="stat-icon-wrap complaints"><i className="bi bi-chat-square-dots-fill"></i></div>
      <div className="stat-label">Pending Orders</div>
      <div className="stat-value" style={{ fontSize: "1.35rem", marginBottom: 12 }}>
        {complaints.length} Issue{complaints.length !== 1 ? "s" : ""}
      </div>
      <ul className="complaint-list">
        {complaints.map((c, i) => (
          <li className="complaint-item" key={c.id ?? i}>
            <div className="complaint-thumb">{COMPLAINT_ICONS[i] || "📋"}</div>
            <div className="complaint-info">{c.name}</div>
            <Badge status={c.status} />
          </li>
        ))}
      </ul>
    </div>
  );
}

function TopSellingCard({ items }) {
  return (
    <div className="card card-padded">
      <div className="section-hd"><i className="bi bi-fire"></i>Top Selling Items</div>
      {items.length === 0 ? (
        <p className="cell-muted" style={{ marginTop: 12 }}>No sales data yet.</p>
      ) : (
        <div className="selling-list">
          {items.map(item => (
            <div key={item.name}>
              <div className="sell-row-label">
                <span className="sell-name">{item.name}</span>
                <span className="sell-pct">{item.pct}%</span>
              </div>
              <div className="sell-track">
                <div className="sell-fill" style={{ width: `${item.pct}%` }}></div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function RecentOrdersCard({ orders }) {
  return (
    <div className="card card-padded">
      <div className="section-hd"><i className="bi bi-clock-history"></i>Recent Orders</div>
      {orders.length === 0 ? (
        <p className="cell-muted" style={{ marginTop: 12 }}>No orders yet.</p>
      ) : (
        <table className="dash-table">
          <thead>
            <tr><th>Order No.</th><th>Buyer</th><th>Date</th><th>Amount</th><th>Status</th></tr>
          </thead>
          <tbody>
            {orders.map((o, i) => (
              <tr key={o.id ?? i}>
                <td className="cell-id">{o.id}</td>
                <td className="cell-bold">{o.buyer}</td>
                <td className="cell-muted">{o.date}</td>
                <td className="cell-amount">{o.amount}</td>
                <td><Badge status={o.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

function LowStockCard({ items }) {
  return (
    <div className="card card-padded">
      <div className="section-hd"><i className="bi bi-exclamation-triangle-fill"></i>Low Stock Items</div>
      {items.length === 0 ? (
        <p className="cell-muted" style={{ marginTop: 12 }}>All products are well stocked.</p>
      ) : (
        <table className="dash-table">
          <thead>
            <tr><th>Product No.</th><th>Name</th><th>Remaining</th><th>Status</th></tr>
          </thead>
          <tbody>
            {items.map(s => (
              <tr key={s.no}>
                <td className="cell-id">{s.no}</td>
                <td className="cell-bold">{s.name}</td>
                <td className={s.remaining === 0 ? "stock-low" : "stock-ok"}>{s.remaining}</td>
                <td><Badge status={s.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

// ─── skeleton loader ─────────────────────────────────────────────────────────

function Skeleton() {
  return (
    <div className="page-body" style={{ opacity: 0.5 }}>
      <div className="dash-row">
        {[1, 2, 3].map(i => (
          <div key={i} className="card card-padded" style={{ minHeight: 160 }}>
            <div style={{ background: "var(--border, #e5e7eb)", borderRadius: 8, height: 20, width: "60%", marginBottom: 12 }} />
            <div style={{ background: "var(--border, #e5e7eb)", borderRadius: 8, height: 36, width: "40%" }} />
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── main component ───────────────────────────────────────────────────────────

export default function DashboardPage() {
  const [stats,    setStats]    = useState(null);
  const [orders,   setOrders]   = useState([]);
  const [stock,    setStock]    = useState([]);
  const [selling,  setSelling]  = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const [s, o, st, sel] = await Promise.all([
          apiFetch("stats"),
          apiFetch("orders"),
          apiFetch("stock"),
          apiFetch("selling"),
        ]);

        if (cancelled) return;

        if (s.success)   setStats(s);
        if (o.success)   setOrders(o.orders);
        if (st.success)  setStock(st.items);
        if (sel.success) setSelling(sel.items);
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, []);

  if (loading) return <Skeleton />;

  if (error) {
    return (
      <div className="page-body">
        <div className="card card-padded" style={{ color: "#ef4444" }}>
          <i className="bi bi-exclamation-circle-fill"></i> Failed to load dashboard: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="page-body">
      <div className="dash-row">
        <SalesCard d={stats ?? {}} />
        <UsersCard d={stats ?? {}} />
        <ComplaintsCard complaints={stats?.complaints ?? []} />
      </div>

      <div className="dash-row-2">
        <TopSellingCard items={selling} />
        <RecentOrdersCard orders={orders} />
      </div>

      <LowStockCard items={stock} />
    </div>
  );
}

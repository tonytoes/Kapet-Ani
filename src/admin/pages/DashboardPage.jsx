/**
 * src/admin/pages/DashboardPage.jsx
 * Cache keys: "dashboard/stats", "dashboard/orders", "dashboard/stock", "dashboard/selling"
 * All busted together via prefix: cache.invalidate("dashboard/")
 *
 * The dashboard auto-refreshes when UsersPage fires the "userUpdated" event
 * (same as before), but only the stats portion is re-fetched.
 */

import { useState, useEffect } from "react";
import Badge      from "../components/Badge";
import "../styles/index.js";
import { LINK_PATH } from "../data/LinkPath.jsx";
import { useCache }  from "../data/CacheContext";   // ← NEW

const API = `${LINK_PATH}dashboardController.php`;

function authHeader() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function apiFetch(action) {
  const res = await fetch(`${API}?action=${action}`, { headers: authHeader() });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

// ─── sub-cards (unchanged) ────────────────────────────────────────────────────

function SalesCard({ d }) {
  return (
    <div className="card card-padded">
      <div className="stat-icon-wrap sales"><i className="bi bi-star-fill"></i></div>
      <div className="stat-label">Total Sales</div>
      <div className="stat-value">{d.totalSales ?? "—"}</div>
      <div className="stat-meta"><span>all time</span></div>
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
        {complaints.length} Order{complaints.length !== 1 ? "s" : ""}
      </div>
      <ul className="complaint-list">
        {complaints.map((c, i) => (
          <li className="complaint-item" key={c.id ?? i}>
            <div className="complaint-thumb">{"📦"}</div>
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
                <td className="cell-amount">{s.remaining}</td>
                <td><Badge status={s.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

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

const KEYS = {
  stats:   "dashboard/stats",
  orders:  "dashboard/orders",
  stock:   "dashboard/stock",
  selling: "dashboard/selling",
};

export default function DashboardPage() {
  const cache = useCache();   // ← NEW

  // Initialise from cache if available
  const [stats,   setStats]   = useState(() => cache.get(KEYS.stats)   ?? null);
  const [orders,  setOrders]  = useState(() => cache.get(KEYS.orders)  ?? []);
  const [stock,   setStock]   = useState(() => cache.get(KEYS.stock)   ?? []);
  const [selling, setSelling] = useState(() => cache.get(KEYS.selling) ?? []);
  const [loading, setLoading] = useState(() => cache.get(KEYS.stats)   === null);
  const [error,   setError]   = useState(null);

  async function load(force = false) {
    // All four sub-caches exist → skip fetch
    if (
      !force &&
      cache.get(KEYS.stats)   !== null &&
      cache.get(KEYS.orders)  !== null &&
      cache.get(KEYS.stock)   !== null &&
      cache.get(KEYS.selling) !== null
    ) {
      setStats(cache.get(KEYS.stats));
      setOrders(cache.get(KEYS.orders));
      setStock(cache.get(KEYS.stock));
      setSelling(cache.get(KEYS.selling));
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const [s, o, st, sel] = await Promise.all([
        apiFetch("stats"),
        apiFetch("orders"),
        apiFetch("stock"),
        apiFetch("selling"),
      ]);

      if (s.success)   { setStats(s);           cache.set(KEYS.stats,   s);           }
      if (o.success)   { setOrders(o.orders);   cache.set(KEYS.orders,  o.orders);   }
      if (st.success)  { setStock(st.items);    cache.set(KEYS.stock,   st.items);   }
      if (sel.success) { setSelling(sel.items); cache.set(KEYS.selling, sel.items); }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();

    // Re-fetch stats when UsersPage signals a user change
    function onUserUpdated() {
      cache.invalidate("dashboard/");   // bust all dashboard keys
      load(true);
    }
    window.addEventListener("userUpdated", onUserUpdated);
    return () => window.removeEventListener("userUpdated", onUserUpdated);
  }, []);   // eslint-disable-line react-hooks/exhaustive-deps

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
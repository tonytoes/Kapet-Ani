/**
 * src/admin/pages/DashboardPage.jsx
 *
 * Enhanced dashboard with:
 *  - KPI stat cards (sales, orders, users, products)
 *  - 7-day sales trend line chart (canvas)
 *  - Order status donut chart (canvas)
 *  - Category revenue donut chart (canvas)
 *  - Top selling bar list
 *  - Recent orders table
 *  - Low stock table
 *
 * Cache keys: "dashboard/stats" | "dashboard/orders" | "dashboard/stock"
 *             "dashboard/selling" | "dashboard/trend" | "dashboard/status"
 *             "dashboard/category"
 */

import { useState, useEffect, useRef, useCallback } from "react";
import Badge        from "../components/Badge";
import { LINK_PATH } from "../data/LinkPath.jsx";
import { useCache }   from "../data/CacheContext";

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

const KEYS = {
  stats:    "dashboard/stats",
  orders:   "dashboard/orders",
  stock:    "dashboard/stock",
  selling:  "dashboard/selling",
  trend:    "dashboard/trend",
  status:   "dashboard/status",
  category: "dashboard/category",
};

// ─── CSS ──────────────────────────────────────────────────────────────────────

const DB_STYLES = `
  .db-wrap { padding: 22px 26px 40px; display: flex; flex-direction: column; gap: 20px; flex: 1; }

  /* KPI row */
  .db-kpi-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
  @media (max-width: 1100px) { .db-kpi-row { grid-template-columns: repeat(2, 1fr); } }

  .db-kpi { background: var(--bg-card); border-radius: 16px; box-shadow: var(--shadow-card); padding: 20px 22px; display: flex; flex-direction: column; gap: 4px; position: relative; overflow: hidden; transition: transform 0.18s, box-shadow 0.18s; }
  .db-kpi:hover { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(0,0,0,0.10); }
  .db-kpi-accent { position: absolute; top: 0; left: 0; right: 0; height: 3px; border-radius: 16px 16px 0 0; }
  .db-kpi-icon { width: 40px; height: 40px; border-radius: 11px; display: flex; align-items: center; justify-content: center; font-size: 1.05rem; margin-bottom: 10px; }
  .db-kpi-label { font-size: 0.72rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.07em; color: var(--text-muted); }
  .db-kpi-value { font-size: 1.7rem; font-weight: 800; color: var(--text-primary); letter-spacing: -0.02em; line-height: 1.1; margin: 2px 0; }
  .db-kpi-sub { font-size: 0.75rem; color: var(--text-muted); display: flex; align-items: center; gap: 5px; margin-top: 2px; }
  .db-kpi-badge-up   { background: #DCFCE7; color: #16A34A; padding: 2px 7px; border-radius: 20px; font-size: 0.68rem; font-weight: 700; }
  .db-kpi-badge-down { background: #FEE2E2; color: #DC2626; padding: 2px 7px; border-radius: 20px; font-size: 0.68rem; font-weight: 700; }
  .db-kpi-badge-neu  { background: #F3F4F6; color: var(--text-secondary); padding: 2px 7px; border-radius: 20px; font-size: 0.68rem; font-weight: 700; }

  /* Main chart row */
  .db-mid-row { display: grid; grid-template-columns: 2fr 1fr; gap: 16px; align-items: start; }
  @media (max-width: 1000px) { .db-mid-row { grid-template-columns: 1fr; } }

  /* Donut + top selling row */
  .db-bot-row { display: grid; grid-template-columns: 1fr 1fr 1.5fr; gap: 16px; align-items: start; }
  @media (max-width: 1100px) { .db-bot-row { grid-template-columns: 1fr 1fr; } }
  @media (max-width: 760px)  { .db-bot-row { grid-template-columns: 1fr; } }

  /* Card shell */
  .db-card { background: var(--bg-card); border-radius: 16px; box-shadow: var(--shadow-card); padding: 22px 24px; }
  .db-card-title { font-size: 0.88rem; font-weight: 700; color: var(--text-primary); display: flex; align-items: center; gap: 8px; margin-bottom: 18px; }
  .db-card-title i { color: var(--brand-mid); font-size: 0.95rem; }
  .db-card-title-sub { font-size: 0.72rem; font-weight: 400; color: var(--text-muted); margin-left: auto; }

  /* Line chart */
  .db-chart-wrap { position: relative; width: 100%; }
  .db-chart-tabs { display: flex; gap: 6px; margin-bottom: 14px; }
  .db-chart-tab { padding: 5px 14px; border-radius: 20px; font-size: 0.75rem; font-weight: 600; cursor: pointer; border: 1.5px solid var(--border-light); background: transparent; color: var(--text-muted); transition: all 0.15s; font-family: var(--font-body); }
  .db-chart-tab.active { background: var(--brand-mid); color: #fff; border-color: var(--brand-mid); }

  /* Donut chart */
  .db-donut-wrap { display: flex; flex-direction: column; align-items: center; gap: 12px; }
  .db-donut-canvas { max-width: 180px; max-height: 180px; }
  .db-legend { width: 100%; display: flex; flex-direction: column; gap: 7px; margin-top: 4px; }
  .db-legend-item { display: flex; align-items: center; gap: 8px; font-size: 0.78rem; }
  .db-legend-dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }
  .db-legend-label { color: var(--text-secondary); flex: 1; }
  .db-legend-val { font-weight: 700; color: var(--text-primary); }

  /* Top selling */
  .db-sell-item { margin-bottom: 14px; }
  .db-sell-header { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 5px; }
  .db-sell-name { font-size: 0.82rem; font-weight: 600; color: var(--text-primary); }
  .db-sell-meta { font-size: 0.72rem; color: var(--text-muted); }
  .db-sell-track { height: 8px; background: #F3F4F6; border-radius: 99px; overflow: hidden; }
  .db-sell-fill { height: 100%; border-radius: 99px; background: var(--brand-progress); transition: width 1s cubic-bezier(0.4,0,0.2,1); }



  .db-sell-fill {
  height: 100%;
  border-radius: 99px;
  background: var(--brand-progress);
  transition: width 1s cubic-bezier(0.4,0,0.2,1);

  position: relative;
  overflow: visible;

  /* 🔥 base ember glow */
  box-shadow:
    0 0 8px rgba(255, 120, 0, 0.25),
    0 0 18px rgba(255, 90, 0, 0.15);

  animation: emberPulse 2.4s ease-in-out infinite;
}



.db-sell-fill::after {
  content: "";
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);

  width: 14px;
  height: 14px;
  border-radius: 50%;

  animation: matchFlicker 1.6s infinite ease-in-out;
}


@keyframes emberPulse {
  0% {
    box-shadow:
      0 0 6px rgba(255, 110, 0, 0.18),
      0 0 14px rgba(255, 80, 0, 0.12);
    filter: brightness(1);
  }

  50% {
    box-shadow:
      0 0 12px rgba(255, 140, 0, 0.4),
      0 0 26px rgba(255, 90, 0, 0.2);
    filter: brightness(1.1);
  }

  100% {
    box-shadow:
      0 0 6px rgba(255, 110, 0, 0.18),
      0 0 14px rgba(255, 80, 0, 0.12);
    filter: brightness(1);
  }
}

@keyframes matchFlicker {
  0%   { opacity: 1; transform: translateY(-50%) scale(1); }
  50%  { opacity: 0.85; transform: translateY(-50%) scale(1.15); }
  100% { opacity: 1; transform: translateY(-50%) scale(1); }
}






  
  /* Tables */
  .db-table { width: 100%; border-collapse: collapse; font-size: 0.82rem; }
  .db-table th { padding: 9px 12px; text-align: left; font-size: 0.7rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-muted); border-bottom: 1px solid var(--border-light); white-space: nowrap; }
  .db-table td { padding: 11px 12px; border-bottom: 1px solid #F9FAFB; vertical-align: middle; }
  .db-table tr:last-child td { border-bottom: none; }
  .db-table tbody tr { transition: background 0.1s; }
  .db-table tbody tr:hover { background: #FAFAFA; }

  /* Skeleton */
  @keyframes shimmer { 0%{background-position:-400px 0} 100%{background-position:400px 0} }
  .db-skel { background: linear-gradient(90deg,#F3F4F6 25%,#E5E7EB 50%,#F3F4F6 75%); background-size: 800px 100%; animation: shimmer 1.4s infinite; border-radius: 8px; }

  /* Summary pills in pending */
  .db-pending-item { display: flex; align-items: center; gap: 10px; padding: 9px 0; border-bottom: 1px solid #F9FAFB; }
  .db-pending-item:last-child { border-bottom: none; }
  .db-pending-icon { width: 34px; height: 34px; border-radius: 9px; background: #FFF7ED; display: flex; align-items: center; justify-content: center; font-size: 0.9rem; flex-shrink: 0; }
  .db-pending-name { flex: 1; font-size: 0.82rem; font-weight: 500; color: var(--text-primary); }

  /* Empty state */
  .db-empty { text-align: center; padding: 30px 0; color: var(--text-muted); font-size: 0.82rem; }
  .db-empty i { font-size: 1.6rem; display: block; margin-bottom: 8px; }

  /* Stock qty pill */
  .db-qty-pill { display: inline-block; padding: 2px 10px; border-radius: 20px; font-size: 0.72rem; font-weight: 700; }
  .db-qty-zero { background: #FEE2E2; color: #DC2626; }
  .db-qty-low  { background: #FFF7ED; color: #C2410C; }
`;

// ─── Pure canvas line chart ───────────────────────────────────────────────────

function LineChart({ data, metric }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!data?.length) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx    = canvas.getContext("2d");
    const dpr    = window.devicePixelRatio || 1;
    const W      = canvas.offsetWidth;
    const H      = canvas.offsetHeight;
    canvas.width  = W * dpr;
    canvas.height = H * dpr;
    ctx.scale(dpr, dpr);

    const vals   = data.map(d => d[metric]);
    const labels = data.map(d => d.label);
    const maxVal = Math.max(...vals, 1);
    const pad    = { top: 16, right: 16, bottom: 30, left: 52 };
    const cW     = W - pad.left - pad.right;
    const cH     = H - pad.top  - pad.bottom;

    ctx.clearRect(0, 0, W, H);

    // Grid lines
    ctx.strokeStyle = "#F3F4F6";
    ctx.lineWidth   = 1;
    for (let i = 0; i <= 4; i++) {
      const y = pad.top + (cH / 4) * i;
      ctx.beginPath();
      ctx.moveTo(pad.left, y);
      ctx.lineTo(W - pad.right, y);
      ctx.stroke();

      const label = Math.round(maxVal - (maxVal / 4) * i);
      ctx.fillStyle   = "#9CA3AF";
      ctx.font        = "10px DM Sans, sans-serif";
      ctx.textAlign   = "right";
      ctx.fillText(
        metric === "revenue" ? "₱" + (label >= 1000 ? (label / 1000).toFixed(1) + "k" : label) : label,
        pad.left - 6,
        y + 4
      );
    }

    const pts = vals.map((v, i) => ({
      x: pad.left + (cW / (vals.length - 1 || 1)) * i,
      y: pad.top  + cH - (v / maxVal) * cH,
    }));

    // Gradient fill
    const grad = ctx.createLinearGradient(0, pad.top, 0, H - pad.bottom);
    grad.addColorStop(0,   "rgba(201,135,58,0.22)");
    grad.addColorStop(1,   "rgba(201,135,58,0)");
    ctx.beginPath();
    ctx.moveTo(pts[0].x, H - pad.bottom);
    pts.forEach(p => ctx.lineTo(p.x, p.y));
    ctx.lineTo(pts[pts.length - 1].x, H - pad.bottom);
    ctx.closePath();
    ctx.fillStyle = grad;
    ctx.fill();

    // Line
    ctx.beginPath();
    ctx.strokeStyle = "#C9873A";
    ctx.lineWidth   = 2.5;
    ctx.lineJoin    = "round";
    pts.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
    ctx.stroke();

    // Dots
    pts.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
      ctx.fillStyle   = "#fff";
      ctx.strokeStyle = "#C9873A";
      ctx.lineWidth   = 2.5;
      ctx.fill();
      ctx.stroke();
    });

    // X labels
    labels.forEach((lbl, i) => {
      ctx.fillStyle = "#9CA3AF";
      ctx.font      = "10px DM Sans, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(lbl, pts[i].x, H - pad.bottom + 16);
    });
  }, [data, metric]);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: "100%", height: 200, display: "block" }}
    />
  );
}

// ─── Pure canvas donut chart ──────────────────────────────────────────────────

function DonutChart({ data, label }) {
  const canvasRef = useRef(null);
  const SIZE      = 180;

  useEffect(() => {
    if (!data?.length) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx  = canvas.getContext("2d");
    const dpr  = window.devicePixelRatio || 1;
    canvas.width  = SIZE * dpr;
    canvas.height = SIZE * dpr;
    ctx.scale(dpr, dpr);

    const total = data.reduce((s, d) => s + d.value, 0) || 1;
    const cx    = SIZE / 2;
    const cy    = SIZE / 2;
    const r     = SIZE / 2 - 18;
    const inner = r * 0.58;
    let   start = -Math.PI / 2;

    ctx.clearRect(0, 0, SIZE, SIZE);

    data.forEach(seg => {
      const angle = (seg.value / total) * 2 * Math.PI;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, r, start, start + angle);
      ctx.closePath();
      ctx.fillStyle = seg.color;
      ctx.fill();
      start += angle;
    });

    // Donut hole
    ctx.beginPath();
    ctx.arc(cx, cy, inner, 0, Math.PI * 2);
    ctx.fillStyle = "#fff";
    ctx.fill();

    // Center label
    ctx.fillStyle = "#1A1A2E";
    ctx.font      = `700 18px DM Sans, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(total, cx, cy - 7);
    ctx.font      = `400 10px DM Sans, sans-serif`;
    ctx.fillStyle = "#9CA3AF";
    ctx.fillText(label, cx, cy + 10);
  }, [data, label]);

  return (
    <canvas
      ref={canvasRef}
      className="db-donut-canvas"
      style={{ width: SIZE, height: SIZE }}
    />
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function Skeleton() {
  return (
    <div className="db-wrap">
      <div className="db-kpi-row">
        {[1,2,3,4].map(i => (
          <div key={i} className="db-kpi">
            <div className="db-skel" style={{ width: 40, height: 40, borderRadius: 11, marginBottom: 10 }} />
            <div className="db-skel" style={{ width: "50%", height: 11, marginBottom: 6 }} />
            <div className="db-skel" style={{ width: "75%", height: 28, marginBottom: 6 }} />
            <div className="db-skel" style={{ width: "60%", height: 10 }} />
          </div>
        ))}
      </div>
      <div className="db-mid-row">
        <div className="db-card" style={{ height: 280 }}><div className="db-skel" style={{ width: "100%", height: "100%", borderRadius: 12 }} /></div>
        <div className="db-card" style={{ height: 280 }}><div className="db-skel" style={{ width: "100%", height: "100%", borderRadius: 12 }} /></div>
      </div>
    </div>
  );
}

// ─── KPI Card ─────────────────────────────────────────────────────────────────

function KpiCard({ icon, label, value, sub, badge, badgeType = "neu", accentColor }) {
  return (
    <div className="db-kpi">
      <div className="db-kpi-accent" style={{ background: accentColor }} />
      <div className="db-kpi-icon" style={{ background: accentColor + "22", color: accentColor }}>
        <i className={`bi ${icon}`} />
      </div>
      <div className="db-kpi-label">{label}</div>
      <div className="db-kpi-value">{value ?? "—"}</div>
      <div className="db-kpi-sub">
        {badge != null && (
          <span className={`db-kpi-badge-${badgeType}`}>
            {badgeType === "up" ? "▲" : badgeType === "down" ? "▼" : ""} {badge}
          </span>
        )}
        {sub}
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function DashboardPage() {
  const cache = useCache();

  const [stats,    setStats]    = useState(() => cache.get(KEYS.stats)    ?? null);
  const [orders,   setOrders]   = useState(() => cache.get(KEYS.orders)   ?? []);
  const [stock,    setStock]    = useState(() => cache.get(KEYS.stock)    ?? []);
  const [selling,  setSelling]  = useState(() => cache.get(KEYS.selling)  ?? []);
  const [trend,    setTrend]    = useState(() => cache.get(KEYS.trend)    ?? []);
  const [statuses, setStatuses] = useState(() => cache.get(KEYS.status)   ?? []);
  const [catSales, setCatSales] = useState(() => cache.get(KEYS.category) ?? []);
  const [loading,  setLoading]  = useState(() => cache.get(KEYS.stats)    === null);
  const [error,    setError]    = useState(null);
  const [trendTab, setTrendTab] = useState("revenue");

  const load = useCallback(async (force = false) => {
    const allCached = Object.values(KEYS).every(k => cache.get(k) !== null);
    if (!force && allCached) {
      setStats(cache.get(KEYS.stats));
      setOrders(cache.get(KEYS.orders));
      setStock(cache.get(KEYS.stock));
      setSelling(cache.get(KEYS.selling));
      setTrend(cache.get(KEYS.trend));
      setStatuses(cache.get(KEYS.status));
      setCatSales(cache.get(KEYS.category));
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const [s, o, st, sel, tr, sts, cat] = await Promise.all([
        apiFetch("stats"),
        apiFetch("orders"),
        apiFetch("stock"),
        apiFetch("selling"),
        apiFetch("sales_trend"),
        apiFetch("order_status"),
        apiFetch("category_sales"),
      ]);
      if (s.success)   { setStats(s);              cache.set(KEYS.stats,    s);              }
      if (o.success)   { setOrders(o.orders);       cache.set(KEYS.orders,   o.orders);       }
      if (st.success)  { setStock(st.items);        cache.set(KEYS.stock,    st.items);       }
      if (sel.success) { setSelling(sel.items);     cache.set(KEYS.selling,  sel.items);      }
      if (tr.success)  { setTrend(tr.trend);        cache.set(KEYS.trend,    tr.trend);       }
      if (sts.success) { setStatuses(sts.breakdown);cache.set(KEYS.status,   sts.breakdown);  }
      if (cat.success) { setCatSales(cat.categories);cache.set(KEYS.category,cat.categories); }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [cache]);

  useEffect(() => {
    load();
    function onUserUpdated() {
      Object.values(KEYS).forEach(k => cache.invalidate(k));
      load(true);
    }
    window.addEventListener("userUpdated", onUserUpdated);
    return () => window.removeEventListener("userUpdated", onUserUpdated);
  }, [load]);

  if (loading) return <Skeleton />;

  if (error) return (
    <div className="db-wrap">
      <div className="db-card" style={{ color: "#ef4444" }}>
        <i className="bi bi-exclamation-circle-fill" /> Failed to load dashboard: {error}
      </div>
    </div>
  );

  const growthType = stats?.growthPct > 0 ? "up" : stats?.growthPct < 0 ? "down" : "neu";

  return (
    <>
      <style>{DB_STYLES}</style>
      <div className="db-wrap">

        {/* ── KPI Row ─────────────────────────────────────────────────────── */}
        <div className="db-kpi-row">
          <KpiCard
            icon="bi-currency-dollar"
            label="Total Revenue"
            value={stats?.totalSales}
            sub="all-time confirmed orders"
            badge={stats?.growthPct != null ? `${Math.abs(stats.growthPct)}% vs last month` : null}
            badgeType={growthType}
            accentColor="#C9873A"
          />
          <KpiCard
            icon="bi-bag-check-fill"
            label="Total Orders"
            value={stats?.totalOrders?.toLocaleString()}
            sub={`${stats?.ordersToday ?? 0} today · ${stats?.pendingOrders ?? 0} pending`}
            badge={null}
            accentColor="#3B82F6"
          />
          <KpiCard
            icon="bi-people-fill"
            label="Registered Users"
            value={stats?.totalUsers?.toLocaleString()}
            sub="registered accounts"
            badge={`+${stats?.newSignups ?? 0} this week`}
            badgeType="up"
            accentColor="#8B5CF6"
          />
          <KpiCard
            icon="bi-box-seam-fill"
            label="Total Products"
            value={stats?.totalProducts?.toLocaleString()}
            sub="in inventory"
            badge={stats?.outOfStock > 0 ? `${stats.outOfStock} out of stock` : "all in stock"}
            badgeType={stats?.outOfStock > 0 ? "down" : "up"}
            accentColor="#22C55E"
          />
        </div>

        {/* ── Mid Row: Trend chart + Pending orders ───────────────────────── */}
        <div className="db-mid-row">

          {/* Sales / Orders trend */}
          <div className="db-card">
            <div className="db-card-title">
              <i className="bi bi-graph-up-arrow" />
              7-Day Performance
              <span className="db-card-title-sub">last 7 days</span>
            </div>
            <div className="db-chart-tabs">
              {["revenue", "orders"].map(t => (
                <button
                  key={t}
                  className={`db-chart-tab${trendTab === t ? " active" : ""}`}
                  onClick={() => setTrendTab(t)}
                >
                  {t === "revenue" ? "Revenue" : "Orders"}
                </button>
              ))}
            </div>
            <div className="db-chart-wrap">
              {trend.length > 0
                ? <LineChart data={trend} metric={trendTab} />
                : <div className="db-empty"><i className="bi bi-bar-chart" />No trend data yet.</div>
              }
            </div>
          </div>

          {/* Pending orders */}
          <div className="db-card">
            <div className="db-card-title">
              <i className="bi bi-hourglass-split" />
              Pending Orders
              <span className="db-card-title-sub">{stats?.pendingOrders ?? 0} total</span>
            </div>
            {stats?.complaints?.length > 0 ? (
              <>
                {stats.complaints.map((c, i) => (
                  <div className="db-pending-item" key={c.id ?? i}>
                    <div className="db-pending-icon">📦</div>
                    <span className="db-pending-name">{c.name}</span>
                    <Badge status={c.status} />
                  </div>
                ))}
                {stats.pendingOrders > 3 && (
                  <div style={{ marginTop: 12, fontSize: "0.75rem", color: "var(--text-muted)", textAlign: "center" }}>
                    +{stats.pendingOrders - 3} more pending orders
                  </div>
                )}
              </>
            ) : (
              <div className="db-empty">
                <i className="bi bi-check-circle" style={{ color: "#22C55E" }} />
                No pending orders
              </div>
            )}

            {/* Today at a glance */}
            <div style={{
              marginTop: 18, paddingTop: 16, borderTop: "1px solid var(--border-light)",
              display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12
            }}>
              {[
                { label: "Today's Sales", value: stats?.salesToday, icon: "bi-sun", color: "#C9873A" },
                { label: "This Month",    value: stats?.salesMonth,  icon: "bi-calendar3", color: "#3B82F6" },
              ].map(s => (
                <div key={s.label} style={{
                  background: "#FAFAFA", borderRadius: 10, padding: "10px 12px",
                  border: "1px solid var(--border-light)"
                }}>
                  <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginBottom: 4, display: "flex", alignItems: "center", gap: 4 }}>
                    <i className={`bi ${s.icon}`} style={{ color: s.color }} />{s.label}
                  </div>
                  <div style={{ fontWeight: 800, fontSize: "0.95rem", color: "var(--text-primary)" }}>{s.value ?? "—"}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Bottom Row: Order status donut + Category donut + Top selling ── */}
        <div className="db-bot-row">

          {/* Order status donut */}
          <div className="db-card">
            <div className="db-card-title">
              <i className="bi bi-pie-chart-fill" />
              Order Status
            </div>
            {statuses.length > 0 ? (
              <div className="db-donut-wrap">
                <DonutChart data={statuses} label="orders" />
                <div className="db-legend">
                  {statuses.map(s => (
                    <div className="db-legend-item" key={s.label}>
                      <div className="db-legend-dot" style={{ background: s.color }} />
                      <span className="db-legend-label">{s.label}</span>
                      <span className="db-legend-val">{s.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="db-empty"><i className="bi bi-pie-chart" />No order data.</div>
            )}
          </div>

          {/* Category revenue donut */}
          <div className="db-card">
            <div className="db-card-title">
              <i className="bi bi-tags-fill" />
              Revenue by Category
            </div>
            {catSales.length > 0 ? (
              <div className="db-donut-wrap">
                <DonutChart
                  data={catSales.map(c => ({ ...c, value: Math.round(c.value) }))}
                  label="revenue"
                />
                <div className="db-legend">
                  {catSales.map(s => (
                    <div className="db-legend-item" key={s.label}>
                      <div className="db-legend-dot" style={{ background: s.color }} />
                      <span className="db-legend-label">{s.label}</span>
                      <span className="db-legend-val" style={{ fontSize: "0.72rem" }}>{s.display}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="db-empty"><i className="bi bi-tags" />No category data.</div>
            )}
          </div>

          {/* Top selling */}
          <div className="db-card">
            <div className="db-card-title">
              <i className="bi bi-fire" />
              Top Selling Products
              <span className="db-card-title-sub">by units sold</span>
            </div>
            {selling.length > 0 ? selling.map((item, i) => (
              <div className="db-sell-item" key={item.name}>
                <div className="db-sell-header">
                  <span className="db-sell-name">
                    <span style={{
                      display: "inline-flex", alignItems: "center", justifyContent: "center",
                      width: 18, height: 18, borderRadius: "50%",
                      background: i === 0 ? "#FFF5E6" : "#F3F4F6",
                      color: i === 0 ? "#C9873A" : "#9CA3AF",
                      fontSize: "0.65rem", fontWeight: 800, marginRight: 6
                    }}>{i + 1}</span>
                    {item.name}
                  </span>
                  <span className="db-sell-meta">{item.total_sold} sold · {item.revenue}</span>
                </div>
                <div className="db-sell-track">
                  <div className="db-sell-fill" style={{ width: `${item.pct}%` }} />
                </div>
              </div>
            )) : (
              <div className="db-empty"><i className="bi bi-fire" />No sales data yet.</div>
            )}
          </div>
        </div>

        {/* ── Recent Orders + Low Stock row ───────────────────────────────── */}
        <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: 16 }}>

          {/* Recent orders */}
          <div className="db-card" style={{ padding: 0, overflow: "hidden" }}>
            <div style={{ padding: "18px 22px 14px" }}>
              <div className="db-card-title" style={{ marginBottom: 0 }}>
                <i className="bi bi-clock-history" />
                Recent Orders
                <span className="db-card-title-sub">latest 7</span>
              </div>
            </div>
            <div style={{ overflowX: "auto" }}>
              {orders.length > 0 ? (
                <table className="db-table">
                  <thead>
                    <tr>
                      <th>Order No.</th>
                      <th>Buyer</th>
                      <th>Date</th>
                      <th>Amount</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((o, i) => (
                      <tr key={o.id ?? i}>
                        <td style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 500 }}>{o.id}</td>
                        <td style={{ fontWeight: 600 }}>{o.buyer}</td>
                        <td style={{ color: "var(--text-secondary)" }}>{o.date}</td>
                        <td style={{ fontWeight: 700 }}>{o.amount}</td>
                        <td><Badge status={o.status} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="db-empty" style={{ padding: "24px 0" }}>
                  <i className="bi bi-bag" />No orders yet.
                </div>
              )}
            </div>
          </div>

          {/* Low stock */}
          <div className="db-card" style={{ padding: 0, overflow: "hidden" }}>
            <div style={{ padding: "18px 22px 14px" }}>
              <div className="db-card-title" style={{ marginBottom: 0 }}>
                <i className="bi bi-exclamation-triangle-fill" style={{ color: "#F97316" }} />
                Low Stock Alert
                <span className="db-card-title-sub">{stock.length} items</span>
              </div>
            </div>
            <div style={{ overflowX: "auto" }}>
              {stock.length > 0 ? (
                <table className="db-table">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Name</th>
                      <th>Qty</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stock.map(s => (
                      <tr key={s.no}>
                        <td style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 500 }}>{s.no}</td>
                        <td style={{ fontWeight: 600 }}>{s.name}</td>
                        <td>
                          <span className={`db-qty-pill ${s.remaining === 0 ? "db-qty-zero" : "db-qty-low"}`}>
                            {s.remaining === 0 ? "Out" : s.remaining}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="db-empty" style={{ padding: "24px 0" }}>
                  <i className="bi bi-check-circle" style={{ color: "#22C55E" }} />
                  All products well stocked.
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </>
  );
}
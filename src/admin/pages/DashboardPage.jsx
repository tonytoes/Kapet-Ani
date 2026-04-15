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
 *  - Order activity heatmap (365-day GitHub-style)
 *
 * Cache keys: "dashboard/stats" | "dashboard/orders" | "dashboard/stock"
 *             "dashboard/selling" | "dashboard/trend" | "dashboard/status"
 *             "dashboard/category" | "dashboard/heatmap"
 */

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
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
  heatmap:  "dashboard/heatmap",
};
const DASHBOARD_REFRESH_MS = 15000;

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

// ─── Order Activity Heatmap ───────────────────────────────────────────────────

const HEATMAP_COLORS = ['#F3F4F6', '#FDE8CC', '#F5B96E', '#C9873A', '#8B5A2B'];

function TxHeatmap({ data }) {
  const [tooltip, setTooltip] = useState(null);

  const { cells, months, total, activeDays, max } = useMemo(() => {
    const today = new Date(); today.setHours(0, 0, 0, 0);
    // Start from the Monday of the week 364 days ago
    const start = new Date(today); start.setDate(start.getDate() - 364);
    const dow = start.getDay(); // 0=Sun
    start.setDate(start.getDate() - (dow === 0 ? 6 : dow - 1)); // rewind to Monday

    const maxVal = Math.max(1, ...Object.values(data));
    const days   = [];
    const cur    = new Date(start);
    while (cur <= today) { days.push(new Date(cur)); cur.setDate(cur.getDate() + 1); }

    // Build month labels keyed by week index (column)
    const monthMap = {};
    let lastMonth = -1;

    days.forEach((d, idx) => {
      const week = Math.floor(idx / 7);
      const month = d.getMonth();

      if (month !== lastMonth) {
        monthMap[week] = d.toLocaleString('default', { month: 'short' });
        lastMonth = month;
      }
    });

    const total      = Object.values(data).reduce((a, b) => a + b, 0);
    const activeDays = Object.keys(data).length;
    return { cells: days, months: monthMap, total, activeDays, max: maxVal };
  }, [data]);

  function getColor(key) {
    const count = data[key] || 0;

    if (count === 0) return HEATMAP_COLORS[0];
    if (count < 2)  return HEATMAP_COLORS[1];
    if (count < 3)  return HEATMAP_COLORS[2];
    if (count < 5)  return HEATMAP_COLORS[3];
    return HEATMAP_COLORS[4]; // 5+ = darkest
  }

  const weeks = Math.ceil(cells.length / 7);

  return (
    <div className="db-card" style={{ userSelect: 'none' }}>
      {/* Header */}
      <div className="db-card-title">
        <i className="bi bi-calendar3" />
        Order Activity
        <span className="db-card-title-sub">last 365 days</span>
      </div>

      {/* Summary row */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: 14,
        fontSize: '0.78rem',
        color: '#6B7280',
      }}>
        <span>
          <strong style={{ color: '#1A1A2E' }}>{total.toLocaleString()}</strong> orders in the past year
        </span>
        <span>
          <strong style={{ color: '#1A1A2E' }}>{activeDays}</strong> active days
        </span>
      </div>

      {/* Month labels row */}
      <div style={{ display: 'flex', paddingLeft: 28, marginBottom: 4, gap: 0, overflow: 'hidden' }}>
        {Array.from({ length: weeks }, (_, i) => (
          <span key={i} style={{ flex: 1, fontSize: 9, color: '#9CA3AF', fontWeight: 600, whiteSpace: 'nowrap' }}>
            {months[i] || ''}
          </span>
        ))}
      </div>

      {/* Grid + day labels */}
      <div style={{ display: 'flex', gap: 6 }}>
        {/* Day-of-week labels */}
          <div style={{
            display: 'grid',
            gridTemplateRows: 'repeat(7, 1fr)',
            paddingBottom: 2,
            width: 28,
            flexShrink: 0,
          }}>
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d, i) => (
            <span key={i} style={{
                fontSize: '0.65rem',
                color: '#9CA3AF',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                height: '100%',
              }}>
              {d}
            </span>
          ))}
        </div>

        {/* Cell grid */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            display: 'grid',
            gridTemplateRows: 'repeat(7, 1fr)',
            gridTemplateColumns: `repeat(${weeks}, 1fr)`,
            gridAutoFlow: 'column',
            gap: 3,
          }}>
            {cells.map((d, i) => {
              const key = d.toLocaleDateString('en-CA');
              const count = data[key] || 0;
              return (
                <div
                  key={i}
                  style={{
                    background:   getColor(key),
                    borderRadius: 3,
                    aspectRatio:  '1',
                    cursor:       'pointer',
                    transition:   'transform .12s, box-shadow .12s',
                    minWidth:     10,
                    minHeight:    10,
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform  = 'scale(1.4)';
                    e.currentTarget.style.boxShadow  = '0 2px 6px rgba(0,0,0,0.18)';
                    e.currentTarget.style.zIndex     = '10';
                    setTooltip({ x: e.clientX, y: e.clientY, date: d, count });
                  }}
                  onMouseMove={e => setTooltip(t => ({ ...t, x: e.clientX, y: e.clientY }))}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = '';
                    e.currentTarget.style.boxShadow = '';
                    e.currentTarget.style.zIndex    = '';
                    setTooltip(null);
                  }}
                />
              );
            })}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 5,
        marginTop: 14,
        justifyContent: 'flex-end',
      }}>
        <span style={{ fontSize: 10, color: '#9CA3AF' }}>Less</span>
        {HEATMAP_COLORS.map(c => (
          <div key={c} style={{ width: 11, height: 11, borderRadius: 2, background: c, border: '1px solid rgba(0,0,0,0.06)' }} />
        ))}
        <span style={{ fontSize: 10, color: '#9CA3AF' }}>More</span>
      </div>

      {/* Fixed tooltip */}
      {tooltip && (
        <div style={{
          position:       'fixed',
          left:           tooltip.x + 14,
          transform: 'translateX(-100%)',
          top:            tooltip.y - 36,
          background:     '#1A1A2E',
          color:          '#fff',
          fontSize:       11,
          fontWeight:     600,
          padding:        '5px 10px',
          borderRadius:   8,
          pointerEvents:  'none',
          whiteSpace:     'nowrap',
          zIndex:         9999,
          boxShadow:      '0 4px 12px rgba(0,0,0,0.22)',
          letterSpacing:  '0.01em',
        }}>
          {tooltip.count
            ? <><span style={{ color: '#f0c27c' }}>{tooltip.count}</span> order{tooltip.count !== 1 ? 's' : ''} · </>
            : 'No orders · '}
          {tooltip.date.toLocaleDateString('en-PH', { month: 'long', day: 'numeric', year: 'numeric' })}
        </div>
      )}
    </div>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function Skeleton() {
  return (
    <div className="db-wrap">
      <div className="db-kpi-row">
        {[1,2,3,4].map(i => (
          <div key={i} className="db-kpi">
            <div className="db-kpi-accent db-kpi-accent-skeleton" />
            <div className="db-skel db-skel-kpi-icon" />
            <div className="db-skel db-skel-kpi-label" />
            <div className="db-skel db-skel-kpi-value" />
            <div className="db-skel db-skel-kpi-sub" />
          </div>
        ))}
      </div>
      <div className="db-mid-row">
        <div className="db-card db-skeleton-card">
          <div className="db-skel db-skel-title" />
          <div className="db-skel db-skel-tab-row" />
          <div className="db-skel db-skel-chart" />
        </div>
        <div className="db-card db-skeleton-card">
          <div className="db-skel db-skel-title" />
          {[1,2,3].map(i => <div key={i} className="db-skel db-skel-line" />)}
          <div className="db-skel db-skel-grid" />
        </div>
      </div>
      <div className="db-bot-row">
        {[1,2,3].map(i => (
          <div key={i} className="db-card db-skeleton-card db-skeleton-bot-card">
            <div className="db-skel db-skel-title" />
            <div className="db-skel db-skel-donut" />
            {[1,2,3].map(k => <div key={k} className="db-skel db-skel-line" />)}
          </div>
        ))}
      </div>
      <div className="db-table-row">
        {[1,2].map(i => (
          <div key={i} className="db-card db-table-card">
            <div className="db-table-head">
              <div className="db-skel db-skel-table-title" />
            </div>
            <div className="db-table-scroll">
              {[1,2,3,4].map(k => <div key={k} className="db-skel db-skel-row" />)}
            </div>
          </div>
        ))}
      </div>
      {/* Heatmap skeleton */}
      <div className="db-card" style={{ padding: '22px 24px' }}>
        <div className="db-skel db-skel-title" style={{ marginBottom: 16 }} />
        <div className="db-skel" style={{ width: '100%', height: 110, borderRadius: 10 }} />
      </div>
    </div>
  );
}

// ─── KPI Card ─────────────────────────────────────────────────────────────────

function KpiCard({ icon, label, value, sub, badge, badgeType = "neu", accentColor, onClick }) {
  return (
    <div
      className={`db-kpi${onClick ? " db-nav-card" : ""}`}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => (e.key === "Enter" || e.key === " ") && onClick() : undefined}
    >
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

export default function DashboardPage({ onNavigate }) {
  const cache = useCache();
  const go = useCallback((target) => {
    if (typeof onNavigate === "function") onNavigate(target);
  }, [onNavigate]);

  const [stats,    setStats]    = useState(() => cache.get(KEYS.stats)    ?? null);
  const [orders,   setOrders]   = useState(() => cache.get(KEYS.orders)   ?? []);
  const [stock,    setStock]    = useState(() => cache.get(KEYS.stock)    ?? []);
  const [selling,  setSelling]  = useState(() => cache.get(KEYS.selling)  ?? []);
  const [trend,    setTrend]    = useState(() => cache.get(KEYS.trend)    ?? []);
  const [statuses, setStatuses] = useState(() => cache.get(KEYS.status)   ?? []);
  const [catSales, setCatSales] = useState(() => cache.get(KEYS.category) ?? []);
  const [heatmap,  setHeatmap]  = useState(() => cache.get(KEYS.heatmap)  ?? {});
  const [loading,  setLoading]  = useState(() => cache.get(KEYS.stats)    === null);
  const [error,    setError]    = useState(null);
  const [trendTab, setTrendTab] = useState("revenue");

  const load = useCallback(async (force = false, silent = false) => {
    const allCached = Object.values(KEYS).every(k => cache.get(k) !== null);
    if (!force && allCached) {
      setStats(cache.get(KEYS.stats));
      setOrders(cache.get(KEYS.orders));
      setStock(cache.get(KEYS.stock));
      setSelling(cache.get(KEYS.selling));
      setTrend(cache.get(KEYS.trend));
      setStatuses(cache.get(KEYS.status));
      setCatSales(cache.get(KEYS.category));
      setHeatmap(cache.get(KEYS.heatmap));
      setLoading(false);
      return;
    }
    if (!silent) setLoading(true);
    try {
      const [s, o, st, sel, tr, sts, cat, hm] = await Promise.all([
        apiFetch("stats"),
        apiFetch("orders"),
        apiFetch("stock"),
        apiFetch("selling"),
        apiFetch("sales_trend"),
        apiFetch("order_status"),
        apiFetch("category_sales"),
        apiFetch("heatmap"),
      ]);
      if (s.success)   { setStats(s);               cache.set(KEYS.stats,    s);               }
      if (o.success)   { setOrders(o.orders);        cache.set(KEYS.orders,   o.orders);        }
      if (st.success)  { setStock(st.items);         cache.set(KEYS.stock,    st.items);        }
      if (sel.success) { setSelling(sel.items);      cache.set(KEYS.selling,  sel.items);       }
      if (tr.success)  { setTrend(tr.trend);         cache.set(KEYS.trend,    tr.trend);        }
      if (sts.success) { setStatuses(sts.breakdown); cache.set(KEYS.status,   sts.breakdown);   }
      if (cat.success) { setCatSales(cat.categories);cache.set(KEYS.category, cat.categories);  }
      if (hm.success)  { setHeatmap(hm.heatmap);    cache.set(KEYS.heatmap,  hm.heatmap);      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [cache]);

  useEffect(() => {
    load(false, false);
    function onUserUpdated() {
      Object.values(KEYS).forEach(k => cache.invalidate(k));
      load(true, true);
    }

    const pollId = window.setInterval(() => {
      if (document.visibilityState === "visible") {
        load(true, true);
      }
    }, DASHBOARD_REFRESH_MS);

    window.addEventListener("userUpdated", onUserUpdated);
    return () => {
      window.clearInterval(pollId);
      window.removeEventListener("userUpdated", onUserUpdated);
    };
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
          onClick={() => go("transactions")}
        />
        <KpiCard
          icon="bi-bag-check-fill"
          label="Total Orders"
          value={stats?.totalOrders?.toLocaleString()}
          sub={`${stats?.ordersToday ?? 0} today · ${stats?.pendingOrders ?? 0} pending`}
          badge={null}
          accentColor="#3B82F6"
          onClick={() => go("transactions")}
        />
        <KpiCard
          icon="bi-people-fill"
          label="Registered Users"
          value={stats?.totalUsers?.toLocaleString()}
          sub="registered accounts"
          badge={`+${stats?.newSignups ?? 0} this week`}
          badgeType="up"
          accentColor="#8B5CF6"
          onClick={() => go("users")}
        />
        <KpiCard
          icon="bi-box-seam-fill"
          label="Total Products"
          value={stats?.totalProducts?.toLocaleString()}
          sub="in inventory"
          badge={stats?.outOfStock > 0 ? `${stats.outOfStock} out of stock` : "all in stock"}
          badgeType={stats?.outOfStock > 0 ? "down" : "up"}
          accentColor="#22C55E"
          onClick={() => go("inventory")}
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
        <div
          className="db-card db-nav-card"
          onClick={() => go("transactions")}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && go("transactions")}
        >
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
                <div className="db-pending-more">
                  +{stats.pendingOrders - 3} more pending orders
                </div>
              )}
            </>
          ) : (
            <div className="db-empty">
              <i className="bi bi-check-circle db-empty-icon-success" />
              No pending orders
            </div>
          )}

          {/* Today at a glance */}
          <div className="db-glance-grid">
            {[
              { label: "Today's Sales", value: stats?.salesToday, icon: "bi-sun",      color: "#C9873A" },
              { label: "This Month",    value: stats?.salesMonth,  icon: "bi-calendar3", color: "#3B82F6" },
            ].map(s => (
              <div key={s.label} className="db-glance-card">
                <div className="db-glance-label">
                  <i className={`bi ${s.icon}`} style={{ color: s.color }} />{s.label}
                </div>
                <div className="db-glance-value">{s.value ?? "—"}</div>
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
                    <span className="db-legend-val db-legend-display">{s.display}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="db-empty"><i className="bi bi-tags" />No category data.</div>
          )}
        </div>

        {/* Top selling */}
        <div
          className="db-card db-nav-card"
          onClick={() => go("inventory")}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && go("inventory")}
        >
          <div className="db-card-title">
            <i className="bi bi-fire" />
            Top Selling Products
            <span className="db-card-title-sub">by units sold</span>
          </div>
          {selling.length > 0 ? selling.map((item, i) => (
            <div className="db-sell-item" key={item.name}>
              <div className="db-sell-header">
                <span className="db-sell-name">
                  <span className={`db-rank-badge${i === 0 ? " is-top" : ""}`}>{i + 1}</span>
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
      <div className="db-table-row">

        {/* Recent orders */}
        <div
          className="db-card db-table-card db-nav-card"
          onClick={() => go("transactions")}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && go("transactions")}
        >
          <div className="db-table-head">
            <div className="db-card-title db-table-title">
              <i className="bi bi-clock-history" />
              Recent Orders
              <span className="db-card-title-sub">latest 7</span>
            </div>
          </div>
          <div className="db-table-scroll">
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
                      <td className="db-cell-id">{o.id}</td>
                      <td className="db-cell-strong">{o.buyer}</td>
                      <td className="db-cell-muted">{o.date}</td>
                      <td className="db-cell-strong">{o.amount}</td>
                      <td><Badge status={o.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="db-empty db-empty-table">
                <i className="bi bi-bag" />No orders yet.
              </div>
            )}
          </div>
        </div>

        {/* Low stock */}
        <div
          className="db-card db-table-card db-nav-card"
          onClick={() => go("inventoryalert")}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && go("inventoryalert")}
        >
          <div className="db-table-head">
            <div className="db-card-title db-table-title">
              <i className="bi bi-exclamation-triangle-fill db-warn-icon" />
              Low Stock Alert
              <span className="db-card-title-sub">{stock.length} items</span>
            </div>
          </div>
          <div className="db-table-scroll">
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
                      <td className="db-cell-id">{s.no}</td>
                      <td className="db-cell-strong">{s.name}</td>
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
              <div className="db-empty db-empty-table">
                <i className="bi bi-check-circle db-empty-icon-success" />
                All products well stocked.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Order Activity Heatmap ───────────────────────────────────────── */}
      <TxHeatmap data={heatmap} />

    </div>
  );
}
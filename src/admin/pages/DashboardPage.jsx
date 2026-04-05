import Badge from "../components/Badge";
import { DASHBOARD_DATA } from "../data";

const COMPLAINT_ICONS = ["🚚", "⏱️", "⭐", "📦", "🔄"];

function SalesCard({ d }) {
  return (
    <div className="card card-padded">
      <div className="stat-icon-wrap sales"><i className="bi bi-star-fill"></i></div>
      <div className="stat-label">Total Sales</div>
      <div className="stat-value">{d.totalSales}</div>
      <div className="stat-meta">
        <span className="up-badge">{d.salesGrowth}</span>
        <span>all time</span>
      </div>
      <div className="stat-divider"></div>
      <div className="stat-sub-row">
        <div>
          <div className="sub-lbl">Month</div>
          <div className="sub-val">{d.salesMonth}</div>
        </div>
        <div>
          <div className="sub-lbl">Today</div>
          <div className="sub-val">{d.salesToday}</div>
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
      <div className="stat-value">{d.totalUsers}</div>
      <div className="stat-meta">Registered accounts</div>
      <div className="stat-divider"></div>
      <div className="stat-sub-row">
        <div>
          <div className="sub-lbl">
            <i className="bi bi-person-plus-fill" style={{ color: "#3B82F6" }}></i> New Sign ups
          </div>
          <div className="sub-val">{d.newSignups}</div>
        </div>
        <div>
          <div className="sub-lbl">
            <i className="bi bi-eye-fill" style={{ color: "var(--brand-mid)" }}></i> Page views
          </div>
          <div className="sub-val">{d.pageViews}</div>
        </div>
      </div>
    </div>
  );
}

function ComplaintsCard({ complaints }) {
  return (
    <div className="card card-padded">
      <div className="stat-icon-wrap complaints"><i className="bi bi-chat-square-dots-fill"></i></div>
      <div className="stat-label">Pending Complaints</div>
      <div className="stat-value" style={{ fontSize: "1.35rem", marginBottom: 12 }}>
        {complaints.length} Issues
      </div>
      <ul className="complaint-list">
        {complaints.map((c, i) => (
          <li className="complaint-item" key={i}>
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
    </div>
  );
}

function RecentOrdersCard({ orders }) {
  return (
    <div className="card card-padded">
      <div className="section-hd"><i className="bi bi-clock-history"></i>Recent Orders</div>
      <table className="dash-table">
        <thead>
          <tr><th>Order No.</th><th>Buyer</th><th>Date</th><th>Amount</th><th>Status</th></tr>
        </thead>
        <tbody>
          {orders.map(o => (
            <tr key={o.id}>
              <td className="cell-id">{o.id}</td>
              <td className="cell-bold">{o.buyer}</td>
              <td className="cell-muted">{o.date}</td>
              <td className="cell-amount">{o.amount}</td>
              <td><Badge status={o.status} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function LowStockCard({ items }) {
  return (
    <div className="card card-padded">
      <div className="section-hd"><i className="bi bi-exclamation-triangle-fill"></i>Low Stock Items</div>
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
    </div>
  );
}

export default function DashboardPage() {
  const d = DASHBOARD_DATA;
  return (
    <div className="page-body">
      <div className="dash-row">
        <SalesCard d={d} />
        <UsersCard d={d} />
        <ComplaintsCard complaints={d.complaints} />
      </div>

      <div className="dash-row-2">
        <TopSellingCard items={d.topSelling} />
        <RecentOrdersCard orders={d.recentOrders} />
      </div>

      <LowStockCard items={d.lowStock} />
    </div>
  );
}

/**
 * src/admin/App.jsx  — wrap everything in <CacheProvider>
 * Only this file changes from your original App.jsx.
 */

import { useState } from "react";
import STYLES from "./styles";
import Sidebar               from "./components/Sidebar";
import Topbar                from "./components/Topbar";
import DashboardPage         from "./pages/DashboardPage";
import InventoryPage         from "./pages/InventoryPage";
import InventoryAlertPage    from "./pages/InventoryAlertPage";
import UsersPage             from "./pages/UsersPage";
import ComplaintsPage        from "./pages/ComplaintsPage";
import TransactionsPage      from "./pages/TransactionsPage";
import { CacheProvider }     from "./data/CacheContext";  

const PAGE_TITLES = {
  dashboard:      "Dashboard",
  inventory:      "Inventory",
  inventoryalert: "Inventory Alert",
  users:          "Users",
  transactions:   "Transactions",
};

const PAGES = {
  dashboard:      <DashboardPage />,
  inventory:      <InventoryPage />,
  inventoryalert: <InventoryAlertPage />,
  users:          <UsersPage />,
  complaints:     <ComplaintsPage />,
  transactions:   <TransactionsPage />,
};

export default function App() {
  const [page, setPage]           = useState("dashboard");
  const [collapsed, setCollapsed] = useState(false);

  return (
    // ↓ CacheProvider wraps everything so all pages share one cache
    <CacheProvider>
      <style>{STYLES}</style>
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css"
      />

      <div className="kp-wrapper">
        <Sidebar
          activePage={page}
          onNavigate={setPage}
          collapsed={collapsed}
        />

        <div className={`kp-content${collapsed ? " expanded" : ""}`}>
          <Topbar
            title={PAGE_TITLES[page]}
            onToggle={() => setCollapsed(c => !c)}
          />
          {PAGES[page]}
        </div>
      </div>
    </CacheProvider>
  );
}
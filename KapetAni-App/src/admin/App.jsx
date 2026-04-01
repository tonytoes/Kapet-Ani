import { useState } from "react";
import STYLES from "./styles";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import DashboardPage    from "./pages/DashboardPage";
import InventoryPage    from "./pages/InventoryPage";
import UsersPage        from "./pages/UsersPage";
import ComplaintsPage   from "./pages/ComplaintsPage";
import TransactionsPage from "./pages/TransactionsPage";

const PAGE_TITLES = {
  dashboard:    "Dashboard",
  inventory:    "Inventory",
  users:        "Users",
  complaints:   "Complaints",
  transactions: "Transactions",
};

const PAGES = {
  dashboard:    <DashboardPage />,
  inventory:    <InventoryPage />,
  users:        <UsersPage />,
  complaints:   <ComplaintsPage />,
  transactions: <TransactionsPage />,
};

export default function App() {
  const [page, setPage]           = useState("dashboard");
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
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
    </>
  );
}

import { useState, useMemo, useEffect, useCallback } from "react";
import Badge from "../components/Badge";
import PageHeader from "../components/PageHeader";
const API = "http://localhost/backend/controllers/transactionsController.php";

function authHeader() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState(null);
  const [search, setSearch]             = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortOrder, setSortOrder]       = useState("desc");

  const loadTransactions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res  = await fetch(API, { headers: authHeader() });
      const data = await res.json();
      if (data.success) setTransactions(data.transactions);
      else throw new Error(data.message);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadTransactions(); }, [loadTransactions]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();

    let res = transactions.filter(t =>
      t.username.toLowerCase().includes(q) ||
      t.id.toLowerCase().includes(q) ||
      t.paymentMode.toLowerCase().includes(q)
    );

    if (statusFilter !== "all") {
      res = res.filter(t => t.status === statusFilter);
    }

    // Sort by raw Unix timestamp — newest first (desc) or oldest first (asc)
    res = [...res].sort((a, b) =>
      sortOrder === "asc" ? a.timestamp - b.timestamp : b.timestamp - a.timestamp
    );

    return res;
  }, [transactions, search, statusFilter, sortOrder]);

  const statusCategories = [
    { value: "all",       label: "All" },
    { value: "pending",   label: "Pending" },
    { value: "confirmed", label: "Confirmed" },
    { value: "cancelled", label: "Cancelled" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1, overflow: "hidden" }}>
      <PageHeader
        title="Transaction Log"
        search={search}
        onSearch={setSearch}
        showCategories
        categories={statusCategories}
        categoryValue={statusFilter}
        onCategoryChange={setStatusFilter}
        sortOrder={sortOrder}
        onToggleSort={() => setSortOrder(prev => prev === "asc" ? "desc" : "asc")}
      />

      {error && (
        <div className="card card-padded" style={{ color: "#ef4444", margin: "0 0 16px" }}>
          {error}
        </div>
      )}

      <div className="full-table-wrap">
        <div className="table-scroll">
          <table className="dash-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Total Price</th>
                <th>Payment</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: "center", padding: 32 }}>
                    Loading transactions…
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: "center", padding: 32 }}>
                    No transactions found.
                  </td>
                </tr>
              ) : (
                filtered.map((t, i) => (
                  <tr key={`${t.id}-${i}`}>
                    <td className="cell-id">{t.id}</td>
                    <td className="cell-bold">{t.username}</td>
                    <td className="cell-muted">{t.orderAmount} item{t.orderAmount !== 1 ? "s" : ""}</td>
                    <td className="cell-amount">{t.totalPrice}</td>
                    <td className="cell-muted">{t.paymentMode}</td>
                    <td><Badge status={t.status} /></td>
                    <td className="cell-muted">{t.date}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
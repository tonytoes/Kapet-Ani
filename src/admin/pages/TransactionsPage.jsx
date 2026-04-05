import { useState, useMemo } from "react";
import PageHeader from "../components/PageHeader";
import { INITIAL_TRANSACTIONS } from "../data";

export default function TransactionsPage() {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() =>
    INITIAL_TRANSACTIONS.filter(t =>
      t.username.toLowerCase().includes(search.toLowerCase()) ||
      t.product.toLowerCase().includes(search.toLowerCase()) ||
      t.id.toLowerCase().includes(search.toLowerCase())
    ), [search]);

  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1, overflow: "hidden" }}>
      <PageHeader
        title="Transaction Log"
        search={search}
        onSearch={setSearch}
      />
      <div className="full-table-wrap">
        <div className="table-scroll">
          <table className="dash-table">
            <thead>
              <tr>
                <th>Order ID</th><th>Username</th><th>Product</th>
                <th>Order Amount</th><th>Total Price</th><th>Date</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((t, i) => (
                <tr key={`${t.id}-${i}`}>
                  <td className="cell-id">{t.id}</td>
                  <td className="cell-bold">{t.username}</td>
                  <td>{t.product}</td>
                  <td className="cell-muted">{t.orderAmount}</td>
                  <td className="cell-amount">{t.totalPrice}</td>
                  <td className="cell-muted">{t.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

import { useState, useMemo } from "react";
import Badge from "../components/Badge";
import PageHeader from "../components/PageHeader";
import SlidePanel from "../components/SlidePanel";
import { INITIAL_INVENTORY } from "../data";
import { nextId } from "../utils";

const EMPTY_FORM = { name: "", description: "", price: "", discount: "", category: "", stock: "", status: "Available" };

function InventoryForm({ form, onChange }) {
  const field = (label, id, type = "text", placeholder = "") => (
    <div className="form-group" key={id}>
      <label className="form-label">{label}</label>
      <input
        className="form-control"
        type={type}
        placeholder={placeholder}
        value={form[id]}
        onChange={e => onChange(id, e.target.value)}
      />
    </div>
  );

  return (
    <>
      <div className="panel-image-block">
        <div className="panel-img-placeholder"><i className="bi bi-image"></i></div>
        <div className="panel-img-actions">
          <button className="btn btn-outline btn-sm">Add Image</button>
          <button className="btn btn-outline btn-sm">Remove Image</button>
        </div>
      </div>

      {field("Name",     "name",     "text", "Product name")}
      {field("Category", "category", "text", "e.g. Local Coffee")}
      {field("Status",   "status",   "text", "Available")}

      <div className="form-group">
        <label className="form-label">Description</label>
        <textarea
          className="form-control"
          placeholder="Product description"
          rows={3}
          value={form.description}
          onChange={e => onChange("description", e.target.value)}
        />
      </div>

      <div className="form-row cols-2">
        <div className="form-group">
          <label className="form-label">Price</label>
          <div className="input-addon-wrap">
            <span className="input-addon left">$</span>
            <input className="form-control" type="number" placeholder="0"
              value={form.price} onChange={e => onChange("price", e.target.value)} />
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">Discount</label>
          <div className="input-addon-wrap">
            <input className="form-control" type="number" placeholder="0"
              value={form.discount} onChange={e => onChange("discount", e.target.value)} />
            <span className="input-addon">%</span>
          </div>
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Stocks</label>
        <input className="form-control" type="number" placeholder="0"
          value={form.stock} onChange={e => onChange("stock", e.target.value)} />
      </div>
    </>
  );
}

export default function InventoryPage() {
  const [items, setItems]         = useState(INITIAL_INVENTORY);
  const [search, setSearch]       = useState("");
  const [panelOpen, setPanelOpen] = useState(false);
  const [panelMode, setPanelMode] = useState("edit");
  const [selectedId, setSelectedId] = useState(null);
  const [form, setForm]           = useState(EMPTY_FORM);

  const filtered = useMemo(() =>
    items.filter(i =>
      i.name.toLowerCase().includes(search.toLowerCase()) ||
      i.category.toLowerCase().includes(search.toLowerCase()) ||
      i.id.toLowerCase().includes(search.toLowerCase())
    ), [items, search]);

  function updateForm(key, value) {
    setForm(prev => ({ ...prev, [key]: value }));
  }

  function openEdit(item) {
    setSelectedId(item.id);
    setForm({ name: item.name, description: item.description, price: item.price, discount: item.discount, category: item.category, stock: item.stock, status: item.status });
    setPanelMode("edit");
    setPanelOpen(true);
  }

  function openAdd() {
    setSelectedId(null);
    setForm(EMPTY_FORM);
    setPanelMode("add");
    setPanelOpen(true);
  }

  function handleClose() {
    setPanelOpen(false);
    setSelectedId(null);
  }

  function handleUpdate() {
    setItems(prev => prev.map(i =>
      i.id === selectedId
        ? { ...i, ...form, price: Number(form.price), discount: Number(form.discount), stock: Number(form.stock) }
        : i
    ));
    handleClose();
  }

  function handleDelete() {
    setItems(prev => prev.filter(i => i.id !== selectedId));
    handleClose();
  }

  function handleAdd() {
    setItems(prev => [...prev, {
      id: nextId(prev), ...form,
      price: Number(form.price), discount: Number(form.discount), stock: Number(form.stock),
      image: null,
    }]);
    handleClose();
  }

  const editFooter = (
    <>
      <button className="btn btn-delete" onClick={handleDelete}>Delete</button>
      <button className="btn btn-update" onClick={handleUpdate}>Update</button>
    </>
  );

  const addFooter = (
    <>
      <button className="btn btn-cancel" onClick={handleClose}>Cancel</button>
      <button className="btn btn-primary" onClick={handleAdd}>Add Product</button>
    </>
  );

  return (
    <>
      <div className="page-area">
        <PageHeader
          title="Inventory"
          onAdd={openAdd}
          search={search}
          onSearch={setSearch}
          showCategories
        />
        <div className="split-layout">
          <div className="split-table-wrap">
            <div className="table-scroll">
              <table className="dash-table">
                <thead>
                  <tr>
                    <th>Product ID</th><th>Name</th><th>Price</th>
                    <th>Discount</th><th>Stock</th><th>Category</th><th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(item => (
                    <tr
                      key={item.id}
                      className={`clickable${selectedId === item.id ? " selected" : ""}`}
                      onClick={() => openEdit(item)}
                    >
                      <td className="cell-id">{item.id}</td>
                      <td className="cell-bold">{item.name}</td>
                      <td>${item.price}</td>
                      <td>{item.discount}%</td>
                      <td>{item.stock}</td>
                      <td className="cell-muted">{item.category}</td>
                      <td><Badge status={item.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <SlidePanel
        isOpen={panelOpen}
        onClose={handleClose}
        title={panelMode === "add" ? "Add Product" : "Edit Product"}
        mode={panelMode}
        footer={panelMode === "edit" ? editFooter : addFooter}
      >
        <InventoryForm form={form} onChange={updateForm} />
      </SlidePanel>
    </>
  );
}

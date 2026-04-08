import { useState, useMemo } from "react";
import Badge from "../components/Badge";
import PageHeader from "../components/PageHeader";
import SlidePanel from "../components/SlidePanel";
import { INITIAL_INVENTORY_ALERTS } from "../data";
import { nextId } from "../utils";
import { selectedCategory } from "react";



const EMPTY_FORM = { name: "", description: "", price: "", discount: "", category: "", value: "", status: "Available" };


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
  
  // To change products depending on selected category. Need database to function (Not working for now)
  // const [selectedValue, setSelectedValue] = selectedCategory(form.category);
  //  

  return (
    <>
      {/* <div className="panel-image-block">
        <div className="panel-img-placeholder"><i className="bi bi-image"></i></div>
        <div className="panel-img-actions">
          <button className="btn btn-outline btn-sm">Add Image</button>
          <button className="btn btn-outline btn-sm">Remove Image</button>
        </div>
      </div> */}
            {/*Name       id,         type,  placeholder    */}
      {field("Rule Name",     "ruleName",     "text", "Rule name")}
      {/* {field("Category", "category", "select", "e.g. Local Coffee")} */}
      {/* {field("Status",   "status",   "text", "Available")} */}

      {/* <div className="form-group">
        <label className="form-label">Description</label>
        <textarea
          className="form-control"
          placeholder="Product description"
          rows={3}
          value={form.description}
          onChange={e => onChange("description", e.target.value)}
        />
      </div> */}
      {/* Category Select */}
      <div className="form-group">
        <label className="form-label">Category</label>
        <select
          className="form-control"
          value={form.category}
          name="category"
          onChange={e => onChange("category", e.target.value)}
        >
          <option value="Cold & Specialty Drinks">Cold & Specialty Drinks</option>
          <option value="Hand-Made Baskets">Hand-Made Baskets</option>
          <option value="Clay-Pot Mug">Clay-Pot Mug</option>
          <option value="Coaster Sets">Coaster Set</option>
        </select>
      </div>
      
      {/* Product Name */}
      {field("Name",     "name",     "text", "Product name")}

      <div className="form-row cols-2">    

        {/* Attribute */}
        <div className="form-group">
          <label className="form-label">Attribute</label>
          <select
            className="form-control"
            value={form.attribute}
            name="attribute"
            defaultValue={"Quantity"}
            onChange={e => onChange("attribute", e.target.value)}
          >
            <option value="Quantity">Quantity</option>
          </select>
        </div>

        {/* Conditions */}
        <div className="form-group">
          <label className="form-label">Condition</label>
          <select
            className="form-control"
            value={form.condition}
            name="condition"
            defaultValue={"GT"}
            onChange={e => onChange("condition", e.target.value)}
          >
            <option value="Greater Than">Greater Than</option>
            <option value="Less Than">Less Than</option>
            <option value="Equal To">Equal To</option>
            <option value="Greater Than or Equal To">Greater Than or Equal To</option>
            <option value="Less Than or Equal To">Less Than or Equal To</option>
          </select>
        </div>
      </div>  

      {/* <div className="form-row cols-2">
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
      </div> */}
      <div className="form-row cols-2">
        <div className="form-group">
          <label className="form-label">Value</label>
          <input className="form-control" type="number" placeholder="0"
            value={form.value} onChange={e => onChange("value", e.target.value)} />
        </div>

        <div className="form-group">
          <label className="form-label">Status</label>
          <select
            className="form-control"
            value={form.status}
            name="status"
            onChange={e => onChange("status", e.target.value)}
          >
            <option value="Available">Available</option>
            <option value="Unavailable">Unavailable</option>
          </select>
        </div>
      </div>
    </>
  );
}

export default function InventoryAlertPage() {
  const [items, setItems]         = useState(INITIAL_INVENTORY_ALERTS);
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
    setForm({ name: item.name, attribute: item.attribute, condition: item.condition, category: item.category, value: item.value, status: item.status });
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
        ? { ...i, ...form, price: Number(form.price), discount: Number(form.discount), value: Number(form.value) }
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
      price: Number(form.price), discount: Number(form.discount), value: Number(form.value),
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
          title="Inventory Alert"
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
                    <th>Product ID</th><th>Rule Name</th><th>Name</th><th>Attribute</th>
                    <th>Discount</th><th>Value</th><th>Category</th><th>Status</th>
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
                      <td className="cell-bold">{item.ruleName}</td>
                      <td className="cell-bold">{item.name}</td>
                      <td>{item.attribute}</td>
                      <td>{item.condition}</td>
                      <td>{item.value}</td>
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
        title={panelMode === "add" ? "Add Rule" : "Edit Rule"}
        mode={panelMode}
        footer={panelMode === "edit" ? editFooter : addFooter}
      >
        <InventoryForm form={form} onChange={updateForm} />
      </SlidePanel>
    </>
  );
}

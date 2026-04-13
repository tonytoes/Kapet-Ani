import { useState, useMemo, useEffect } from "react";
import Badge from "../components/Badge";
import PageHeader from "../components/PageHeader";
import SlidePanel from "../components/SlidePanel";
import { INITIAL_INVENTORY_ALERTS } from "../data";
import { nextId } from "../utils";
import { selectedCategory } from "react";
import axios from "axios";


const EMPTY_FORM = { ruleName: "", product_id: "0", category: "0", attribute: "0", condition: "", value: "", status: "0" };


function InventoryForm({ form, onChange }) {
  const [categories, setCategories] = useState([
    {"id":1,"name":"Cold and Specialty Drinks"},
    {"id":2,"name":"Hand-Made Baskets"},
    {"id":3,"name":"Clay-Pot Mug"},
    {"id":4,"name":"Coaster Set"}
  ]);
  const [products, setProducts] = useState([]);
  
  // const getProducts = (event) => {
  //   // const formData = new FormData();
  //   // formData.append ("category_id", form.categories);

  //   // axios.post("https://lightsteelblue-turkey-336447.hostingersite.com/backend/inventory_alert_backend/products.php") 
  //   axios.get(`https://lightsteelblue-turkey-336447.hostingersite.com/backend/inventory_alert_backend/products.php?category_id=${form.category}`)
  //     .then(res => {
  //       setProducts(res.data)
        
  //     })
  //     .catch(err => console.error(err));
  // }

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

  // Fetch categories once
  useEffect(() => {
    // axios.get("https://lightsteelblue-turkey-336447.hostingersite.com/backend/inventory_alert_backend/categories.php") // replace with your PHP endpoint
    axios.get("http://localhost/backend/inventory_alert_backend/categories.php")
    
      .then(res =>{ 
        if (Array.isArray(res.data)) {
          setCategories(res.data);
        } else {
          console.error('Invalid categories data:', res.data);
        }
        
      })
      .catch(err => console.error(err));
      
  }, []);
  useEffect(() => {
    if (!form.category) return;

    // axios.get(`https://lightsteelblue-turkey-336447.hostingersite.com/backend/inventory_alert_backend/products.php?category_id=${form.category}`)
    axios.get(`http://localhost/backend/inventory_alert_backend/products.php?category_id=${form.category}`)
    
      .then(res => {
        if (Array.isArray(res.data)) {
          setProducts(res.data);
        } else {
          console.error('Invalid products data:', res.data);
        }
      }) 
      .catch(err => console.error(err));

  }, [form.category]);

  return (
    <>
      
      {field("Rule Name",     "ruleName",     "text", "Rule name")}

      {/* Category */}
      <div className="form-group">
        <label className="form-label">Category</label>
        <select
          className="form-control"
          value={form.category || ""}
          onChange={e => {
            onChange("category", e.target.value)
            // getProducts();
            // console.log(form.category);
          }}
        >
          <option value="0">Select Category</option>
          {categories.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>
      
      {/* Product (depends on category) */}
      <div className="form-group">
        <label className="form-label">Product</label>
        <select
          className="form-control"
          value={form.product_id || ""}
          onChange={e => onChange("product_id", e.target.value)}
        >
          <option value="0">Select Product</option>
          {products.map(p => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
      </div>

      {/* <div className="form-row cols-2">     */}

        {/* Attribute
        <div className="form-group">
          <label className="form-label">Attribute</label>
          <select
            className="form-control"
            value={form.attribute}
            name="attribute"
            onChange={e => onChange("attribute", e.target.value)}
          >
            <option value="0" disabled>Select attribute</option>
            <option value="Quantity">Quantity</option>
          </select>
        </div> */}

        {/* Conditions */}
        <div className="form-group">
          <label className="form-label">Condition</label>
          <select
            className="form-control"
            value={form.condition}
            name="condition"
            onChange={e => onChange("condition", e.target.value)}
          >
            <option value="0" disabled>Select condition</option>
            <option value=">">Greater Than</option>
            <option value="<">Less Than</option>
            <option value="=">Equal To</option>
            <option value=">=">Greater Than or Equal To</option>
            <option value="<=">Less Than or Equal To</option>
          </select>
        </div>
      {/* </div>   */}


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
            <option value="0" disabled>Select condition</option>
            <option value="1">Online</option>
            <option value="2">Offline</option>
          </select>
        </div>
      </div>
    </>
  );
}

export default function InventoryAlertPage() {
   //SUBMIT
  const handleSubmit = (event)   => {
    event.preventDefault();
    

    // Use FormData to avoid JSON CORS preflight
    const formData = new FormData();
    formData.append("ruleName", form.ruleName);
    formData.append("product_id", form.product_id);
    formData.append("category", form.category);
    formData.append("attribute", form.attribute);
    formData.append("condition", form.condition);
    formData.append("value", form.value);
    formData.append("status", form.status);

    // axios.post("https://lightsteelblue-turkey-336447.hostingersite.com/backend/inventory_alert_backend/submit.php", formData)
       axios.post("http://localhost/backend/inventory_alert_backend/submit.php", formData)
      .then(res => {
        fetchProducts();
      })
      .catch(err => console.error(err));
    
  }; 

  const handleUpdate = (event) => {
    // Use FormData to avoid JSON CORS preflight
    const formData = new FormData();
    formData.append("rule_id", form.rule_id);
    formData.append("ruleName", form.ruleName);
    formData.append("product_id", form.product_id);
    formData.append("category", form.category);
    formData.append("attribute", form.attribute);
    formData.append("condition", form.condition);
    formData.append("value", form.value);
    formData.append("status", form.status);
    formData.append("created_at", form.created_at);

    // axios.post("https://lightsteelblue-turkey-336447.hostingersite.com/backend/inventory_alert_backend/submit.php", formData)
       axios.post("http://localhost/backend/inventory_alert_backend/update.php", formData)
      .then(res => {
        fetchProducts();
        handleClose();
      })
      .catch(err => console.error(err));
      
  }

  const handleDelete = (event) =>{
    const formData = new FormData();
    formData.append("rule_id", form.rule_id);
    
     axios.post("http://localhost/backend/inventory_alert_backend/delete.php", formData)
      .then(res => {
        fetchProducts();
      })
      .catch(err => console.error(err));
  }
  
  
  const [products, setProducts] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [items, setItems]         = useState([]);
  const [search, setSearch]       = useState("");
  const [panelOpen, setPanelOpen] = useState(false);
  const [panelMode, setPanelMode] = useState("edit");
  const [selectedId, setSelectedId] = useState(null);
  const [form, setForm]           = useState(EMPTY_FORM);

  const fetchProducts = (event) =>{
    // axios.get("https://lightsteelblue-turkey-336447.hostingersite.com/backend/inventory_alert_backend/fetch.php")
    axios.get("http://localhost/backend/inventory_alert_backend/fetch.php")
      .then(res => {
          console.log(res.data);
          setProducts(res.data);
          
        })
        .catch(err => console.error(err));
  }

  useEffect(() => {
        fetchProducts();
    },[]);


  // const filtered = useMemo(() =>
  //   alerts.filter(i =>
  //     i.category.toLowerCase().includes(search.toLowerCase()) ||
  //     i.id.toLowerCase().includes(search.toLowerCase())
  //   ), [alerts, search]);

  function updateForm(key, value) {
    setForm(prev => ({ ...prev, [key]: value }));
  }

  function openEdit(item) {
    setSelectedId(item.rule_id);
    setForm({ rule_id: item.rule_id, 
              ruleName: item.rule_name,
              product_id: item.product_id, 
              attribute: item.attribute, 
              condition: item.stock_condition, 
              category: item.category_id, 
              value: item.rule_value, 
              status: item.enabled, 
              created_at: item.created_at, 
              quantity: item.quantity});
              console.log(item.created_at);
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

  // function handleUpdate() {
  //   setItems(prev => prev.map(i =>
  //     i.id === selectedId
  //       ? { ...i, ...form, price: Number(form.price), discount: Number(form.discount), value: Number(form.value) }
  //       : i
  //   ));
  //   handleClose();
  // }

  // function handleDelete() {
  //   setItems(prev => prev.filter(i => i.id !== selectedId));
  //   handleClose();
  // }

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
      <button className="btn btn-primary" onClick={handleSubmit}>Add Product</button>
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
                    <th>Product ID</th><th>Rule Name</th><th>Name</th><th>Stock</th>
                    <th>Discount</th><th>Value</th><th>Category</th><th>Status</th><th>Alert</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(item => (
                    <tr
                      key={item.rule_id}
                      className={`clickable${selectedId === item.rule_id ? " selected" : ""}`}
                      onClick={() => openEdit(item)}
                    >
                      
                      <td className="cell-id">{item.rule_id}</td>
                      <td className="cell-bold">{item.rule_name}</td>
                      <td className="cell-bold">{item.product_name}</td>
                      <td>{item.quantity}</td>
                      <td>{item.stock_condition}</td>
                      <td>{item.rule_value}</td>
                      <td className="cell-muted">{item.category}</td>
                      <td><Badge status={item.status} /></td>
                      <td><Badge status={item.alert} /></td>
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


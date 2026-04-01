// ─── USERS ───────────────────────────────────────────────
export const INITIAL_USERS = [
  { id: "#0001", username: "Yumi Everrete",   email: "yumiyumidesu@gmail.com", password: "yumi123123",   totalSpent: "$10,030", status: "Customer", image: null },
  { id: "#0002", username: "Coffee_Master67", email: "s....l@gmail.com",        password: "ilovecofee67", totalSpent: "$0",      status: "Admin",    image: null },
];

// ─── INVENTORY ────────────────────────────────────────────
export const INITIAL_INVENTORY = [
  { id: "#0001", name: "Coffee Latte",    price: 100, discount: 0,  stock: 5,  category: "Local Coffee", status: "Available",   description: "It is best to start your day with a cup of coffee.", image: null },
  { id: "#0002", name: "Black Coffee",    price: 100, discount: 0,  stock: 5,  category: "Local Coffee", status: "Available",   description: "", image: null },
  { id: "#0003", name: "Green Coffee",    price: 80,  discount: 5,  stock: 12, category: "Local Coffee", status: "Available",   description: "", image: null },
  { id: "#0004", name: "Monster Cafe",    price: 120, discount: 0,  stock: 3,  category: "Specialty",    status: "Available",   description: "", image: null },
  { id: "#0005", name: "Bisaya Coffee",   price: 90,  discount: 0,  stock: 1,  category: "Local Coffee", status: "Available",   description: "", image: null },
  { id: "#0006", name: "Coffee Drugs",    price: 60,  discount: 0,  stock: 0,  category: "Specialty",    status: "Unavailable", description: "", image: null },
  { id: "#0007", name: "Banana Coffee",   price: 75,  discount: 10, stock: 8,  category: "Flavored",     status: "Available",   description: "", image: null },
  { id: "#0008", name: "Adrenaline Shot", price: 150, discount: 0,  stock: 4,  category: "Specialty",    status: "Available",   description: "", image: null },
];

// ─── COMPLAINTS ───────────────────────────────────────────
export const INITIAL_COMPLAINTS = [
  { id: "#0001", username: "Yumi Everrete", email: "yumiyumidesu@gmail.com", title: "Wrong Delivery", date: "March 4, 2026 12:30 AM", status: "Pending",  message: "I ordered 50 strong bully maguire coffee but instead i received 1 flaccid coffee that is past its expiry date... please fix this, or just refund my money." },
  { id: "#0002", username: "jayem",         email: "jmiura@gmail.com",        title: "Late Shipment",  date: "March 2, 2026 12:30 AM", status: "Resolved", message: "My order was supposed to arrive last week but it still hasn't shown up. Please check the status of my shipment." },
  { id: "#0003", username: "jayem",         email: "jmiura@gmail.com",        title: "Late Shipment",  date: "March 2, 2026 12:30 AM", status: "Resolved", message: "Same issue as before. Shipment was delayed again with no notification." },
];

// ─── TRANSACTIONS ─────────────────────────────────────────
export const INITIAL_TRANSACTIONS = [
  { id: "#0001", username: "Yumi Everrete", product: "Black Coffee", orderAmount: "10 pieces", totalPrice: "$1,000", date: "March 4, 2026 12:30 AM" },
  { id: "#0002", username: "Yumi Everrete", product: "Black Coffee", orderAmount: "10 pieces", totalPrice: "$1,000", date: "March 4, 2026 12:30 AM" },
  { id: "#0003", username: "Yumi Everrete", product: "Black Coffee", orderAmount: "10 pieces", totalPrice: "$1,000", date: "March 4, 2026 12:30 AM" },
  { id: "#0004", username: "Yumi Everrete", product: "Black Coffee", orderAmount: "10 pieces", totalPrice: "$1,000", date: "March 4, 2026 12:30 AM" },
];

// ─── DASHBOARD ────────────────────────────────────────────
export const DASHBOARD_DATA = {
  totalSales:  "$14,900.04",
  salesGrowth: "↑ 2.1%",
  salesMonth:  "$1,000.04",
  salesToday:  "$1,900.04",
  totalUsers:  304,
  newSignups:  10,
  pageViews:   "20.1k",
  complaints: [
    { name: "Wrong Delivery", status: "Pending" },
    { name: "Late Shipment",  status: "Resolved" },
    { name: "Poor Quality",   status: "Resolved" },
  ],
  topSelling: [
    { name: "Black Coffee",    pct: 81 },
    { name: "Green Coffee",    pct: 76 },
    { name: "Monster Cafe",    pct: 73 },
    { name: "Adrenaline Shot", pct: 61 },
    { name: "Tobacoo",         pct: 39 },
    { name: "Banana Coffee",   pct: 19 },
  ],
  recentOrders: [
    { id: "#1672", buyer: "MasterChief",  date: "March 4, 12:30 AM", amount: "$14,999", status: "Paid" },
    { id: "#1671", buyer: "Jimboy",       date: "March 2, 1:33 PM",  amount: "$19",     status: "Paid" },
    { id: "#1670", buyer: "TonyMalungay", date: "March 1, 5:56 PM",  amount: "$67",     status: "Paid" },
  ],
  lowStock: [
    { no: "#900", name: "Black Coffee",  remaining: 5, status: "Available" },
    { no: "#404", name: "Coffee Drugs",  remaining: 0, status: "Unavailable" },
    { no: "#169", name: "Bisaya Coffee", remaining: 1, status: "Available" },
  ],
};

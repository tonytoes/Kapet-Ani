import { createBrowserRouter, Navigate } from "react-router-dom";
import Home from "../pages/Home.jsx";
import About from "../pages/About.jsx";
import Contact from "../pages/contact.jsx";
import Product from "../pages/Product.jsx";
import Checkout from "../pages/Checkout.jsx";
import Blogs from "../pages/Blogs.jsx";
import Newsletter from "../components/layout/Newsletter.jsx";
import Footer from "../components/layout/Footer.jsx";
import Login from "../pages/Login.jsx";
import ProtectedRoute from "../routers/ProtectedRoute.jsx";
import DashboardPage from "../admin/pages/DashboardPage.jsx";
import InventoryPage from "../admin/pages/InventoryPage.jsx";
import UsersPage from "../admin/pages/UsersPage.jsx";
import ComplaintsPage from "../admin/pages/ComplaintsPage.jsx";
import TransactionsPage from "../admin/pages/TransactionsPage.jsx";

const router = createBrowserRouter([
  { path: "/", element: <Home /> },
  { path: "/about", element: <About /> },
  { path: "/contact", element: <Contact /> },
  { path: "/product", element: <Product /> },
  { path: "/login", element: <Login /> },
  { path: "/blogs", element: <><Blogs /><Newsletter /><Footer /></> },

  {
    path: "/checkout", element: (
      <ProtectedRoute>
        <Checkout />
      </ProtectedRoute>
    )
  },

  {
    path: "/admin", element: (
      <ProtectedRoute role={["admin", "superadmin"]}>
        <DashboardPage />
      </ProtectedRoute>
    )
  },
  {
    path: "/inventory", element: (
      <ProtectedRoute role={["admin", "superadmin", "staff"]}>
        <InventoryPage />
      </ProtectedRoute>
    )
  },
  {
    path: "/users", element: (
      <ProtectedRoute role={["admin", "superadmin"]}>
        <UsersPage />
      </ProtectedRoute>
    )
  },
  {
    path: "/complaints", element: (
      <ProtectedRoute role={["admin", "superadmin", "staff"]}>
        <ComplaintsPage />
      </ProtectedRoute>
    )
  },
  {
    path: "/history", element: (
      <ProtectedRoute role={["admin", "superadmin", "staff"]}>
        <TransactionsPage />
      </ProtectedRoute>
    )
  },
]);

export default router;
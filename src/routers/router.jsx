import { createBrowserRouter } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute.jsx";
import { Outlet } from "react-router-dom";

// public pages
import Home from "../pages/Home.jsx";
import About from "../pages/About.jsx";
import Contact from "../pages/Contact.jsx";
import Product from "../pages/Product.jsx";
import Blogs from "../pages/Blogs.jsx";
import Login from "../pages/Login.jsx";

// admin pages
import Admin from '../admin/App.jsx'  

const router = createBrowserRouter([
  { path: "/", element: <Home /> },
  { path: "/about", element: <About /> },
  { path: "/contact", element: <Contact /> },
  { path: "/product", element: <Product /> },
  { path: "/blogs", element: <Blogs /> },
  { path: "/login", element: <Login /> },

  {
    path: "/admin",
    element: (
      <ProtectedRoute roles={["admin", "superadmin"]}>
        <Outlet/>
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Admin /> },
    ],
  },
]);

export default router;
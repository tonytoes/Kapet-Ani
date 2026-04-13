import { createBrowserRouter } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute.jsx";
import { Outlet } from "react-router-dom";
import Home from "../pages/Home.jsx";
import About from "../pages/About.jsx";
import Contact from "../pages/contact.jsx";
import Product from "../pages/Product.jsx";
import Blogs from "../pages/Blogs.jsx";
import Login from "../pages/Login.jsx";
import User from "../pages/User.jsx";
import Checkout from "../pages/Checkout.jsx";
import Order from "../pages/Order.jsx";

import Admin from '../admin/App.jsx'  

const router = createBrowserRouter([
  { path: "/", element: <Home /> },
  { path: "/about", element: <About /> },
  { path: "/contact", element: <Contact /> },
  { path: "/product", element: <Product /> },
  { path: "/blogs", element: <Blogs /> },
  { path: "/login", element: <Login /> },
  { path: "/user", element: <User /> },
  { path: "/checkout", element: <Checkout /> },
  { path: "/order", element: <Order/> },


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
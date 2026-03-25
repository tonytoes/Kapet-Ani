import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home.jsx";
import About from "../pages/About.jsx";
import Contact from "../pages/Contact.jsx";
import Product from "../pages/Product.jsx";
import Checkout from "../pages/Checkout.jsx";
import Login from "../pages/Login.jsx";
import Order from "../pages/Order.jsx";
import Blogs from "../pages/Blogs.jsx";
import Navbar from "../components/layout/Navbar.jsx";
import Footer from "../components/layout/Footer.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <>
        <Home />
      </>
    ),
  },
  {
    path: "/about",
    element: (
      <>
        <About />
      </>
    ),
  },
  {
    path: "/contact",
    element: (
      <>
        <Contact />
      </>
    ),
  },
  {
    path: "/product/:id",
    element: (
      <>
        <Navbar />
        <Product />
        <Footer />
      </>
    ),
  },
  {
    path: "/checkout",
    element: (
      <>
        <Navbar />
        <Checkout />
        <Footer />
      </>
    ),
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/order",
    element: (
      <>
        <Navbar />
        <Order />
        <Footer />
      </>
    ),
  },
  {
    path: "/blogs",
    element: (
      <>
        <Navbar />
        <Blogs />
        <Footer />
      </>
    ),
  },
  {
    path: "/contact",
    element: (
      <>
        <Contact />
      </>
    ),
  },
]);

export default router;

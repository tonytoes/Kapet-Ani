import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home.jsx";
import About from "../pages/About.jsx";
import Contact from "../pages/contact.jsx";
import Product from "../pages/Product.jsx";
import Checkout from "../pages/Checkout.jsx";
import Blogs from "../pages/Blogs.jsx";
import Navbar from "../components/layout/Navbar.jsx";
import Footer from "../components/layout/Footer.jsx";
import Newsletter from "../components/layout/Newsletter.jsx"; 

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
    path: "/product",
    element: (
      <>
        <Product />
      </>
    ),
  },
  {
    path: "/blogs",
    element: (
      <>
        <Navbar />
        <Blogs />
        <Newsletter/>
        <Footer />
      </>
    ),
  },
]);

export default router;

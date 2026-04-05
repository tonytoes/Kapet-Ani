import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home.jsx";
import About from "../pages/About.jsx";
import Contact from "../pages/contact.jsx";
import Product from "../pages/Product.jsx";
import Checkout from "../pages/Checkout.jsx";
import Blogs from "../pages/Blogs.jsx";
import Footer from "../components/layout/Footer.jsx";
import Newsletter from "../components/layout/Newsletter.jsx"; 
import DashboardPage    from "../admin/pages/DashboardPage.jsx";
import InventoryPage    from "../admin/pages/InventoryPage.jsx";
import UsersPage        from "../admin/pages/UsersPage.jsx";
import ComplaintsPage   from "../admin/pages/ComplaintsPage.jsx";
import TransactionsPage from "../admin/pages/TransactionsPage.jsx";

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
        <Blogs />
        <Newsletter/>
        <Footer />
      </>
    ),
  },
  {
    path: "/admin",
    element: (
      <>
        <DashboardPage />
      </>
    ),
  },
  {
    path: "/inventory",
    element: (
      <>
        <InventoryPage />
      </>
    ),
  },
  {
    path: "/users",
    element: (
      <>
        <UsersPage />
      </>
    ),
  },
  {
    path: "/complaints",
    element: (
      <>
        <ComplaintsPage />
      </>
    ),
  },
  {
    path: "/history",
    element: (
      <>
        <TransactionsPage />
      </>
    ),
  },
  
]);

export default router;

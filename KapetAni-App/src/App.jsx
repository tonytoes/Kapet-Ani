import { useEffect } from "react";
import Home from "./pages/Home.jsx";
import Order from "./pages/Order.jsx";
import Login from "./pages/Login.jsx";
import Review from "./pages/Review.jsx";
import Footer from "./components/layout/Footer.jsx";
import Blogs from "./pages/Blogs.jsx";
import Navbar from "./components/layout/Navbar.jsx";

function App() {
  return (
 <>
      <div className="App">
        <Blogs/>
      </div>
    </>
  );
}

export default App;
